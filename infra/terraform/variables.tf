variable "namespace" {
  description = "Namespace Kubernetes untuk aplikasi KumpulBareng"
  type        = string
  default     = "kumpulbareng"
}

# Konfigurasi aplikasi
variable "client_url" {
  description = "URL yang diakses user di browser (dipakai untuk CORS backend)"
  type        = string
  default     = "http://localhost:3000"
}

variable "next_public_api_url" {
  description = "URL API yang dipakai frontend (Next.js) di browser"
  type        = string
  default     = "http://localhost:5000"
}

# Postgres
variable "db_user" {
  description = "Postgres username"
  type        = string
  default     = "myuser"
}

variable "db_password" {
  description = "Postgres password"
  type        = string
  sensitive   = true
  default     = "mypassword"
}

variable "db_name" {
  description = "Postgres database name"
  type        = string
  default     = "kumpulbareng_db"
}

# Midtrans & JWT & Ngrok
variable "midtrans_server_key" {
  description = "Midtrans Server Key"
  type        = string
  sensitive   = true
}

variable "midtrans_client_key" {
  description = "Midtrans Client Key"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret untuk backend"
  type        = string
  sensitive   = true
}

variable "ngrok_authtoken" {
  description = "Ngrok auth token"
  type        = string
  sensitive   = true
}

# Local helper (tidak perlu diisi)
locals {
  database_url = "postgresql://${var.db_user}:${var.db_password}@postgres:5432/${var.db_name}"
}
