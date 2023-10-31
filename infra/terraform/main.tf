
provider "aws" {
  region      = var.region
  access_key  = var.AWS_ACCESS_KEY_ID
  secret_key  = var.AWS_SECRET_ACCESS_KEY
}

module "api_gateway" {
  dynamo_integration_credentials = "arn:aws:iam::${var.account_id}:role/${var.vendor}-${var.project}-${var.purpose}-iac-dynamo-role"
  source    = "./modules/api_gateway"
  vendor = var.vendor
  project = var.project
  purpose = var.purpose
  account_id = var.account_id
  region     = var.region
}

module "dynamodb_tables" {
  source    = "./modules/dynamodb"
  vendor = var.vendor
  project = var.project
  purpose = var.purpose
}
