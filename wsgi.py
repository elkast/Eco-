"""
WSGI Entry Point for ECO+HOLDING
Point d'entrée pour les serveurs WSGI (Gunicorn, uWSGI, etc.)
"""

import sys
import os

# Ajouter le répertoire du projet au path Python
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

# Créer l'application Flask
from app import creer_app

# Détecter l'environnement (production par défaut)
env = os.environ.get('FLASK_ENV', 'production')
application = creer_app(nom_config=env)

# Pour compatibilité avec certains serveurs WSGI
app = application

if __name__ == "__main__":
    # Mode développement uniquement
    application.run(debug=(env == 'developpement'))
