output "create_inspection_lambda_name" {
  value = aws_lambda_function.create_inspection_lambda.function_name
}

output "create_inspection_lambda_arn" {
  value = aws_lambda_function.create_inspection_lambda.arn
}

output "create_inspection_lambda_invoke_arn" {
  value = aws_lambda_function.create_inspection_lambda.invoke_arn
}

output "worker_lambda_name" {
  value = aws_lambda_function.worker_lambda.function_name
}

output "worker_lambda_arn" {
  value = aws_lambda_function.worker_lambda.arn
}