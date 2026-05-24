output "queue_url" {
  description = "URL of the inspection SQS queue"
  value       = aws_sqs_queue.inspection_queue.url
}

output "queue_arn" {
  description = "ARN of the inspection SQS queue"
  value       = aws_sqs_queue.inspection_queue.arn
}
output "queue_name" {
  description = "Name of the inspection SQS queue"
  value       = aws_sqs_queue.inspection_queue.name
}
