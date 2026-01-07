"""
Modèles de base de données pour Eco+Holding
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class DemandeClient(db.Model):
    """Modèle pour les demandes de rendez-vous des clients"""
    
    __tablename__ = 'demandes_clients'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), nullable=False)
    telephone = db.Column(db.String(20), nullable=False)
    service = db.Column(db.String(50), nullable=False)
    date_souhaitee = db.Column(db.Date, nullable=False)
    message = db.Column(db.Text, nullable=True)
    statut = db.Column(db.String(20), default='nouveau', nullable=False)
    # Statuts possibles: 'nouveau', 'en_cours', 'traite', 'annule'
    
    date_creation = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    date_modification = db.Column(db.DateTime, default=datetime.utcnow, 
                                  onupdate=datetime.utcnow, nullable=False)
    
    # Champs pour le suivi des relances et emails
    dernier_email_envoye = db.Column(db.DateTime, nullable=True)
    nombre_relances = db.Column(db.Integer, default=0, nullable=False)
    email_confirmation_envoye = db.Column(db.Boolean, default=False, nullable=False)
    
    # Notes de l'admin
    notes_admin = db.Column(db.Text, nullable=True)
    traite_par = db.Column(db.Integer, db.ForeignKey('utilisateurs_admin.id'), nullable=True)
    
    def __repr__(self):
        return f'<DemandeClient {self.nom} - {self.service}>'
    
    def to_dict(self):
        """Convertir l'objet en dictionnaire pour l'API"""
        return {
            'id': self.id,
            'nom': self.nom,
            'prenom': self.prenom,
            'email': self.email,
            'telephone': self.telephone,
            'service': self.service,
            'date_souhaitee': self.date_souhaitee.isoformat() if self.date_souhaitee else None,
            'message': self.message,
            'statut': self.statut,
            'date_creation': self.date_creation.isoformat() if self.date_creation else None,
            'date_modification': self.date_modification.isoformat() if self.date_modification else None,
            'nombre_relances': self.nombre_relances
        }


class UtilisateurAdmin(db.Model):
    """Modèle pour les utilisateurs administrateurs"""
    
    __tablename__ = 'utilisateurs_admin'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=True)
    mot_de_passe_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='admin', nullable=False)
    # Rôles possibles: 'admin', 'super_admin'
    
    actif = db.Column(db.Boolean, default=True, nullable=False)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    derniere_connexion = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<UtilisateurAdmin {self.email}>'
    
    def definir_mot_de_passe(self, mot_de_passe):
        """Définir le mot de passe hashé de manière sécurisée"""
        self.mot_de_passe_hash = generate_password_hash(mot_de_passe, method='pbkdf2:sha256')
    
    def verifier_mot_de_passe(self, mot_de_passe):
        """Vérifier le mot de passe"""
        return check_password_hash(self.mot_de_passe_hash, mot_de_passe)
    
    def to_dict(self):
        """Convertir l'objet en dictionnaire (sans le mot de passe)"""
        return {
            'id': self.id,
            'email': self.email,
            'nom': self.nom,
            'prenom': self.prenom,
            'role': self.role,
            'actif': self.actif,
            'date_creation': self.date_creation.isoformat() if self.date_creation else None,
            'derniere_connexion': self.derniere_connexion.isoformat() if self.derniere_connexion else None
        }