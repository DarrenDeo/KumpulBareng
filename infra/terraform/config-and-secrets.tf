############################
# ConfigMap (konfigurasi non-rahasia)
############################
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "kb-app-config"
    namespace = var.namespace
  }

  data = {
    CLIENT_URL          = var.client_url
    NEXT_PUBLIC_API_URL = var.next_public_api_url

    # Konfigurasi database untuk backend
    DB_HOST      = "postgres"                     # pakai nama SERVICE di Kubernetes
    DB_PORT      = "5432"
    DB_USER      = var.db_user
    DB_NAME      = var.db_name

    # Koneksi full, dipakai oleh backend sebagai DATABASE_URL
    DATABASE_URL = "postgresql://${var.db_user}:${var.db_password}@postgres:5432/${var.db_name}"
  }
}

############################
# Secret (credentials & key sensitif)
############################
resource "kubernetes_secret" "app_secrets" {
  metadata {
    name      = "kb-app-secrets"
    namespace = var.namespace
  }

  data = {
    DB_PASSWORD         = var.db_password
    MIDTRANS_SERVER_KEY = var.midtrans_server_key
    MIDTRANS_CLIENT_KEY = var.midtrans_client_key
    JWT_SECRET          = var.jwt_secret
    NGROK_AUTHTOKEN     = var.ngrok_authtoken
  }

  type = "Opaque"
}
