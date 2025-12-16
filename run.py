import os
from flask import Flask, render_template
from config import config
from models import db
from blueprint.contact.routes import contact_bp
from blueprint.admin.routes import admin_bp


def creer_app(config_name=None):
    """Factory pour créer l'application Flask"""
    
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'developpement')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialiser la base de données
    db.init_app(app)
    
    # Enregistrer les blueprints
    app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    
    # Route principale
    @app.route('/')
    def index():
        return render_template('index.html')
    
    # Routes pour les pages légales
    @app.route('/mentions-legales')
    def mentions_legales():
        return render_template('Mentions légales.html')
    
    @app.route('/politique-confidentialite')
    def politique_confidentialite():
        return render_template('Politique de confidentialité.html')
    
    @app.route('/cgu')
    def cgu():
        return render_template('CGU.html')
    
    @app.route('/plan-du-site')
    def plan_du_site():
        return render_template('Plan du site.html')
    
    # Gestionnaire d'erreurs
    @app.errorhandler(404)
    def page_non_trouvee(e):
        return render_template('404.html'), 404
    
    @app.errorhandler(500)
    def erreur_serveur(e):
        return render_template('500.html'), 500
    
    # Créer les tables si elles n'existent pas
    with app.app_context():
        db.create_all()
        
        # Créer un utilisateur admin par défaut si aucun n'existe
        from models import UtilisateurAdmin
        if UtilisateurAdmin.query.count() == 0:
            admin = UtilisateurAdmin(
                email='admin@ecoholding.com',
                nom='Administrateur',
                role='admin'
            )
            admin.definir_mot_de_passe('admin123')  # CHANGER EN PRODUCTION
            db.session.add(admin)
            db.session.commit()
            print("✓ Utilisateur admin créé: admin@ecoholding.com / admin123")
    
    return app


if __name__ == "__main__":
    app = creer_app()
    app.run(debug=True, host='0.0.0.0', port=5000)