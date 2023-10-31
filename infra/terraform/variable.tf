variable "AWS_ACCESS_KEY_ID" {
  description = "AWS Access Key ID"
  type        = string
  default     = ""
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS Secret Access Key"
  type        = string
  default     = ""
}

variable "account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "region" {
  description = "AWS Region"
  type        = string
}

variable "api_gateway_id" {
  description = "API Gateway ID"
  type        = string
  default     = "dummy_value"
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
