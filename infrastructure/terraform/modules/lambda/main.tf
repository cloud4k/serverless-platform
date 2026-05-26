data "archive_file" "create_inspection_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/create-inspection"
  output_path = "${path.root}/../../backend/create-inspection/function.zip"
}

resource "aws_lambda_function" "create_inspection_lambda" {
  function_name = "sip-create-inspection-lambda"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  role          = var.lambda_role_arn

  filename         = data.archive_file.create_inspection_zip.output_path
  source_code_hash = data.archive_file.create_inspection_zip.output_base64sha256

  timeout = 30

  environment {
    variables = {
      TABLE_NAME    = var.dynamodb_table_name
      QUEUE_URL     = var.sqs_queue_url
      UPLOAD_BUCKET = var.upload_bucket_name
      SNS_TOPIC_ARN = var.sns_topic_arn

    }
  }
  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  tags = {
    Name        = "Create Inspection Lambda"
    Environment = "dev"
  }
}

data "archive_file" "worker_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend/worker"
  output_path = "${path.root}/../../backend/worker/function.zip"
}

resource "aws_lambda_function" "worker_lambda" {
  function_name = "sip-worker-lambda"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  role          = var.lambda_role_arn

  filename         = data.archive_file.worker_zip.output_path
  source_code_hash = data.archive_file.worker_zip.output_base64sha256

  timeout = 15
  environment {
    variables = {
      TABLE_NAME    = var.dynamodb_table_name
      QUEUE_URL     = var.sqs_queue_url
      UPLOAD_BUCKET = var.upload_bucket_name
      SNS_TOPIC_ARN = var.sns_topic_arn
    }
  }
  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.lambda_security_group_id]
  }

  tags = {
    Name        = "Worker Lambda"
    Environment = "dev"
  }
}

resource "aws_lambda_event_source_mapping" "sqs_worker_trigger" {
  event_source_arn = var.sqs_queue_arn
  function_name    = aws_lambda_function.worker_lambda.arn
  batch_size       = 1
}