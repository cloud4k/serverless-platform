output "bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "bucket_arn" {
  value = aws_s3_bucket.frontend_bucket.arn
}

output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.frontend_website.website_endpoint
}
output "bucket_regional_domain_name" {
  value = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
}