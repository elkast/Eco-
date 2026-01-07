#!/bin/bash

# Script Bash pour démarrer l'application en mode développement
# Usage: ./start_dev.sh

echo "🚀 Démarrage de Eco+Holding en mode développement..."
echo ""

# Vérifier si l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo "⚠️  Environnement virtuel non trouvé. Création..."
    python3 -m venv venv
    echo "✅ Environnement virtuel créé"
fi

# Activer l'environnement virtuel
echo "📦 Activation de l'environnement virtuel..."
source venv/bin/activate

# Installer/Mettre à jour les dépendances
echo "📚 Vérification des dépendances..."
pip install -q -r requirements.txt

# Vérifier si la base de données existe
if [ ! -f "eco_holding.db" ]; then
    echo "⚠️  Base de données non trouvée. Initialisation..."
    python init_db.py
fi

echo ""
echo "✅ Tout est prêt!"
echo ""
echo "📍 URLs disponibles:"
echo "   🌐 Site public: http://localhost:5000"
echo "   🔐 Admin: http://localhost:5000/admin/connexion"
echo ""
echo "🛑 Pour arrêter: Ctrl+C"
echo ""

# Démarrer l'application
python run.py