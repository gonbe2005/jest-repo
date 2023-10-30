resource "aws_api_gateway_rest_api" "sleekscale_api" {
  name        = "${var.workspace}-sleekscale"
  description = "API Gateway for ${var.workspace}"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

locals {
  dynamo_function_settings = {
    "status" = {
      "http_method"         = "PUT",
      "integration_method"  = "POST",
      "uri"                 = "arn:aws:apigateway:${var.region}:dynamodb:action/PutItem",
      "credentials"         = var.dynamo_integration_credentials,
      "request_template"    = <<-EOT
{
  "TableName": "${var.workspace}-sleekscale-status",
  "Item": {
    "userId": { "S": $input.json('$.userId') },
    "mDt": { "S": $input.json('$.mDt') },
    "lat": { "S": $input.json('$.lat') },
    "lng": { "S": $input.json('$.lng') },
    "speed": { "N": "$input.json('$.speed')" },
    "driveMode": { "N": "$input.json('$.driveMode')" },
    "charge": { "N": "$input.json('$.charge')" },
    "driveUnitErr": { "S": $input.json('$.driveUnitErr') },
    "lockState": { "BOOL": $input.json('$.lockState') },
    "lockId": { "S": $input.json('$.lockId') },
    "lockErr": { "S": $input.json('$.lockErr') }
  },
  "ReturnValues": "ALL_OLD"
}
EOT
    }
  }
}

resource "aws_api_gateway_resource" "dynamo_resources" {
  for_each    = toset(keys(local.dynamo_function_settings))
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  parent_id   = aws_api_gateway_rest_api.sleekscale_api.root_resource_id
  path_part   = each.value
}

resource "aws_api_gateway_method" "dynamo_methods" {
  for_each    = toset(keys(local.dynamo_function_settings))
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  resource_id = aws_api_gateway_resource.dynamo_resources[each.key].id
  http_method = local.dynamo_function_settings[each.key].http_method
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "dynamo_integrations" {
  for_each    = toset(keys(local.dynamo_function_settings))
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  resource_id = aws_api_gateway_resource.dynamo_resources[each.key].id
  http_method = local.dynamo_function_settings[each.key].http_method
  integration_http_method = local.dynamo_function_settings[each.key].integration_method
  type                    = "AWS"
  uri                     = local.dynamo_function_settings[each.key].uri
  credentials             = aws_iam_role.sleekscale_dynamo_role.arn
  passthrough_behavior    = "WHEN_NO_TEMPLATES"
  request_templates = {
    "application/json" = local.dynamo_function_settings[each.key].request_template
  }
  depends_on = [aws_api_gateway_method.dynamo_methods]
}

resource "aws_api_gateway_integration_response" "dynamo_integration_responses" {
  for_each    = toset(keys(local.dynamo_function_settings))
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  resource_id = aws_api_gateway_resource.dynamo_resources[each.key].id
  http_method = local.dynamo_function_settings[each.key].http_method
  status_code = "200"
  response_templates = {
    "application/json" = <<-EOT
      #set($inputRoot = $input.path('$'))
      {"userId":"$inputRoot.Attributes.userId.S","rDt":"$inputRoot.Attributes.mDt.S"}
    EOT
  }
  depends_on = [
    aws_api_gateway_method.dynamo_methods,
    aws_api_gateway_integration.dynamo_integrations
  ]
}

resource "aws_api_gateway_deployment" "sleekscale_deployment" {
  depends_on  = [aws_api_gateway_integration.dynamo_integrations, aws_api_gateway_method.dynamo_methods]
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  stage_name  = "prod"
  stage_description = "Production Stage"
  description = "Deployment for ${terraform.workspace}"
}

resource "aws_iam_role" "sleekscale_dynamo_role" {
  name = "${var.workspace}-sleekscale-dynamo2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "apigateway.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = ""
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "sleekscale_dynamo_full_access" {
  role       = aws_iam_role.sleekscale_dynamo_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_api_gateway_method_response" "dynamo_method_responses" {
  for_each    = toset(keys(local.dynamo_function_settings))
  rest_api_id = aws_api_gateway_rest_api.sleekscale_api.id
  resource_id = aws_api_gateway_resource.dynamo_resources[each.key].id
  http_method = local.dynamo_function_settings[each.key].http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }
  depends_on = [aws_api_gateway_method.dynamo_methods]
}

output "api_gateway_endpoint" {
  value       = aws_api_gateway_deployment.sleekscale_deployment.invoke_url
  description = "The URL of the deployed API Gateway"
}