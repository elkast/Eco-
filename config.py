"""
Configuration de l'application Flask Eco+Holding
Utilise les variables d'environnement pour la sécurité
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

# Répertoire de base de l'application
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Configuration de base pour l'application Flask"""

    # Clé secrète - OBLIGATOIRE pour les sessions et CSRF
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cle-temporaire-a-changer-en-production'

    # Configuration de la base de données
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'eco_holding.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,  # Vérifie les connexions avant utilisation
        'pool_recycle': 300,    # Recycle les connexions toutes les 5 minutes
    }

    # Configuration des sessions
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    SESSION_COOKIE_SECURE = False  # True en production avec HTTPS
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    # Configuration CSRF
    WTF_CSRF_ENABLED = True
    WTF_CSRF_TIME_LIMIT = None  # Pas d'expiration du token CSRF

    # Configuration email (Flask-Mailman)
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() in ['true', 'on', '1']
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('ADMIN_EMAIL', 'ecoholding192@gmail.com')
    
    # Configuration Celery pour tâches asynchrones
    CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')

    # Configuration de pagination
    ITEMS_PAR_PAGE = 10


class DeveloppementConfig(Config):
    """Configuration pour le développement"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Configuration pour la production"""
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True  # HTTPS obligatoire
    
    # En production, utiliser MySQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f"mysql+pymysql://{os.environ.get('DB_USER', 'eco_user')}:" \
        f"{os.environ.get('DB_PASSWORD', 'password')}@" \
        f"{os.environ.get('DB_HOST', 'localhost')}/" \
        f"{os.environ.get('DB_NAME', 'eco_holding')}"
    
    # Configuration Celery pour tâches asynchrones
    CELERY_BROKER_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')


class TestConfig(Config):
    """Configuration pour les tests"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False


# Dictionnaire des configurations
configurations = {
    'developpement': DeveloppementConfig,
    'production': ProductionConfig,
    'test': TestConfig,
    'default': DeveloppementConfig
}