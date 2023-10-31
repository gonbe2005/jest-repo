variable "workspace" {
  description = "The current workspace."
  type        = string
}

variable "account_id" {
  description = "The AWS account ID."
  type        = string
}

variable "region" {
  description = "The AWS region."
  type        = string
}

# Variable related to the DynamoDB integration
variable "dynamo_integration_credentials" {
  description = "The ARN of the IAM role for the DynamoDB integration."
  type        = string
}
