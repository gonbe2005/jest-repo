variable "account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "region" {
  description = "AWS Region"
  type        = string
}

variable "vendor" {
  description = "Vendor name"
  type        = string
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "purpose" {
  description = "Purpose for the infrastructure"
  type        = string
}

variable "dynamo_integration_credentials" {
  description = "ARN for DynamoDB integration credentials"
  type        = string
}
