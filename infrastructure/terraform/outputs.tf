output "frontend_bucket_name" {
  value = module.s3.bucket_name
}

output "api_endpoint" {
  value = module.api_gateway.api_endpoint
}

output "sqs_queue_name" {
  value = module.sqs.queue_name
}

output "sns_topic_arn" {
  value = module.sns.topic_arn
}

output "dynamodb_table_name" {
  value = module.dynamodb.table_name
}
output "cloudfront_domain" {
  value = module.cloudfront.cloudfront_domain_name
}
output "cloudfront_distribution_id" {
  value = module.cloudfront.cloudfront_distribution_id
}
