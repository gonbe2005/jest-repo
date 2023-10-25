variable "workspace" {
  description = "The current workspace."
  default     = "dev"
}
variable "account_id" {
  description = "AWS Account ID"
  type        = string
}

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

variable "region" {
  description = "AWS Region"
  type        = string
  default     = "ap-northeast-3"
}

variable "api_gateway_id" {
  description = "API Gateway ID"
  type        = string
  default     = "dummy_value"
}
