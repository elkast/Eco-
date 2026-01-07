# Script PowerShell pour démarrer l'application en mode développement
# Usage: .\start_dev.ps1

Write-Host "🚀 Démarrage de Eco+Holding en mode développement..." -ForegroundColor Green
Write-Host ""

# Vérifier si l'environnement virtuel existe
if (!(Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "⚠️  Environnement virtuel non trouvé. Création..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Environnement virtuel créé" -ForegroundColor Green
}

# Activer l'environnement virtuel
Write-Host "📦 Activation de l'environnement virtuel..." -ForegroundColor Cyan
& venv\Scripts\Activate.ps1

# Installer/Mettre à jour les dépendances
Write-Host "📚 Vérification des dépendances..." -ForegroundColor Cyan
pip install -q -r requirements.txt

# Vérifier si la base de données existe
if (!(Test-Path "eco_holding.db")) {
    Write-Host "⚠️  Base de données non trouvée. Initialisation..." -ForegroundColor Yellow
    python init_db.py
}

Write-Host ""
Write-Host "✅ Tout est prêt!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs disponibles:" -ForegroundColor Cyan
Write-Host "   🌐 Site public: http://localhost:5000" -ForegroundColor White
Write-Host "   🔐 Admin: http://localhost:5000/admin/connexion" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Pour arrêter: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Démarrer l'application
python run.py