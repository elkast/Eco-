"""
Initialisation de la base de données pour ECO+HOLDING
À exécuter UNE SEULE FOIS après le premier déploiement
"""

from app import creer_app
from models import db, initialiser_base_donnees
import os

def init_database():
    """Initialiser la base de données en production"""
    
    # Détecter l'environnement
    env = os.environ.get('FLASK_ENV', 'production')
    
    print(f"🔧 Environnement: {env}")
    print(f"📊 DATABASE_URL: {os.environ.get('DATABASE_URL', 'Non définie')[:50]}...")
    
    # Créer l'application
    app = creer_app(nom_config=env)
    
    with app.app_context():
        print("\n🚀 Initialisation de la base de données...")
        
        try:
            # Créer toutes les tables
            db.create_all()
            print("✅ Tables créées avec succès!")
            
            # Initialiser les données de test (admin + demandes exemples)
            initialiser_base_donnees(app)
            print("✅ Données initiales créées!")
            
            print("\n🎉 Base de données initialisée avec succès!")
            print("\n⚠️  IMPORTANT:")
            print("   - Email admin: admin@ecoholding.com")
            print("   - Mot de passe: admin123")
            print("   - CHANGEZ CE MOT DE PASSE IMMÉDIATEMENT EN PRODUCTION!")
            
        except Exception as e:
            print(f"\n❌ Erreur lors de l'initialisation: {str(e)}")
            raise

if __name__ == "__main__":
    init_database()
