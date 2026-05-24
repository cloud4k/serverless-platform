variable "vpc_id" {
  type = string
}

variable "private_route_table_ids" {
  type = list(string)
}
variable "private_subnet_ids" {
  type = list(string)
}

variable "vpc_endpoint_security_group_id" {
  type = string
}