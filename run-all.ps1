param(
  # Ganti kalau path project kamu beda
  [string]$ProjectRoot = "D:\kumpulbareng",

  # Nama docker network
  [string]$NetworkName = "kumpulbareng-net",

  # Konfigurasi database
  [string]$DbUser     = "myuser",
  [string]$DbPassword = "mypassword",
  [string]$DbName     = "kumpulbareng_db",

  # ==== ISI INI DENGAN KREDENSIAL PUNYAMU ====
  [string]$MidtransServerKey = "Mid-server-ISI_PUNYAMU_DI_SINI",
  [string]$MidtransClientKey = "Mid-client-ISI_PUNYAMU_DI_SINI",
  [string]$JwtSecret         = "ganti_jwt_secret_yang_panjang_dan_random"
)

Write-Host "== Pindah ke project root: $ProjectRoot"
Set-Location $ProjectRoot

# ============================
# 1) Buat docker network
# ============================
Write-Host "== Cek / buat docker network '$NetworkName'..."

$existingNetworks = docker network ls --format '{{.Name}}'
if (-not ($existingNetworks -contains $NetworkName)) {
  docker network create $NetworkName | Out-Null
  Write-Host "   -> Network '$NetworkName' dibuat."
}
else {
  Write-Host "   -> Network '$NetworkName' sudah ada."
}

# ============================
# 2) Hapus container lama (kalau ada)
# ============================
Write-Host "== Menghapus container lama (kb-client, kb-server, kb-postgres) jika ada..."

$containers = @("kb-client", "kb-server", "kb-postgres")
foreach ($c in $containers) {
  $exists = docker ps -a --format '{{.Names}}' | Where-Object { $_ -eq $c }
  if ($exists) {
    Write-Host "   -> Menghapus container $c"
    docker rm -f $c | Out-Null
  }
}

# ============================
# 3) Jalankan PostgreSQL
# ============================
Write-Host "== Menjalankan container database: kb-postgres"

docker run -d `
  --name kb-postgres `
  --network $NetworkName `
  -e POSTGRES_USER=$DbUser `
  -e POSTGRES_PASSWORD=$DbPassword `
  -e POSTGRES_DB=$DbName `
  -v kb-db-data:/var/lib/postgresql/data `
  -p 5432:5432 `
  postgres:15 | Out-Null

# ============================
# 4) Build & jalankan backend
# ============================
Write-Host "== Build image backend: kb-server"
Set-Location "$ProjectRoot\server"

docker build -t kb-server . 

Write-Host "== Menjalankan container backend: kb-server"
$databaseUrl = "postgresql://$DbUser:$DbPassword@kb-postgres:5432/$DbName"

docker run -d `
  --name kb-server `
  --network $NetworkName `
  -p 5000:5000 `
  -e PORT=5000 `
  -e NODE_ENV=production `
  -e CLIENT_URL="http://localhost:3000" `
  -e DATABASE_URL=$databaseUrl `
  -e MIDTRANS_SERVER_KEY=$MidtransServerKey `
  -e MIDTRANS_CLIENT_KEY=$MidtransClientKey `
  -e JWT_SECRET=$JwtSecret `
  -e ENABLE_NGROK="false" `
  kb-server | Out-Null

# ============================
# 5) Build & jalankan frontend
# ============================
Write-Host "== Build image frontend: kb-client"
Set-Location "$ProjectRoot\client"

docker build -t kb-client . 

Write-Host "== Menjalankan container frontend: kb-client"

docker run -d `
  --name kb-client `
  --network $NetworkName `
  -p 3000:3000 `
  -e NEXT_PUBLIC_API_URL="http://localhost:5000" `
  kb-client | Out-Null

# ============================
# 6) Ringkasan
# ============================
Write-Host ""
Write-Host "=== Containers yang jalan sekarang ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

Write-Host ""
Write-Host "=== Langkah selanjutnya ===" -ForegroundColor Yellow
Write-Host "1. Buka terminal baru (jangan tutup yang ini) lalu jalankan:"
Write-Host "     ngrok http 5000" -ForegroundColor Cyan
Write-Host "2. Ambil URL Forwarding 'https://xxxxx.ngrok-free.app' dari output ngrok."
Write-Host "3. Di Midtrans Dashboard (Sandbox) set Payment Notification URL jadi:"
Write-Host "     https://xxxxx.ngrok-free.app/api/payments/notification" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000"
Write-Host "Frontend: http://localhost:3000"


#.\run-all.ps1
