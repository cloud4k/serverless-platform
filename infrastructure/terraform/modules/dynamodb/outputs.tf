output "table_name" {
  description = "Name of the DynamoDB inspection table"
  value       = aws_dynamodb_table.inspection_table.name
}

output "table_arn" {
  description = "ARN of the DynamoDB inspection table"
  value       = aws_dynamodb_table.inspection_table.arn
}

