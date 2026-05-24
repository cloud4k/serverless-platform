resource "aws_apigatewayv2_api" "inspection_api" {
  name          = "sip-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["content-type"]
  }

  tags = {
    Name        = "SIP HTTP API"
    Environment = "dev"
  }
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.inspection_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "create_inspection_integration" {
  api_id                 = aws_apigatewayv2_api.inspection_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.create_inspection_lambda_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "post_inspection_route" {
  api_id    = aws_apigatewayv2_api.inspection_api.id
  route_key = "POST /inspection"
  target    = "integrations/${aws_apigatewayv2_integration.create_inspection_integration.id}"
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.create_inspection_lambda_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.inspection_api.execution_arn}/*/*"
}
resource "aws_apigatewayv2_route" "upload_url_route" {
  api_id    = aws_apigatewayv2_api.inspection_api.id
  route_key = "POST /upload-url"

  target = "integrations/${aws_apigatewayv2_integration.create_inspection_integration.id}"
}