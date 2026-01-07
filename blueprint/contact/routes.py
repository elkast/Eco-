"""
Blueprint pour la gestion des demandes de contact/rendez-vous
"""
from flask import Blueprint, request, jsonify, render_template
from models import db, DemandeClient
from forms import DemandeRendezVousForm
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/creer', methods=['POST'])
def creer_demande():
    """
    Créer une nouvelle demande de rendez-vous
    Accepte les données JSON ou form-data
    Protection CSRF automatique via Flask-WTF
    """
    try:
        # Créer le formulaire avec les données reçues
        form = DemandeRendezVousForm()
        
        # Valider le formulaire (inclut la validation CSRF)
        if not form.validate_on_submit():
            erreurs = []
            for field, errors in form.errors.items():
                for error in errors:
                    erreurs.append(f"{field}: {error}")
            
            return jsonify({
                'success': False,
                'message': 'Erreur de validation',
                'erreurs': erreurs
            }), 400
        
        # Créer la nouvelle demande avec les données validées
        nouvelle_demande = DemandeClient(
            nom=form.nom.data.strip(),
            prenom=form.prenom.data.strip() if form.prenom.data else None,
            email=form.email.data.strip().lower(),
            telephone=form.telephone.data.strip(),
            service=form.service.data,
            date_souhaitee=form.date_souhaitee.data,
            message=form.message.data.strip() if form.message.data else None,
            statut='nouveau'
        )
        
        # Sauvegarder dans la base de données
        db.session.add(nouvelle_demande)
        db.session.commit()
        
        # Envoyer les emails en arrière-plan (asynchrone)
        try:
            from tasks.email_tasks import envoyer_email_confirmation_demande, envoyer_notification_admin
            envoyer_email_confirmation_demande.delay(nouvelle_demande.id)
            envoyer_notification_admin.delay(nouvelle_demande.id)
        except Exception as e:
            # Ne pas bloquer si Celery n'est pas disponible
            print(f"Celery non disponible: {str(e)}")
        
        return jsonify({
            'success': True,
            'message': 'Votre demande de rendez-vous a été envoyée avec succès ! Nous vous contacterons très rapidement.',
            'id': nouvelle_demande.id
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Erreur SQL: {str(e)}")  # Log pour debugging
        return jsonify({
            'success': False,
            'message': 'Erreur lors de l\'enregistrement. Veuillez réessayer.'
        }), 500
        
    except Exception as e:
        db.session.rollback()
        print(f"Erreur inattendue: {str(e)}")  # Log pour debugging
        return jsonify({
            'success': False,
            'message': 'Une erreur est survenue. Veuillez réessayer.'
        }), 500