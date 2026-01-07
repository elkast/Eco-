"""
Fonctions utilitaires pour l'application
"""
from functools import wraps
from flask import session, redirect, url_for, flash, request, jsonify


def connexion_requise(f):
    """
    Décorateur pour protéger les routes admin
    Redirige vers la page de connexion si non authentifié
    """
    @wraps(f)
    def fonction_decoree(*args, **kwargs):
        if 'utilisateur_id' not in session:
            if request.is_json:
                return jsonify({
                    'success': False,
                    'message': 'Authentification requise'
                }), 401
            flash('Veuillez vous connecter pour accéder à cette page', 'warning')
            return redirect(url_for('admin.page_connexion'))
        return f(*args, **kwargs)
    return fonction_decoree


def formater_telephone(telephone):
    """
    Formater un numéro de téléphone
    Retire les espaces et caractères spéciaux
    """
    if not telephone:
        return None
    # Garder seulement les chiffres et le +
    return ''.join(c for c in telephone if c.isdigit() or c == '+')


def obtenir_initiales(nom, prenom=None):
    """
    Obtenir les initiales d'un nom
    Ex: obtenir_initiales("Kouassi", "Yao") -> "KY"
    """
    initiales = nom[0].upper() if nom else ''
    if prenom:
        initiales += prenom[0].upper()
    return initiales


def statut_badge_class(statut):
    """
    Retourner la classe CSS pour le badge de statut
    """
    classes = {
        'nouveau': 'badge-nouveau',
        'traite': 'badge-traite',
        'annule': 'badge-annule'
    }
    return classes.get(statut, 'badge-default')