"""
Formulaires pour ECO+HOLDING
"""
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, EmailField, PasswordField
from wtforms.validators import DataRequired, Email, Length, Optional
from datetime import date, timedelta


class FormulaireDemandeClient(FlaskForm):
    """Formulaire pour les demandes de clients"""
    
    nom = StringField('Nom', validators=[
        DataRequired(message='Le nom est requis'),
        Length(min=2, max=100, message='Le nom doit contenir entre 2 et 100 caractères')
    ])
    
    prenom = StringField('Prénom', validators=[
        Optional(),
        Length(max=100, message='Le prénom ne doit pas dépasser 100 caractères')
    ])
    
    email = EmailField('Email', validators=[
        DataRequired(message='L\'email est requis'),
        Email(message='Format d\'email invalide')
    ])
    
    telephone = StringField('Téléphone', validators=[
        DataRequired(message='Le téléphone est requis'),
        Length(min=8, max=25, message='Le numéro de téléphone doit contenir entre 8 et 25 caractères')
    ])
    
    service = SelectField('Service souhaité', validators=[
        DataRequired(message='Veuillez sélectionner un service')
    ], choices=[
        ('', 'Sélectionnez un service'),
        ('gestion_affaires', 'Gestion d\'affaires & Intermédiation'),
        ('prestige_immobilier', 'Prestige Immobilier'),
        ('logistique', 'Eco+Trans-Logistique')
    ])
    
    date_souhaitee = DateField('Date souhaitée', validators=[
        DataRequired(message='La date souhaitée est requise')
    ], format='%Y-%m-%d')
    
    message = TextAreaField('Message', validators=[
        Optional(),
        Length(max=1000, message='Le message ne doit pas dépasser 1000 caractères')
    ])
    
    def validate_date_souhaitee(self, field):
        """Valider que la date est dans le futur"""
        if field.data and field.data < date.today():
            raise ValidationError('La date souhaitée doit être dans le futur')


class FormulaireConnexionAdmin(FlaskForm):
    """Formulaire de connexion administrateur"""
    
    email = EmailField('Email', validators=[
        DataRequired(message='L\'email est requis'),
        Email(message='Format d\'email invalide')
    ])
    
    mot_de_passe = PasswordField('Mot de passe', validators=[
        DataRequired(message='Le mot de passe est requis')
    ])


class FormulaireModificationStatut(FlaskForm):
    """Formulaire pour modifier le statut d'une demande"""
    
    statut = SelectField('Statut', validators=[
        DataRequired(message='Le statut est requis')
    ], choices=[
        ('nouveau', 'Nouveau'),
        ('en_cours', 'En cours'),
        ('traite', 'Traité'),
        ('annule', 'Annulé')
    ])
    
    notes_admin = TextAreaField('Notes administrateur', validators=[
        Optional()
    ])
