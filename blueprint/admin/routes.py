"""
Routes d'administration pour Eco+Holding
Gestion sécurisée des demandes et utilisateurs
"""
from flask import render_template, request, jsonify, session, redirect, url_for, flash
from models import db, DemandeClient, UtilisateurAdmin
from utils import connexion_requise
from datetime import datetime, date
from sqlalchemy import or_, desc, func, and_
from sqlalchemy.exc import SQLAlchemyError
from . import admin_bp


@admin_bp.route('/connexion', methods=['GET'])
def page_connexion():
    """Page de connexion admin"""
    if 'utilisateur_id' in session:
        return redirect(url_for('admin.tableau_de_bord'))
    return render_template('admin/connexion.html')


@admin_bp.route('/api/connexion', methods=['POST'])
def connexion():
    """
    Connexion de l'administrateur
    Mise à jour de la dernière connexion
    """
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
        utilisateur = UtilisateurAdmin.query.filter_by(email=email, actif=True).first()
        
        if not utilisateur or not utilisateur.verifier_mot_de_passe(mot_de_passe):
            return jsonify({
                'success': False,
                'message': 'Email ou mot de passe incorrect'
            }), 401
        
        # Enregistrer dans la session
        session['utilisateur_id'] = utilisateur.id
        session['utilisateur_email'] = utilisateur.email
        session['utilisateur_nom'] = utilisateur.nom
        session['utilisateur_prenom'] = utilisateur.prenom
        session['utilisateur_role'] = utilisateur.role
        session.permanent = True
        
        # Mettre à jour la dernière connexion
        utilisateur.derniere_connexion = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Connexion réussie',
            'redirect': url_for('admin.tableau_de_bord')
        }), 200
        
    except Exception as e:
        print(f"Erreur connexion: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la connexion'
        }), 500


@admin_bp.route('/api/deconnexion', methods=['POST'])
def deconnexion():
    """Déconnexion de l'administrateur"""
    session.clear()
    return jsonify({'success': True, 'message': 'Déconnexion réussie'})


@admin_bp.route('/tableau-de-bord')
@connexion_requise
def tableau_de_bord():
    """
    Page principale du tableau de bord admin
    Affiche les statistiques et les demandes récentes
    """
    return render_template('admin/tableau_de_bord.html')


@admin_bp.route('/api/statistiques')
@connexion_requise
def statistiques():
    """API pour récupérer les statistiques du dashboard"""
    try:
        total = DemandeClient.query.count()
        nouveau = DemandeClient.query.filter_by(statut='nouveau').count()
        en_cours = DemandeClient.query.filter_by(statut='en_cours').count()
        traite = DemandeClient.query.filter_by(statut='traite').count()
        
        # Statistiques du jour
        aujourd_hui = date.today()
        nouvelles_aujourdhui = DemandeClient.query.filter(
            func.date(DemandeClient.date_creation) == aujourd_hui
        ).count()
        
        return jsonify({
            'success': True,
            'statistiques': {
                'total': total,
                'nouveau': nouveau,
                'en_cours': en_cours,
                'traite': traite,
                'nouvelles_aujourdhui': nouvelles_aujourdhui
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@admin_bp.route('/api/demandes')
@connexion_requise
def liste_demandes():
    """
    API pour récupérer la liste paginée des demandes
    Avec recherche, filtres et tri
    """
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        recherche = request.args.get('recherche', '', type=str)
        statut_filtre = request.args.get('statut', '', type=str)
        service_filtre = request.args.get('service', '', type=str)
        sort_by = request.args.get('sort_by', 'date_creation', type=str)
        sort_order = request.args.get('sort_order', 'desc', type=str)
        
        # Construction de la requête
        query = DemandeClient.query
        
        # Filtre de recherche
        if recherche:
            search_pattern = f'%{recherche}%'
            query = query.filter(or_(
                DemandeClient.nom.ilike(search_pattern),
                DemandeClient.prenom.ilike(search_pattern),
                DemandeClient.email.ilike(search_pattern),
                DemandeClient.telephone.ilike(search_pattern)
            ))
        
        # Filtre par statut
        if statut_filtre:
            query = query.filter_by(statut=statut_filtre)
        
        # Filtre par service
        if service_filtre:
            query = query.filter_by(service=service_filtre)
        
        # Tri
        if hasattr(DemandeClient, sort_by):
            if sort_order == 'asc':
                query = query.order_by(getattr(DemandeClient, sort_by).asc())
            else:
                query = query.order_by(getattr(DemandeClient, sort_by).desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=limit, error_out=False)
        
        demandes = [demande.to_dict() for demande in pagination.items]
        
        return jsonify({
            'success': True,
            'demandes': demandes,
            'page': pagination.page,
            'pages': pagination.pages,
            'total': pagination.total,
            'has_prev': pagination.has_prev,
            'has_next': pagination.has_next
        })
        
    except Exception as e:
        print(f"Erreur liste demandes: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500


@admin_bp.route('/api/demandes/<int:demande_id>')
@connexion_requise
def obtenir_demande(demande_id):
    """Obtenir les détails d'une demande"""
    try:
        demande = DemandeClient.query.get_or_404(demande_id)
        return jsonify({
            'success': True,
            'demande': demande.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 404


@admin_bp.route('/api/demandes/<int:demande_id>/statut', methods=['PUT'])
@connexion_requise
def modifier_statut_demande(demande_id):
    """Modifier le statut d'une demande"""
    try:
        demande = DemandeClient.query.get_or_404(demande_id)
        data = request.get_json()
        
        nouveau_statut = data.get('statut')
        if nouveau_statut not in ['nouveau', 'en_cours', 'traite', 'annule']:
            return jsonify({
                'success': False,
                'message': 'Statut invalide'
            }), 400
        
        demande.statut = nouveau_statut
        demande.date_modification = datetime.utcnow()
        demande.traite_par = session.get('utilisateur_id')
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Statut modifié avec succès'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la modification'
        }), 500


@admin_bp.route('/api/demandes/<int:demande_id>', methods=['DELETE'])
@connexion_requise
def supprimer_demande(demande_id):
    """Supprimer une demande"""
    try:
        demande = DemandeClient.query.get_or_404(demande_id)
        db.session.delete(demande)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Demande supprimée avec succès'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la suppression'
        }), 500