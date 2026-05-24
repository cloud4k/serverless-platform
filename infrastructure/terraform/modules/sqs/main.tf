resource "aws_sqs_queue" "inspection_queue" {
  name = "sip-inspection-queue"

  tags = {
    Name        = "Inspection Queue"
    Environment = "dev"
  }
}
