
provider "aws" {
  region = var.region
  profile = "aws6"
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
