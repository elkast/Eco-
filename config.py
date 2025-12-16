import os
from datetime import timedelta

class Config:
    """Configuration de base pour l'application Flask"""
    
    # Clé secrète pour les sessions (IMPORTANT: Changer en production)
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cle-secrete-eco-holding-2025-changez-moi'
    
    # Configuration de la base de données SQLite
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'eco_holding.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuration des sessions
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    SESSION_COOKIE_SECURE = False  # Mettre True en production avec HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Configuration de pagination
    ITEMS_PAR_PAGE = 10
    
    # Configuration email (optionnel pour notifications)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or '3010@Ecoholding'
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL') or 'ecoholding192@gmail.com'


class DeveloppementConfig(Config):
    """Configuration pour le développement"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Configuration pour la production (PythonAnywhere)"""
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True  # HTTPS obligatoire en production


class TestConfig(Config):
    """Configuration pour les tests"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


# Dictionnaire des configurations
config = {
    'developpement': DeveloppementConfig,
    'production': ProductionConfig,
    'test': TestConfig,
    'default': DeveloppementConfig
}