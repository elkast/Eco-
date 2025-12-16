from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from models import db, DemandeClient, UtilisateurAdmin
from datetime import datetime
from functools import wraps
from sqlalchemy import or_, desc
from sqlalchemy.exc import SQLAlchemyError

admin_bp = Blueprint('admin', __name__)


def connexion_requise(f):
    """Décorateur pour vérifier si l'utilisateur est connecté"""
    @wraps(f)
    def fonction_decoree(*args, **kwargs):
        if 'utilisateur_id' not in session:
            if request.is_json:
                return jsonify({'success': False, 'message': 'Non autorisé'}), 401
            return redirect(url_for('admin.page_connexion'))
        return f(*args, **kwargs)
    return fonction_decoree


@admin_bp.route('/connexion', methods=['GET'])
def page_connexion():
    """Page de connexion admin"""
    if 'utilisateur_id' in session:
        return redirect(url_for('admin.tableau_de_bord'))
    return render_template('admin/connexion.html')


@admin_bp.route('/api/connexion', methods=['POST'])
def connexion():
    """Connexion de l'administrateur"""
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()
        
        email = data.get('email', '').strip().lower()
        mot_de_passe = data.get('mot_de_passe', '')
        
        if not email or not mot_de_passe:
            return jsonify({
                'success': False,
                'message': 'Email et mot de passe requis'
            }), 400
        
        # Rechercher l'utilisateur
        utilisateur = UtilisateurAdmin.query.filter_by(email=email).first()
        
        if not utilisateur or not utilisateur.verifier_mot_de_passe(mot_de_passe):
            return jsonify({
                'success': False,
                'message': 'Email ou mot de passe incorrect'
            }), 401
        
        if not utilisateur.actif:
            return jsonify({
                'success': False,
                'message': 'Compte désactivé. Contactez l\'administrateur.'
            }), 403
        
        # Mettre à jour la dernière connexion
        utilisateur.derniere_connexion = datetime.utcnow()
        db.session.commit()
        
        # Créer la session
        session['utilisateur_id'] = utilisateur.id
        session['utilisateur_email'] = utilisateur.email
        session['utilisateur_nom'] = utilisateur.nom
        session.permanent = True
        
        return jsonify({
            'success': True,
            'message': 'Connexion réussie',
            'utilisateur': utilisateur.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la connexion'
        }), 500


@admin_bp.route('/api/deconnexion', methods=['POST'])
@connexion_requise
def deconnexion():
    """Déconnexion de l'administrateur"""
    session.clear()
    return jsonify({'success': True, 'message': 'Déconnexion réussie'}), 200


@admin_bp.route('/api/verifier-session', methods=['GET'])
def verifier_session():
    """Vérifier si l'utilisateur est connecté"""
    if 'utilisateur_id' in session:
        utilisateur = UtilisateurAdmin.query.get(session['utilisateur_id'])
        if utilisateur and utilisateur.actif:
            return jsonify({
                'authenticated': True,
                'utilisateur': utilisateur.to_dict()
            }), 200
    
    return jsonify({'authenticated': False}), 200


@admin_bp.route('/tableau-de-bord')
@connexion_requise
def tableau_de_bord():
    """Page du tableau de bord admin"""
    return render_template('admin/tableau_de_bord.html')


@admin_bp.route('/api/demandes', methods=['GET'])
@connexion_requise
def obtenir_demandes():
    """Obtenir la liste des demandes avec filtres et pagination"""
    try:
        # Paramètres de pagination
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # Paramètres de filtrage
        statut = request.args.get('statut', '').strip()
        service = request.args.get('service', '').strip()
        recherche = request.args.get('recherche', '').strip()
        
        # Paramètres de tri
        sort_by = request.args.get('sort_by', 'date_creation')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Construire la requête
        query = DemandeClient.query
        
        # Appliquer les filtres
        if statut:
            query = query.filter(DemandeClient.statut == statut)
        
        if service:
            query = query.filter(DemandeClient.service == service)
        
        if recherche:
            query = query.filter(
                or_(
                    DemandeClient.nom.ilike(f'%{recherche}%'),
                    DemandeClient.email.ilike(f'%{recherche}%'),
                    DemandeClient.telephone.ilike(f'%{recherche}%')
                )
            )
        
        # Appliquer le tri
        if sort_order == 'desc':
            query = query.order_by(desc(getattr(DemandeClient, sort_by)))
        else:
            query = query.order_by(getattr(DemandeClient, sort_by))
        
        # Pagination
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        
        return jsonify({
            'success': True,
            'demandes': [demande.to_dict() for demande in pagination.items],
            'total': pagination.total,
            'page': page,
            'pages': pagination.pages,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la récupération des demandes'
        }), 500


@admin_bp.route('/api/demandes/<int:id>', methods=['GET'])
@connexion_requise
def obtenir_demande(id):
    """Obtenir une demande spécifique"""
    try:
        demande = DemandeClient.query.get_or_404(id)
        return jsonify({
            'success': True,
            'demande': demande.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Demande non trouvée'
        }), 404


@admin_bp.route('/api/demandes/<int:id>/statut', methods=['PUT'])
@connexion_requise
def mettre_a_jour_statut(id):
    """Mettre à jour le statut d'une demande"""
    try:
        data = request.get_json()
        nouveau_statut = data.get('statut', '').strip()
        
        statuts_valides = ['nouveau', 'en_cours', 'traite', 'archive']
        if nouveau_statut not in statuts_valides:
            return jsonify({
                'success': False,
                'message': f'Statut invalide. Valeurs acceptées: {", ".join(statuts_valides)}'
            }), 400
        
        demande = DemandeClient.query.get_or_404(id)
        demande.statut = nouveau_statut
        demande.date_modification = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Statut mis à jour avec succès',
            'demande': demande.to_dict()
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la mise à jour du statut'
        }), 500


@admin_bp.route('/api/demandes/<int:id>', methods=['DELETE'])
@connexion_requise
def supprimer_demande(id):
    """Supprimer une demande"""
    try:
        demande = DemandeClient.query.get_or_404(id)
        
        db.session.delete(demande)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Demande supprimée avec succès'
        }), 200
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la suppression de la demande'
        }), 500


@admin_bp.route('/api/statistiques', methods=['GET'])
@connexion_requise
def obtenir_statistiques():
    """Obtenir les statistiques du tableau de bord"""
    try:
        total = DemandeClient.query.count()
        nouveau = DemandeClient.query.filter_by(statut='nouveau').count()
        en_cours = DemandeClient.query.filter_by(statut='en_cours').count()
        traite = DemandeClient.query.filter_by(statut='traite').count()
        
        # Statistiques par service
        services = db.session.query(
            DemandeClient.service,
            db.func.count(DemandeClient.id)
        ).group_by(DemandeClient.service).all()
        
        return jsonify({
            'success': True,
            'statistiques': {
                'total': total,
                'nouveau': nouveau,
                'en_cours': en_cours,
                'traite': traite,
                'par_service': [{'service': s[0], 'count': s[1]} for s in services]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la récupération des statistiques'
        }), 500