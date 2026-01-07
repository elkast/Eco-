"""
Script d'initialisation de la base de données
À exécuter une seule fois lors de la première installation
"""
import sys
from run import creer_app
from models import db, UtilisateurAdmin
from datetime import datetime

def initialiser_database():
    """Créer les tables et l'utilisateur admin initial"""
    
    print("🔄 Initialisation de la base de données...")
    
    # Créer l'application
    app = creer_app()
    
    with app.app_context():
        # Créer toutes les tables
        print("📋 Création des tables...")
        db.create_all()
        print("✅ Tables créées avec succès")
        
        # Vérifier si un admin existe déjà
        if UtilisateurAdmin.query.count() > 0:
            print("⚠️  Un administrateur existe déjà dans la base de données")
            reponse = input("Voulez-vous créer un nouvel administrateur ? (o/n): ")
            if reponse.lower() != 'o':
                print("❌ Initialisation annulée")
                return
        
        # Demander les informations de l'admin
        print("\n👤 Création du compte administrateur")
        print("=" * 50)
        
        nom = input("Nom: ").strip()
        prenom = input("Prénom: ").strip()
        email = input("Email: ").strip().lower()
        
        while True:
            mdp1 = input("Mot de passe (min. 6 caractères): ")
            if len(mdp1) < 6:
                print("⚠️  Le mot de passe doit contenir au moins 6 caractères")
                continue
            mdp2 = input("Confirmer le mot de passe: ")
            if mdp1 != mdp2:
                print("⚠️  Les mots de passe ne correspondent pas")
                continue
            break
        
        # Créer l'administrateur
        admin = UtilisateurAdmin(
            email=email,
            nom=nom,
            prenom=prenom,
            role='super_admin',
            actif=True
        )
        admin.definir_mot_de_passe(mdp1)
        
        db.session.add(admin)
        db.session.commit()
        
        print("\n✅ Administrateur créé avec succès!")
        print(f"📧 Email: {email}")
        print(f"👤 Nom: {prenom} {nom}")
        print("\n🎉 Base de données initialisée avec succès!")
        print(f"🔗 Accédez à l'interface admin: http://localhost:5000/admin/connexion")

def reinitialiser_database():
    """Réinitialiser complètement la base de données (ATTENTION: supprime toutes les données)"""
    
    print("⚠️  ATTENTION: Cette opération va SUPPRIMER toutes les données!")
    reponse = input("Êtes-vous sûr de vouloir continuer ? (tapez 'SUPPRIMER' pour confirmer): ")
    
    if reponse != 'SUPPRIMER':
        print("❌ Opération annulée")
        return
    
    app = creer_app()
    
    with app.app_context():
        print("🗑️  Suppression des tables existantes...")
        db.drop_all()
        print("✅ Tables supprimées")
        
        print("📋 Création des nouvelles tables...")
        db.create_all()
        print("✅ Tables créées")
        
    print("\n✅ Base de données réinitialisée!")
    print("⚠️  Vous devez maintenant créer un nouvel administrateur")
    initialiser_database()

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reinitialiser_database()
    else:
        initialiser_database()