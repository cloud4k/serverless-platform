terraform {
  backend "s3" {
    bucket         = "harjotscloud-shared-terraform-state"
    key            = "serverless-platform/dev.tfstate"
    region         = "us-east-1"
    dynamodb_table = "harjotscloud-shared-terraform-locks"
    encrypt        = true
  }
}
