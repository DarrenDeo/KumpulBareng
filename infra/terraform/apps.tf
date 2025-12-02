########################################
# Backend: kb-server
########################################
resource "kubernetes_deployment" "kb_server" {
  metadata {
    name      = "kb-server"
    namespace = kubernetes_namespace.kb.metadata[0].name
    labels = {
      app = "kb-server"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "kb-server"
      }
    }

    template {
      metadata {
        labels = {
          app = "kb-server"
        }
      }

      spec {
        container {
          name  = "kb-server"
          image = "kb-server"          # image lokal
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 5000
          }

          env {
            name  = "PORT"
            value = "5000"
          }

          env {
            name  = "NODE_ENV"
            value = "production"
          }

          # CORS origin
          env {
            name = "CLIENT_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.app_config.metadata[0].name
                key  = "CLIENT_URL"
              }
            }
          }

          # Prisma DATABASE_URL
          env {
            name = "DATABASE_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.app_config.metadata[0].name
                key  = "DATABASE_URL"
              }
            }
          }

          env {
            name = "MIDTRANS_SERVER_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "MIDTRANS_SERVER_KEY"
              }
            }
          }

          env {
            name = "MIDTRANS_CLIENT_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "MIDTRANS_CLIENT_KEY"
              }
            }
          }

          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "JWT_SECRET"
              }
            }
          }

          # Ngrok tidak dijalankan di dalam backend lagi (kita punya pod sendiri)
          env {
            name  = "ENABLE_NGROK"
            value = "false"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "kb_server" {
  metadata {
    name      = "kb-server"
    namespace = kubernetes_namespace.kb.metadata[0].name
  }

  spec {
    selector = {
      app = "kb-server"
    }

    port {
      name        = "http"
      port        = 5000
      target_port = 5000
    }
  }
}

########################################
# Frontend: kb-client
########################################
resource "kubernetes_deployment" "kb_client" {
  metadata {
    name      = "kb-client"
    namespace = kubernetes_namespace.kb.metadata[0].name
    labels = {
      app = "kb-client"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "kb-client"
      }
    }

    template {
      metadata {
        labels = {
          app = "kb-client"
        }
      }

      spec {
        container {
          name  = "kb-client"
          image = "kb-client"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 3000
          }

          env {
            name = "NEXT_PUBLIC_API_URL"
            value_from {
              config_map_key_ref {
                name = kubernetes_config_map.app_config.metadata[0].name
                key  = "NEXT_PUBLIC_API_URL"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "kb_client" {
  metadata {
    name      = "kb-client"
    namespace = kubernetes_namespace.kb.metadata[0].name
  }

  spec {
    selector = {
      app = "kb-client"
    }

    port {
      name        = "http"
      port        = 3000
      target_port = 3000
    }
  }
}

########################################
# Ngrok: kb-ngrok (tunnel ke kb-server)
########################################
resource "kubernetes_deployment" "kb_ngrok" {
  metadata {
    name      = "kb-ngrok"
    namespace = kubernetes_namespace.kb.metadata[0].name
    labels = {
      app = "kb-ngrok"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "kb-ngrok"
      }
    }

    template {
      metadata {
        labels = {
          app = "kb-ngrok"
        }
      }

      spec {
        container {
          name  = "ngrok"
          image = "ngrok/ngrok:alpine"

          env {
            name = "NGROK_AUTHTOKEN"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.app_secrets.metadata[0].name
                key  = "NGROK_AUTHTOKEN"
              }
            }
          }

          # Sama seperti yang kamu jalankan manual: ngrok http kb-server:5000
          args = [
            "http",
            "kb-server:5000"
          ]
        }
      }
    }
  }
}
