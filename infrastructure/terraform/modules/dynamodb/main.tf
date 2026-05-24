resource "aws_dynamodb_table" "inspection_table" {
  name         = "sip-inspection-table"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "inspectionId"

  attribute {
    name = "inspectionId"
    type = "S"
  }

  tags = {
    Name        = "Inspection Table"
    Environment = "dev"
  }
}
