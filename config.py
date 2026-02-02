"""
Configuration pour l'application ECO+HOLDING
"""

import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()


class Config:
    """Configuration de base"""

    # Clé secrète Flask
    SECRET_KEY = os.environ.get("SECRET_KEY") or "cle-secrete-dev-a-changer"

    # Configuration base de données (Railway MySQL avec PyMySQL)
    _db_url = os.environ.get("DATABASE_URL") or "sqlite:///eco_holding.db"
    
    # Normalisation de l'URL pour Railway MySQL
    # Railway peut fournir mysql:// mais Flask+SQLAlchemy+PyMySQL nécessite mysql+pymysql://
    if _db_url.startswith("mysql://"):
        _db_url = _db_url.replace("mysql://", "mysql+pymysql://", 1)
    
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # Options de connexion MySQL pour Railway (SSL et timeout)
    if "mysql" in _db_url.lower():
        SQLALCHEMY_ENGINE_OPTIONS = {
            'pool_pre_ping': True,  # Vérifier la connexion avant utilisation
            'pool_recycle': 300,    # Recycler les connexions toutes les 5 minutes
            'connect_args': {
                'connect_timeout': 10  # Timeout de connexion 10 secondes
            }
        }

    # Configuration pagination
    DEMANDES_PAR_PAGE = 20

    # Configuration email (optionnel)
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 587)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True") == "True"
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or "admin@ecoholding.com"


class DeveloppementConfig(Config):
    """Configuration développement"""

    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """Configuration production"""

    DEBUG = False
    # URI héritée de Config ; valider MySQL ou SQLite
    if not ("mysql" in Config.SQLALCHEMY_DATABASE_URI or "sqlite" in Config.SQLALCHEMY_DATABASE_URI):
        raise ValueError(
            "La configuration de production nécessite une base de données MySQL ou SQLite"
        )


# Dictionnaire des configurations
config = {
    "developpement": DeveloppementConfig,
    "production": ProductionConfig,
    "default": DeveloppementConfig,
}
