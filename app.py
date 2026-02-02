"""
Application principale ECO+HOLDING
Application Flask pour le site web du cabinet de gestion d'affaires
"""

import os
from flask import Flask
import re
from urllib.parse import quote
from datetime import datetime
from config import config
from models import db, initialiser_base_donnees
from routes.main import main_bp
from routes.admin import admin_bp
from utils import mail


def creer_app(nom_config="developpement"):
    """Factory pour créer l'application Flask"""

    app = Flask(__name__)

    # Charger la configuration
    app.config.from_object(config[nom_config])

    # Initialiser les extensions
    db.init_app(app)
    
    # Appliquer les options de connexion MySQL si définies
    if hasattr(config[nom_config], 'SQLALCHEMY_ENGINE_OPTIONS'):
        app.config['SQLALCHEMY_ENGINE_OPTIONS'] = config[nom_config].SQLALCHEMY_ENGINE_OPTIONS
    
    mail.init_app(app)

    # Initialiser la base de données
    with app.app_context():
        initialiser_base_donnees(app)

    # Enregistrer les blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp)

    # ==================== FILTRES JINJA ====================

    @app.template_filter("format_date")
    def formater_date(valeur, format="%d/%m/%Y"):
        """Formater une date"""
        if valeur is None:
            return ""
        if isinstance(valeur, str):
            return valeur
        return valeur.strftime(format)

    @app.template_filter("format_datetime")
    def formater_datetime(valeur, format="%d/%m/%Y à %H:%M"):
        """Formater une date et heure"""
        if valeur is None:
            return ""
        if isinstance(valeur, str):
            return valeur
        return valeur.strftime(format)

    # ==================== CONTEXTE TEMPLATE ====================

    @app.context_processor
    def injecter_annee():
        """Injecter l'année actuelle dans tous les templates"""
        return {"annee_actuelle": datetime.now().year}

    return app
