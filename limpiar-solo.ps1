# Script para SOLO limpiar el puerto 9002 (sin iniciar npm run dev)
# Uso: .\limpiar-solo.ps1

Write-Host "🔄 Limpiando puerto 9002..." -ForegroundColor Yellow

# Matar todos los procesos Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Esperar a que se libere
Start-Sleep -Seconds 2

Write-Host "✅ Puerto 9002 liberado correctamente" -ForegroundColor Green
Write-Host "📌 Ahora puedes ejecutar: npm run dev" -ForegroundColor Cyan
