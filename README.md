# Eco+Holding - Système de Gestion d'Entreprise

## 📌 Description

Système Flask professionnel pour la gestion des demandes de rendez-vous et l'administration d'Eco+Holding. Interface moderne et dashboard admin complet.

## ✨ Fonctionnalités

### 🌐 Site Public
- Landing page moderne et responsive
- Formulaire de rendez-vous avec validation
- Système de notifications par email
- Témoignages clients
- Section FAQ interactive

### 🔐 Interface Administrateur
- Dashboard moderne inspiré des meilleures pratiques UI/UX
- Gestion complète des demandes clients
- Statistiques en temps réel
- Filtres et recherche avancée
- Tri et pagination
- Gestion des statuts des demandes

### 📧 Système d'Emails
- Confirmation automatique aux clients
- Notifications aux administrateurs
- Relances automatiques (Celery)
- Templates personnalisés

### 🔒 Sécurité
- Protection CSRF
- Hachage sécurisé des mots de passe (pbkdf2:sha256)
- Sessions sécurisées
- Variables d'environnement pour secrets
- Prêt pour HTTPS

## 🛠️ Stack Technique

- **Backend**: Flask 3.0
- **Base de données**: SQLite (dev) / MySQL (prod)
- **ORM**: SQLAlchemy
- **Migrations**: Flask-Migrate
- **Formulaires**: Flask-WTF
- **Emails**: Flask-Mailman
- **Tâches async**: Celery + Redis
- **Frontend**: HTML5, CSS3, JavaScript
- **Icons**: Font Awesome 6
- **Animations**: AOS

## 📦 Installation

### Développement Local

```bash
# Cloner le projet
git clone <repo-url>
cd Eco-

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Copier et configurer .env
copy .env.example .env
# Éditer .env avec vos valeurs

# Lancer l'application
python run.py
```

L'application sera accessible sur http://localhost:5000

### Compte Admin par Défaut

- **Email**: admin@ecoholding.com
- **Mot de passe**: admin123
- **⚠️ À CHANGER IMMÉDIATEMENT EN PRODUCTION**

## 🚀 Déploiement en Production

Consultez le guide détaillé: [DEPLOIEMENT.md](DEPLOIEMENT.md)

### Étapes Rapides

1. Configurer MySQL
2. Configurer Redis
3. Créer .env avec valeurs de production
4. Installer dépendances: `pip install -r requirements.txt`
5. Migrations: `flask db upgrade`
6. Lancer avec Gunicorn: `gunicorn -w 4 "run:creer_app('production')"`

## 📁 Structure du Projet

```
Eco-/
├── blueprint/              # Blueprints Flask
│   ├── admin/             # Routes admin
│   └── contact/           # Routes contact
├── static/                 # Fichiers statiques
│   ├── css/               # Styles
│   ├── js/                # Scripts JavaScript
│   └── img/               # Images et icons
├── tasks/                  # Tâches Celery
│   └── email_tasks.py     # Envoi emails asynchrone
├── templates/              # Templates HTML
│   ├── admin/             # Templates admin
│   └── sections/          # Sections réutilisables
├── config.py              # Configuration
├── models.py              # Modèles SQLAlchemy
├── forms.py               # Formulaires WTF
├── utils.py               # Fonctions utilitaires
├── run.py                 # Point d'entrée
├── wsgi.py                # Point d'entrée WSGI
├── celery_app.py          # Configuration Celery
└── requirements.txt       # Dépendances
```

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète.

**Essentielles:**
- `SECRET_KEY`: Clé secrète Flask
- `DATABASE_URL`: URL de connexion MySQL
- `MAIL_USERNAME`: Email pour SMTP
- `MAIL_PASSWORD`: Mot de passe application Gmail
- `REDIS_URL`: URL Redis pour Celery

## 📧 Configuration Email Gmail

1. Activer la validation en 2 étapes
2. Créer un mot de passe d'application
3. Utiliser ce mot de passe dans `MAIL_PASSWORD`

## 🎨 Personnalisation

### Couleurs (variables CSS)

```css
:root {
    --couleur-primaire: #1E3A8A;
    --couleur-accent: #D4AF37;
    --couleur-succes: #10B981;
    /* ... */
}
```

### Services

Modifier dans `forms.py` et `templates/index.html`

## 🧪 Tests

```bash
# Installer dépendances de test
pip install pytest pytest-flask

# Lancer les tests
pytest
```

## 📊 Monitoring

### Logs

```bash
# Application
tail -f logs/eco-holding.log

# Celery Worker
celery -A celery_app:creer_celery_app worker --loglevel=info

# Celery Beat
celery -A celery_app:creer_celery_app beat --loglevel=info
```

### Santé du Système

```bash
# État des services
systemctl status eco-holding celery-worker celery-beat

# Connexions actives
netstat -an | grep :5000
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est la propriété d'Eco+Holding.

## 📞 Contact

**Eco+Holding**
- Email: ecoholding192@gmail.com
- Site: https://www.ecoholding.com

## ⚠️ Notes Importantes

### Sécurité

- ❌ Ne jamais commiter le fichier `.env`
- ✅ Changer le mot de passe admin par défaut
- ✅ Utiliser HTTPS en production
- ✅ Configurer le firewall
- ✅ Sauvegardes régulières de la base de données

### Performance

- Activer la mise en cache
- Optimiser les requêtes SQL
- Compresser les assets
- Utiliser un CDN pour les fichiers statiques

### Maintenance

- Mettre à jour les dépendances régulièrement
- Surveiller les logs d'erreurs
- Tester après chaque mise à jour
- Sauvegarder avant toute modification majeure

## 🎯 Roadmap

- [ ] API REST complète
- [ ] Export des données en Excel/PDF
- [ ] Notifications push
- [ ] Application mobile
- [ ] Intégration calendrier Google
- [ ] Chat en direct
- [ ] Analytics avancés

---

Développé avec ❤️ par l'équipe Eco+Holding