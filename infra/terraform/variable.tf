variable "workspace" {
  description = "The current workspace."
  default     = "dev"
}
variable "account_id" {
  description = "AWS Account ID"
  type        = string
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
