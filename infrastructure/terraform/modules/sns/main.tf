resource "aws_sns_topic" "inspection_topic" {
  name = "sip-inspection-topic"

  tags = {
    Name        = "Inspection Topic"
    Environment = "dev"
  }
}
resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.inspection_topic.arn
  protocol  = "email"
  endpoint  = var.notification_email
}
