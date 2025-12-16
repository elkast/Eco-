from flask import Blueprint, request, jsonify
from models import db, DemandeClient
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/creer', methods=['POST'])
def creer_demande():
    """Créer une nouvelle demande de contact"""
    try:
        # Récupérer les données du formulaire
        data = request.get_json() if request.is_json else request.form.to_dict()
        
        # Validation des champs requis
        champs_requis = ['nom', 'email', 'telephone', 'service', 'date']
        champs_manquants = [champ for champ in champs_requis if not data.get(champ)]
        
        if champs_manquants:
            return jsonify({
                'success': False,
                'message': f'Champs manquants: {", ".join(champs_manquants)}'
            }), 400
        
        # Convertir la date
        try:
            date_souhaitee = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Format de date invalide. Utilisez YYYY-MM-DD'
            }), 400
        
        # Créer la nouvelle demande
        nouvelle_demande = DemandeClient(
            nom=data['nom'].strip(),
            email=data['email'].strip().lower(),
            telephone=data['telephone'].strip(),
            service=data['service'],
            date_souhaitee=date_souhaitee,
            message=data.get('message', '').strip(),
            statut='nouveau'
        )
        
        # Sauvegarder dans la base de données
        db.session.add(nouvelle_demande)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Votre demande a été envoyée avec succès! Nous vous contacterons très rapidement.',
            'id': nouvelle_demande.id
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de l\'enregistrement de votre demande. Veuillez réessayer.'
        }), 500
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
        }), 500