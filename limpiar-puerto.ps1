# Script para limpiar el puerto 9002 y ejecutar npm run dev
# Uso: .\limpiar-puerto.ps1

Write-Host "🔄 Limpiando puerto 9002..." -ForegroundColor Yellow

# Matar todos los procesos Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Esperar a que se libere
Start-Sleep -Seconds 2

Write-Host "✅ Puerto liberado" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan
Write-Host ""

# Ejecutar npm run dev
npm run dev
