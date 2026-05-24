output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]
}

output "lambda_security_group_id" {
  value = aws_security_group.lambda_sg.id
}
output "private_route_table_ids" {
  value = [aws_route_table.private_rt.id]
}
output "vpc_endpoint_security_group_id" {
  value = aws_security_group.vpc_endpoint_sg.id
}