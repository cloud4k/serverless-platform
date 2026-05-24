variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "serverless-platform"
}

variable "frontend_bucket_name" {
  description = "Frontend S3 bucket name"
  type        = string
  default     = "sip-frontend-harjot-2026"
}
variable "notification_email" {
  description = "Email address for SNS inspection notifications"
  type        = string
}
