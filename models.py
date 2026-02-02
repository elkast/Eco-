"""
Modèles de base de données pour ECO+HOLDING
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class UtilisateurAdmin(db.Model):
    """Modèle pour les utilisateurs administrateurs"""
    
    __tablename__ = 'utilisateurs_admin'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100))
    mot_de_passe_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='admin')
    actif = db.Column(db.Boolean, nullable=False, default=True, index=True)
    date_creation = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    derniere_connexion = db.Column(db.DateTime)
    
    # Relations
    demandes_traitees = db.relationship('DemandeClient', backref='administrateur', lazy='dynamic')
    
    def definir_mot_de_passe(self, mot_de_passe):
        """Hasher et définir le mot de passe"""
        self.mot_de_passe_hash = generate_password_hash(mot_de_passe)
    
    def verifier_mot_de_passe(self, mot_de_passe):
        """Vérifier le mot de passe"""
        return check_password_hash(self.mot_de_passe_hash, mot_de_passe)
    
    def __repr__(self):
        return f'<UtilisateurAdmin {self.email}>'


class DemandeClient(db.Model):
    """Modèle pour les demandes de clients"""
    
    __tablename__ = 'demandes_clients'
    
    # Statuts possibles
    STATUT_NOUVEAU = 'nouveau'
    STATUT_EN_COURS = 'en_cours'
    STATUT_TRAITE = 'traite'
    STATUT_ANNULE = 'annule'
    
    STATUTS = [STATUT_NOUVEAU, STATUT_EN_COURS, STATUT_TRAITE, STATUT_ANNULE]
    
    # Services disponibles
    SERVICE_GESTION_AFFAIRES = 'gestion_affaires'
    SERVICE_PRESTIGE_IMMOBILIER = 'prestige_immobilier'
    SERVICE_LOGISTIQUE = 'logistique'
    
    SERVICES = [SERVICE_GESTION_AFFAIRES, SERVICE_PRESTIGE_IMMOBILIER, SERVICE_LOGISTIQUE]
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100))
    email = db.Column(db.String(120), nullable=False, index=True)
    telephone = db.Column(db.String(25), nullable=False, index=True)
    service = db.Column(db.String(50), nullable=False, index=True)
    date_souhaitee = db.Column(db.Date, nullable=False)
    message = db.Column(db.Text)
    statut = db.Column(db.String(20), nullable=False, default=STATUT_NOUVEAU, index=True)
    
    # Champs de suivi
    date_creation = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    date_modification = db.Column(
        db.DateTime, 
        nullable=False, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Champs pour emails et relances
    dernier_email_envoye = db.Column(db.DateTime)
    nombre_relances = db.Column(db.Integer, nullable=False, default=0)
    email_confirmation_envoye = db.Column(db.Boolean, nullable=False, default=False)
    
    # Notes administrateur
    notes_admin = db.Column(db.Text)
    traite_par = db.Column(db.Integer, db.ForeignKey('utilisateurs_admin.id'))
    
    def obtenir_nom_complet(self):
        """Retourner le nom complet"""
        if self.prenom:
            return f"{self.nom} {self.prenom}"
        return self.nom
    
    def obtenir_nom_service(self):
        """Retourner le nom lisible du service"""
        noms_services = {
            self.SERVICE_GESTION_AFFAIRES: 'Gestion d\'affaires',
            self.SERVICE_PRESTIGE_IMMOBILIER: 'Prestige Immobilier',
            self.SERVICE_LOGISTIQUE: 'Eco+Trans-Logistique'
        }
        return noms_services.get(self.service, self.service)
    
    def obtenir_nom_statut(self):
        """Retourner le nom lisible du statut"""
        noms_statuts = {
            self.STATUT_NOUVEAU: 'Nouveau',
            self.STATUT_EN_COURS: 'En cours',
            self.STATUT_TRAITE: 'Traité',
            self.STATUT_ANNULE: 'Annulé'
        }
        return noms_statuts.get(self.statut, self.statut)
    
    def __repr__(self):
        return f'<DemandeClient {self.obtenir_nom_complet()} - {self.service}>'


def initialiser_base_donnees(app):
    """Initialiser la base de données avec des données de test"""
    with app.app_context():
        # Créer les tables
        db.create_all()
        
        # Vérifier si l'admin existe déjà
        admin_existant = UtilisateurAdmin.query.filter_by(email='admin@ecoholding.com').first()
        
        if not admin_existant:
            # Créer un administrateur par défaut
            admin = UtilisateurAdmin(
                email='admin@ecoholding.com',
                nom='Kouassi',
                prenom='Yao',
                role='super_admin',
                actif=True
            )
            admin.definir_mot_de_passe('admin123')  # À CHANGER EN PRODUCTION
            db.session.add(admin)
            
            # Créer quelques demandes de test
            from datetime import date, timedelta
            
            demandes_test = [
                DemandeClient(
                    nom='Kouassi',
                    prenom='Yao',
                    email='yao.kouassi@example.com',
                    telephone='+2250504477268',
                    service=DemandeClient.SERVICE_GESTION_AFFAIRES,
                    date_souhaitee=date.today() + timedelta(days=3),
                    message='Besoin d\'accompagnement pour création d\'entreprise',
                    statut=DemandeClient.STATUT_NOUVEAU
                ),
                DemandeClient(
                    nom='Diop',
                    prenom='Fatou',
                    email='fatou.diop@example.com',
                    telephone='+2250705928780',
                    service=DemandeClient.SERVICE_PRESTIGE_IMMOBILIER,
                    date_souhaitee=date.today() + timedelta(days=5),
                    message='Recherche location bureau Abidjan',
                    statut=DemandeClient.STATUT_EN_COURS
                ),
                DemandeClient(
                    nom='Traoré',
                    prenom='Ibrahim',
                    email='ibrahim.traore@example.com',
                    telephone='+2250123456789',
                    service=DemandeClient.SERVICE_LOGISTIQUE,
                    date_souhaitee=date.today() + timedelta(days=7),
                    message='Transport marchandises vers l\'intérieur',
                    statut=DemandeClient.STATUT_TRAITE
                )
            ]
            
            for demande in demandes_test:
                db.session.add(demande)
            
            db.session.commit()
            print("Base de données initialisée avec succès!")
