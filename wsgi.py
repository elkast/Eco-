"""
Point d'entrée WSGI pour la production
À utiliser avec Gunicorn ou autre serveur WSGI
"""
import os
from run import creer_app

# Créer l'application avec la configuration de production
application = creer_app(os.environ.get('venv', 'production'))

if __name__ == "__main__":
    application.run()