# 🏢 ECO+HOLDING - Plateforme de Gestion d'Affaires

Application web professionnelle pour ECO+HOLDING, cabinet de gestion d'affaires et d'intermédiation basé à Abidjan, Côte d'Ivoire.

## 🌟 Fonctionnalités

### Frontend Public
- 🏠 **Page d'accueil** moderne et responsive
- 📋 **Présentation** de l'entreprise et des services
- 🏗️ **Services détaillés:**
  - Gestion d'affaires & Intermédiation
  - Prestige Immobilier
  - Eco+Trans-Logistique
- 📝 **Formulaire de demande** avec validation complète
- 👥 **Page équipe** et vision/valeurs
- 📱 **100% Responsive** - Mobile, tablette, desktop

### Backend Admin
- 🔐 **Authentification sécurisée**
- 📊 **Tableau de bord** avec statistiques en temps réel
- 📋 **Gestion des demandes** clients
- 🔄 **Filtres et pagination** avancés
- 📧 **Envoi d'emails** aux clients
- 💬 **WhatsApp direct** depuis l'interface
- 📝 **Notes administrateur** et suivi
- 🎨 **Interface moderne** et intuitive

## 🎨 Design

### Palette de Couleurs
- **Bleu Principal:** `#0D2A52` (Dark Navy)
- **Bleu Foncé:** `#081729` (Very Dark Blue)
- **Rouge Accent:** `#DC1F3C` (Crimson)
- **Blanc:** `#FFFFFF`
- **Noir:** `#000000`

### Typographie
- **Titres:** Montserrat (700-800)
- **Corps:** Source Sans 3 (400-600)

### Accessibilité
- ✅ Contrastes WCAG AAA
- ✅ Texte lisible et bien espacé
- ✅ Navigation au clavier
- ✅ Responsive design

## 🛠️ Technologies

### Backend
- **Framework:** Flask 3.0.0
- **Base de données:** SQLAlchemy (SQLite dev / MySQL prod)
- **Formulaires:** Flask-WTF + WTForms
- **Email:** Flask-Mail
- **Sécurité:** Werkzeug password hashing
- **Serveur WSGI:** Gunicorn

### Frontend
- **HTML5 / CSS3**
- **JavaScript Vanilla**
- **Animations:** AOS (Animate On Scroll)
- **Icons:** Font Awesome 6

### Architecture
- **Pattern:** MVT (Model-View-Template)
- **Blueprints:** Séparation routes public/admin
- **Factory Pattern:** Application Flask modulaire

## 📦 Installation

### Prérequis
- Python 3.10+
- pip
- Git

### Développement Local

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/eco-holding.git
   cd eco-holding
   ```

2. **Créer un environnement virtuel**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurer l'environnement**
   ```bash
   # Copier l'exemple
   copy .env.example .env     # Windows
   cp .env.example .env       # Mac/Linux
   
   # Éditer .env avec vos valeurs
   ```

5. **Lancer l'application**
   ```bash
   python run.py
   ```

6. **Accéder à l'application**
   - Frontend: http://localhost:5000
   - Admin: http://localhost:5000/admin
   - Identifiants: `admin@ecoholding.com` / `admin123`

## 🚀 Déploiement en Production

**⚠️ IMPORTANT:** Ne JAMAIS faire `python run.py` en production!

### Architecture Production
```
Internet → Railway (Gunicorn) → Flask → Railway MySQL
```

### Option Recommandée: Railway

✅ **Simple et rapide** - Déploiement en 5 minutes  
✅ **MySQL inclus** - Base de données intégrée  
✅ **HTTPS automatique** - SSL gratuit  
✅ **$5 gratuits** - Trial sans carte bancaire  
✅ **Auto-deploy** - Push Git = déploiement automatique  

**Commande de démarrage Railway:**
```bash
gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 4
```

📖 **[Guide Railway Complet](RAILWAY.md)** ← **RECOMMANDÉ**  
📖 **[Guide Render/VPS Alternatif](DEPLOIEMENT.md)**

### Configuration MySQL Railway

```env
# Format DATABASE_URL pour Railway
DATABASE_URL=mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE

