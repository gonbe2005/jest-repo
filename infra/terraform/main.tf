
provider "aws" {
  region      = "var.region"
  access_key  = var.AWS_ACCESS_KEY_ID
  secret_key  = var.AWS_SECRET_ACCESS_KEY
}

module "api_gateway" {
  source    = "./modules/api_gateway"
  workspace = var.workspace
  account_id = var.account_id
  region     = var.region
}

module "dynamodb_tables" {
  source    = "./modules/dynamodb"
  workspace = var.workspace
}
