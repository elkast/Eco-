"""
Formulaires Flask-WTF avec protection CSRF
"""
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, EmailField, PasswordField
from wtforms.validators import DataRequired, Email, Length, ValidationError
from datetime import datetime, timedelta


class DemandeRendezVousForm(FlaskForm):
    """Formulaire de demande de rendez-vous"""
    
    nom = StringField('Nom', validators=[
        DataRequired(message='Le nom est requis'),
        Length(min=2, max=100, message='Le nom doit contenir entre 2 et 100 caractères')
    ])
    
    prenom = StringField('Prénom', validators=[
        Length(max=100, message='Le prénom ne doit pas dépasser 100 caractères')
    ])
    
    email = EmailField('Email', validators=[
        DataRequired(message='L\'email est requis'),
        Email(message='Email invalide')
    ])
    
    telephone = StringField('Téléphone', validators=[
        DataRequired(message='Le téléphone est requis'),
        Length(min=8, max=25, message='Numéro de téléphone invalide')
    ])
    
    def validate_telephone(self, field):
        """Validation personnalisée du numéro de téléphone"""
        # Enlever les espaces et vérifier que ce sont des chiffres valides
        tel_clean = field.data.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        
        # Vérifier si commence par + (indicatif international)
        if tel_clean.startswith('+'):
            # Format international valide
            if not tel_clean[1:].isdigit():
                raise ValidationError('Le numéro de téléphone ne doit contenir que des chiffres après l\'indicatif')
            if len(tel_clean) < 10 or len(tel_clean) > 20:
                raise ValidationError('Le numéro de téléphone international doit contenir entre 10 et 20 chiffres')
        else:
            # Format local - doit être des chiffres uniquement
            if not tel_clean.isdigit():
                raise ValidationError('Le numéro de téléphone ne doit contenir que des chiffres')
            if len(tel_clean) < 8 or len(tel_clean) > 15:
                raise ValidationError('Le numéro de téléphone doit contenir entre 8 et 15 chiffres')
    
    service = SelectField('Service', validators=[
        DataRequired(message='Veuillez sélectionner un service')
    ], choices=[
        ('', 'Sélectionnez un service'),
        ('gestion_affaires', 'ECO+HOLDING - Gestion d\'Affaires'),
        ('prestige_immobilier', 'PRESTIGE IMMOBILIER - Gestion Immobilière'),
        ('logistique', 'ECO+TRANS-LOGISTIQUE - Transport et Logistique')
    ])
    
    date_souhaitee = DateField('Date souhaitée', validators=[
        DataRequired(message='La date est requise')
    ], format='%Y-%m-%d')
    
    message = TextAreaField('Message', validators=[
        Length(max=1000, message='Le message ne doit pas dépasser 1000 caractères')
    ])
    
    def validate_date_souhaitee(self, field):
        """Validation personnalisée de la date"""
        if field.data < datetime.now().date():
            raise ValidationError('La date ne peut pas être dans le passé')
        
        # La date ne peut pas être plus de 3 mois dans le futur
        date_max = datetime.now().date() + timedelta(days=90)
        if field.data > date_max:
            raise ValidationError('La date ne peut pas être plus de 3 mois dans le futur')


class ConnexionForm(FlaskForm):
    """Formulaire de connexion admin"""
    
    email = EmailField('Email', validators=[
        DataRequired(message='L\'email est requis'),
        Email(message='Email invalide')
    ])
    
    mot_de_passe = PasswordField('Mot de passe', validators=[
        DataRequired(message='Le mot de passe est requis')
    ])