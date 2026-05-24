module "iam" {
  source            = "./shared/iam"
  upload_bucket_arn = module.s3.bucket_arn
}

module "dynamodb" {
  source = "./modules/dynamodb"
}
module "sqs" {
  source = "./modules/sqs"
}
module "sns" {
  source = "./modules/sns"

  notification_email = var.notification_email
}
module "lambda" {
  source = "./modules/lambda"

  lambda_role_arn          = module.iam.lambda_role_arn
  dynamodb_table_name      = module.dynamodb.table_name
  sqs_queue_url            = module.sqs.queue_url
  sqs_queue_arn            = module.sqs.queue_arn
  sns_topic_arn            = module.sns.topic_arn
  upload_bucket_name       = module.s3.bucket_name
  private_subnet_ids       = module.vpc.private_subnet_ids
  lambda_security_group_id = module.vpc.lambda_security_group_id
}
module "api_gateway" {
  source = "./modules/api-gateway"

  create_inspection_lambda_invoke_arn = module.lambda.create_inspection_lambda_invoke_arn
  create_inspection_lambda_name       = module.lambda.create_inspection_lambda_name
}
module "s3" {
  source = "./modules/s3"

  frontend_bucket_name = var.frontend_bucket_name
}
module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}
module "vpc" {
  source = "./modules/vpc"
}
module "vpc_endpoints" {
  source = "./modules/vpc-endpoints"

  vpc_id                         = module.vpc.vpc_id
  private_route_table_ids        = module.vpc.private_route_table_ids
  private_subnet_ids             = module.vpc.private_subnet_ids
  vpc_endpoint_security_group_id = module.vpc.vpc_endpoint_security_group_id
}