# ⚠️ IMPORTANT: 
# - Utilisez mysql+pymysql:// (pas mysql://)
# - PyMySQL doit être dans requirements.txt
```

**Initialisation base de données:**
```bash
railway run python init_db.py
```

## 📂 Structure du Projet

```
eco-holding/
├── app.py                 # Factory application Flask
├── wsgi.py               # Point d'entrée WSGI (PRODUCTION)
├── run.py                # Point d'entrée développement
├── config.py             # Configurations environnements
├── models.py             # Modèles SQLAlchemy
├── forms.py              # Formulaires WTForms
├── utils.py              # Utilitaires (emails, etc.)
│
├── routes/               # Blueprints
│   ├── main.py          # Routes publiques
│   └── admin.py         # Routes administrateur
│
├── templates/           # Templates Jinja2
│   ├── index.html
│   ├── presentation.html
│   ├── services.html
│   └── admin/
│       ├── base_admin.html
│       ├── connexion.html
│       ├── tableau_de_bord.html
│       ├── demandes.html
│       └── detail_demande.html
│
├── static/              # Assets statiques
│   ├── css/
│   │   ├── styles.css
│   │   └── admin.css
│   ├── js/
│   └── images/
│
├── requirements.txt     # Dépendances Python
├── Procfile            # Configuration serveurs PaaS
├── render.yaml         # Configuration Render
├── runtime.txt         # Version Python
├── .env.example        # Template variables d'environnement
├── .gitignore
├── README.md
└── DEPLOIEMENT.md      # Guide détaillé déploiement
```

## ⚙️ Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine:

```env
# Environnement
FLASK_ENV=developpement  # ou 'production'

# Sécurité
SECRET_KEY=votre-cle-secrete-tres-longue

# Base de données
DATABASE_URL=sqlite:///eco_holding.db  # Développement
# DATABASE_URL=mysql+pymysql://user:pass@host/db  # Production

# Email (optionnel)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-app
ADMIN_EMAIL=admin@ecoholding.com
```

### Générer une SECRET_KEY sécurisée

```python
python -c "import secrets; print(secrets.token_hex(32))"
```

## 👤 Compte Admin par Défaut

**⚠️ À CHANGER IMMÉDIATEMENT EN PRODUCTION**

```
Email: admin@ecoholding.com
Mot de passe: admin123
```

## 🧪 Tests

### Tester l'application

```bash
# Lancer en mode développement
python run.py

# Tester avec Gunicorn (comme en production)
gunicorn wsgi:application --bind 127.0.0.1:8000
```

### Vérifier les routes

- ✅ `/` - Page d'accueil
- ✅ `/presentation` - Présentation
- ✅ `/services` - Services
- ✅ `/prestige-immobilier` - Prestige Immobilier
- ✅ `/translogistique` - Transport & Logistique
- ✅ `/vision-valeurs` - Vision et Valeurs
- ✅ `/admin` - Interface admin

## 🔧 Commandes Utiles

### Base de données

```python
# Ouvrir console Python
from app import creer_app
from models import db, UtilisateurAdmin, DemandeClient

app = creer_app('developpement')
with app.app_context():
    # Créer les tables
    db.create_all()
    
    # Ajouter un admin
    admin = UtilisateurAdmin(
        email='nouveau@admin.com',
        nom='Nom',
        prenom='Prénom'
    )
    admin.definir_mot_de_passe('mot_de_passe_fort')
    db.session.add(admin)
    db.session.commit()
```

### Mise à jour des dépendances

```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

## 📱 Fonctionnalités à Venir

- [ ] Système de notifications push
- [ ] Export des demandes en PDF/Excel
- [ ] Dashboard avec graphiques avancés
- [ ] Multi-utilisateurs avec rôles
- [ ] API REST pour applications mobiles
- [ ] Historique complet des actions
- [ ] Système de tickets support
- [ ] Chat en direct avec clients

## 🐛 Problèmes Courants

### ModuleNotFoundError

```bash
# Solution: Activer l'environnement virtuel
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### Port déjà utilisé

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Base de données locked (SQLite)

```bash
# Supprimer la base et recréer
rm eco_holding.db
python run.py
```

## 📝 License

© 2024 ECO+HOLDING. Tous droits réservés.

## 👥 Contact

**ECO+HOLDING**  
Abidjan, Côte d'Ivoire

- 📧 Email: contact@ecoholding.com
- 📞 WhatsApp: +225 05 04 47 72 68 / +225 07 05 92 87 80
- 🌐 Site: [www.ecoholding.com](https://www.ecoholding.com)

---

**Développé avec ❤️ par ECO+HOLDING**
