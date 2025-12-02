terraform {
  required_version = ">= 1.3.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.22.0"
    }
  }
}

provider "kubernetes" {
  # Terraform akan pakai kubeconfig lokal (Docker Desktop)
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"
}

# Namespace utama aplikasi
resource "kubernetes_namespace" "kb" {
  metadata {
    name = var.namespace
  }
}
