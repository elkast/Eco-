# ECO+HOLDING - Application Web Professionnelle

Application web complète pour ECO+HOLDING, un cabinet de gestion d'affaires et d'intermédiation avec trois divisions principales.

## 🏢 À propos

ECO+HOLDING est un cabinet professionnel offrant des services dans trois domaines:

1. **ECO+HOLDING** - Cabinet de Gestion d'affaires et d'intermédiation
2. **PRESTIGE IMMOBILIER** - Gestion Immobilière
3. **ECO+TRANS-LOGISTIQUE** - Import-export, Logistique et Transport

## ✨ Fonctionnalités

### Interface Client
- Page d'accueil moderne avec animations
- Présentation des trois divisions
- Formulaire de contact avec validation
- Pages légales (Mentions légales, CGU, etc.)
- Design responsive (mobile, tablette, desktop)
- Thème professionnel bleu et or

### Interface Admin
- Connexion sécurisée
- Tableau de bord avec statistiques
- Gestion des demandes clients (CRUD complet)
- Filtrage et recherche avancés
- Tri et pagination
- Mise à jour du statut des demandes

## 🚀 Installation Locale

### Prérequis
- Python 3.10 ou supérieur
- pip (gestionnaire de paquets Python)

### Étapes d'installation

1. **Cloner le projet**
```powershell
cd c:\Users\orsin\OneDrive\Desktop\Eco-
```

2. **Créer un environnement virtuel**
```powershell
python -m venv venv
```

3. **Activer l'environnement virtuel**
```powershell
.\venv\Scripts\Activate.ps1
```

4. **Installer les dépendances**
```powershell
pip install -r requirements.txt
```

5. **Lancer l'application**
```powershell
python run.py
```

6. **Accéder à l'application**
- Site web: http://localhost:5000
- Admin: http://localhost:5000/admin/connexion
  - Email: admin@ecoholding.com
  - Mot de passe: admin123 (⚠️ À CHANGER EN PRODUCTION)

## 📦 Déploiement sur PythonAnywhere

### Étape 1: Créer un compte
1. Aller sur https://www.pythonanywhere.com
2. Créer un compte gratuit ou payant

### Étape 2: Uploader les fichiers
1. Aller dans l'onglet "Files"
2. Uploader tous les fichiers du projet SAUF:
   - Le dossier `venv/`
   - Le fichier `eco_holding.db` (sera créé automatiquement)
   - Le dossier `__pycache__/`

### Étape 3: Créer un environnement virtuel
```bash
mkvirtualenv --python=/usr/bin/python3.10 eco-holding-env
```

### Étape 4: Installer les dépendances
```bash
pip install -r requirements.txt
```

### Étape 5: Configurer l'application web
1. Aller dans l'onglet "Web"
2. Cliquer sur "Add a new web app"
3. Choisir "Manual configuration"
4. Choisir Python 3.10

### Étape 6: Configurer le WSGI
Éditer le fichier WSGI et remplacer son contenu par:

```python
import sys
import os

# Ajouter le chemin du projet
project_home = '/home/VOTRE_USERNAME/Eco-'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Définir la variable d'environnement
os.environ['FLASK_ENV'] = 'production'

# Importer l'application
from run import creer_app
application = creer_app('production')
```

### Étape 7: Configurer l'environnement virtuel
Dans l'onglet "Web", section "Virtualenv":
```
/home/VOTRE_USERNAME/.virtualenvs/eco-holding-env
```

### Étape 8: Configurer les fichiers statiques
Dans l'onglet "Web", section "Static files":
- URL: `/static/`
- Directory: `/home/VOTRE_USERNAME/Eco-/static/`

### Étape 9: Variables d'environnement (optionnel)
Créer un fichier `.env` dans le dossier du projet:
```
SECRET_KEY=votre-cle-secrete-tres-longue-et-aleatoire
FLASK_ENV=production
```

### Étape 10: Initialiser la base de données
Dans la console Bash de PythonAnywhere:
```bash
cd ~/Eco-
workon eco-holding-env
python
>>> from run import creer_app
>>> from models import db
>>> app = creer_app('production')
>>> with app.app_context():
...     db.create_all()
...     print("Base de données créée!")
>>> exit()
```

### Étape 11: Recharger l'application
Cliquer sur le bouton "Reload" dans l'onglet "Web"

## 🔐 Sécurité

### ⚠️ IMPORTANT - À faire avant la mise en production:

1. **Changer le mot de passe admin**
```python
# Dans la console Python
from run import creer_app
from models import db, UtilisateurAdmin

app = creer_app('production')
with app.app_context():
    admin = UtilisateurAdmin.query.filter_by(email='admin@ecoholding.com').first()
    admin.definir_mot_de_passe('NOUVEAU_MOT_DE_PASSE_SECURISE')
    db.session.commit()
```

2. **Générer une nouvelle SECRET_KEY**
```python
import secrets
print(secrets.token_hex(32))
```

3. **Activer HTTPS** (automatique sur PythonAnywhere pour les domaines payants)

## 📱 Contact

- **Téléphone**: 0504477268 / 0705928780
- **Email**: ecoholding192@gmail.com
- **Localisation**: Riviera Palmeraie non loin du carrefour Guiro, Abidjan, Côte d'Ivoire

## 🛠️ Technologies Utilisées

- **Backend**: Flask 3.0, SQLAlchemy
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Base de données**: SQLite
- **Animations**: AOS (Animate On Scroll)
- **Icons**: Font Awesome 6
- **Fonts**: Inter, Playfair Display (Google Fonts)

## 📄 Structure du Projet

```
Eco-/
├── blueprint/
│   ├── admin/          # Routes admin
│   └── contact/        # Routes contact
├── static/
│   ├── css/           # Fichiers CSS
│   ├── js/            # Fichiers JavaScript
│   └── img/           # Images
├── templates/
│   ├── admin/         # Templates admin
│   └── *.html         # Templates client
├── config.py          # Configuration
├── models.py          # Modèles de base de données
├── run.py             # Point d'entrée
└── requirements.txt   # Dépendances Python
```

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans `static/css/styles.css` et `static/css/admin.css`:
- Bleu primaire: #1E3A8A
- Or accent: #D4AF37

### Contenu
Modifier les fichiers HTML dans le dossier `templates/`

## 📝 Licence

© 2025 Eco+Holding. Tous droits réservés.

## 👨‍💻 Support

Pour toute question ou assistance, contactez l'équipe de développement.