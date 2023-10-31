resource "aws_api_gateway_rest_api" "sleekscale_api" {
  name        = "${var.vendor}-${var.project}-${var.purpose}-iac"
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
  "TableName": "${var.vendor}-${var.project}-${var.purpose}-iac-status",
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
  name = "${var.vendor}-${var.project}-${var.purpose}-iac-dynamo2-role"
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

resource "aws_iam_role_policy_attachment" "${var.vendor}-${var.project}-${var.purpose}-iac-dynamo-policy" {
  role       = aws_iam_role.sleekscale_dynamo_role.name
  policy_arn = "arn:aws:iam::${var.account_id}:policy/${var.vendor}-${var.project}-${var.purpose}-iac-dynamo-policy"
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


resource "aws_iam_policy" "custom_dynamo_policy" {
  name        = "${var.vendor}-${var.project}-${var.purpose}-iac-dynamo-policy"
  description = "Custom policy for DynamoDB access"

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action   = "dynamodb:*",
        Resource = "arn:aws:dynamodb:${var.region}:${var.account_id}:table/${var.vendor}-${var.project}-${var.purpose}-iac-status",
        Effect   = "Allow"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "${var.vendor}-${var.project}-${var.purpose}-iac-dynamo-policy-attachment" {
  role       = aws_iam_role.sleekscale_dynamo_role.name
  policy_arn = aws_iam_policy.custom_dynamo_policy.arn
}
