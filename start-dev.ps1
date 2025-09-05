# Script para iniciar o servidor de desenvolvimento e abrir o navegador
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green

# Iniciar o servidor em background
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"

# Aguardar um pouco para o servidor inicializar
Start-Sleep -Seconds 3

# Abrir o navegador
Write-Host "🌐 Abrindo navegador..." -ForegroundColor Blue
Start-Process "http://localhost:3000"

Write-Host "✅ Servidor iniciado e navegador aberto!" -ForegroundColor Green
Write-Host "📱 Acesse: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⏹️  Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
