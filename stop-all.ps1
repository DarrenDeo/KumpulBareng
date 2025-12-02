# Hentikan dan hapus container utama project KumpulBareng

$containers = @("kb-client", "kb-server", "kb-postgres")

foreach ($c in $containers) {
  $exists = docker ps -a --format '{{.Names}}' | Where-Object { $_ -eq $c }
  if ($exists) {
    Write-Host "Menghapus container $c..."
    docker rm -f $c | Out-Null
  }
  else {
    Write-Host "Container $c tidak ditemukan, skip."
  }
}

Write-Host "Selesai. Semua container utama sudah dihentikan."
