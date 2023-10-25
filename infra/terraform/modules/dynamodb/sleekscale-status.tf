resource "aws_dynamodb_table" "sleekscale_status" {
  name           = "${var.workspace}-sleekscale-status"
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "userId"
  range_key      = "mDt"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "mDt"
    type = "S"
  }
}
