"""
Blueprint pour la gestion des contacts et demandes de rendez-vous
"""
from flask import Blueprint

contact_bp = Blueprint('contact', __name__)

from blueprint.contact import routes