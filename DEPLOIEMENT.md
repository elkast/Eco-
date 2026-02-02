# 🚀 Guide de Déploiement ECO+HOLDING

## 📋 Table des matières

1. [Architecture de Production](#architecture-de-production)
2. [Prérequis](#prérequis)
3. [Déploiement sur Render](#déploiement-sur-render)
4. [Déploiement sur VPS](#déploiement-sur-vps)
5. [Configuration](#configuration)
6. [Tests de Production](#tests-de-production)
7. [Dépannage](#dépannage)

---

## 🏗️ Architecture de Production

```
Internet
   ↓
Nginx (Serveur Web - optionnel)
   ↓
Gunicorn (Serveur WSGI)
   ↓
Flask (Application)
   ↓
Base de données (MySQL/SQLite)
```

### ⚠️ IMPORTANT: Différences Local vs Production

| Aspect | Développement (Local) | Production |
|--------|----------------------|------------|
| Serveur | `python app.py` | `gunicorn wsgi:application` |
| Debug | ✅ Activé | ❌ Désactivé |
| Base de données | SQLite | MySQL (recommandé) |
| Variables d'env | `.env` | Variables serveur |
| Processus | 1 worker | 4+ workers |

---

## ✅ Prérequis

### Fichiers Requis (✅ Déjà créés)

- ✅ `wsgi.py` - Point d'entrée WSGI
- ✅ `requirements.txt` - Dépendances Python (avec gunicorn)
- ✅ `Procfile` - Configuration Render/Heroku
- ✅ `render.yaml` - Configuration Render
- ✅ `.env.example` - Exemple de variables d'environnement

### Structure du Projet

```
eco-holding/
├── app.py                  # Factory de l'application
├── wsgi.py                # ✅ Point d'entrée WSGI
├── run.py                 # Développement uniquement
├── requirements.txt       # ✅ Avec gunicorn
├── Procfile              # ✅ Pour Render/Heroku
├── render.yaml           # ✅ Configuration Render
├── config.py             # Configuration environnements
├── models.py             # Modèles de base de données
├── forms.py              # Formulaires WTForms
├── utils.py              # Utilitaires
├── routes/
│   ├── __init__.py
│   ├── main.py          # Routes publiques
│   └── admin.py         # Routes admin
├── templates/           # Templates Jinja2
├── static/             # CSS, JS, images
└── .env                # ❌ NE PAS COMMIT
```

---

## 🌐 Option A: Déploiement sur Render (Recommandé)

### Pourquoi Render?

✅ Simple et rapide  
✅ Support MySQL gratuit  
✅ HTTPS automatique  
✅ Logs en temps réel  
✅ Idéal pour MVP  

### Étapes de Déploiement

#### 1. Préparer le Repository

```bash
# Initialiser Git si ce n'est pas déjà fait
git init
git add .
git commit -m "Prêt pour déploiement"

# Pousser vers GitHub/GitLab
git remote add origin https://github.com/votre-username/eco-holding.git
git push -u origin main
```

#### 2. Créer un Compte Render

1. Allez sur [render.com](https://render.com)
2. Créez un compte (gratuit)
3. Connectez votre compte GitHub/GitLab

#### 3. Déployer l'Application

1. **Créer une base de données MySQL** (optionnel mais recommandé)
   - Dashboard → New → PostgreSQL ou MySQL
   - Nom: `ecoholding-db`
   - Plan: Free
   - Notez l'URL de connexion

2. **Créer le Web Service**
   - Dashboard → New → Web Service
   - Connectez votre repository
   - Configuration:
     ```
     Name: ecoholding
     Region: Frankfurt (ou proche de vous)
     Branch: main
     Runtime: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: gunicorn wsgi:application --workers 4 --bind 0.0.0.0:$PORT
     ```

3. **Configurer les Variables d'Environnement**
   
   Dans Render Dashboard → Environment:
   
   ```env
   FLASK_ENV=production
   SECRET_KEY=<générer-une-clé-aléatoire-très-longue>
   DATABASE_URL=<url-de-votre-base-de-données>
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=votre-email@gmail.com
   MAIL_PASSWORD=votre-mot-de-passe-app
   ADMIN_EMAIL=admin@ecoholding.com
   ```

   **🔐 Générer une SECRET_KEY sécurisée:**
   ```python
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

4. **Déployer**
   - Cliquez sur "Create Web Service"
   - Attendez la fin du build (3-5 minutes)
   - Votre site sera disponible sur `https://ecoholding.onrender.com`

---

## 🖥️ Option B: Déploiement sur VPS (Avancé)

### Prérequis

- Serveur VPS (DigitalOcean, OVH, Hetzner)
- Ubuntu 20.04 ou 22.04
- Accès SSH root
- Nom de domaine (optionnel)

### Installation

#### 1. Connexion au Serveur

```bash
ssh root@votre-ip-serveur
```

#### 2. Mise à Jour du Système

```bash
apt update && apt upgrade -y
```

#### 3. Installation des Dépendances

```bash
# Python et outils
apt install python3 python3-pip python3-venv nginx git -y

# MySQL (optionnel)
apt install mysql-server -y
mysql_secure_installation
```

#### 4. Créer un Utilisateur Applicatif

```bash
adduser ecoholding
usermod -aG sudo ecoholding
su - ecoholding
```

#### 5. Cloner le Repository

```bash
cd /home/ecoholding
git clone https://github.com/votre-username/eco-holding.git
cd eco-holding
```

#### 6. Créer un Environnement Virtuel

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 7. Configurer l'Environnement

```bash
# Copier l'exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

#### 8. Initialiser la Base de Données

```bash
# Si MySQL
mysql -u root -p
CREATE DATABASE ecoholding CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ecoholding'@'localhost' IDENTIFIED BY 'mot_de_passe_fort';
GRANT ALL PRIVILEGES ON ecoholding.* TO 'ecoholding'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Mettre à jour DATABASE_URL dans .env
DATABASE_URL=mysql+pymysql://ecoholding:mot_de_passe_fort@localhost/ecoholding
```

#### 9. Tester l'Application

```bash
gunicorn wsgi:application --bind 0.0.0.0:8000 --workers 4
```

Visitez: `http://votre-ip:8000`

#### 10. Créer un Service Systemd

```bash
sudo nano /etc/systemd/system/ecoholding.service
```

Contenu:

```ini
[Unit]
Description=ECO+HOLDING Web Application
After=network.target

[Service]
User=ecoholding
Group=www-data
WorkingDirectory=/home/ecoholding/eco-holding
Environment="PATH=/home/ecoholding/eco-holding/venv/bin"
ExecStart=/home/ecoholding/eco-holding/venv/bin/gunicorn \
    --workers 4 \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --access-logfile /var/log/ecoholding/access.log \
    --error-logfile /var/log/ecoholding/error.log \
    wsgi:application

Restart=always

[Install]
WantedBy=multi-user.target
```

Créer les dossiers de logs:

```bash
sudo mkdir -p /var/log/ecoholding
sudo chown ecoholding:www-data /var/log/ecoholding
```

Activer et démarrer:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ecoholding
sudo systemctl start ecoholding
sudo systemctl status ecoholding
```

#### 11. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/ecoholding
```

Contenu:

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/ecoholding/eco-holding/static;
        expires 30d;
    }
}
```

Activer le site:

```bash
sudo ln -s /etc/nginx/sites-available/ecoholding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 12. Installer HTTPS (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

---

## ⚙️ Configuration

### Variables d'Environnement

| Variable | Développement | Production | Description |
|----------|---------------|------------|-------------|
| `FLASK_ENV` | `developpement` | `production` | Mode d'exécution |
| `SECRET_KEY` | Simple | **Complexe** | Clé de sécurité Flask |
| `DATABASE_URL` | SQLite | MySQL | URL base de données |
| `MAIL_SERVER` | - | SMTP host | Serveur email |
| `MAIL_USERNAME` | - | Email | Compte email |
| `MAIL_PASSWORD` | - | Password | Mot de passe email |

### Compte Admin par Défaut

⚠️ **À CHANGER IMMÉDIATEMENT EN PRODUCTION**

```
Email: admin@ecoholding.com
Mot de passe: admin123
```

Pour changer:

```python
from app import creer_app
from models import db, UtilisateurAdmin

app = creer_app('production')
with app.app_context():
    admin = UtilisateurAdmin.query.filter_by(email='admin@ecoholding.com').first()
    admin.definir_mot_de_passe('nouveau_mot_de_passe_fort')
    db.session.commit()
```

---

## 🧪 Tests de Production

### 1. Vérifier le Déploiement

```bash
curl -I https://votre-site.com
```

Attendu: `HTTP/2 200`

### 2. Tester les Routes

```bash
# Page d'accueil
curl https://votre-site.com/

# Admin (doit rediriger vers login)
curl -I https://votre-site.com/admin/
```

### 3. Vérifier les Logs

**Render:**
- Dashboard → Logs

**VPS:**
```bash
# Logs de l'application
sudo tail -f /var/log/ecoholding/error.log

# Logs Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Dépannage

### Erreur: "ModuleNotFoundError: No module named 'app'"

**Cause:** Import incorrect dans `wsgi.py`

**Solution:** Vérifiez que `wsgi.py` contient:
```python
from app import creer_app
application = creer_app('production')
```

### Erreur: "Address already in use"

**Cause:** Port 8000 déjà utilisé

**Solution:**
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Erreur: "Database connection failed"

**Cause:** URL de base de données incorrecte

**Solution:** Vérifiez `DATABASE_URL` dans `.env`:
```
# Format MySQL
DATABASE_URL=mysql+pymysql://user:password@host:port/database

# Render PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database
```

### Erreur: "Internal Server Error 500"

**Cause:** Multiple (vérifier les logs)

**Solution:**
1. Vérifiez `FLASK_ENV=production`
2. Vérifiez `SECRET_KEY` est définie
3. Consultez les logs d'erreur

### Erreur: "Static files not loading"

**Cause:** Nginx mal configuré ou chemin incorrect

**Solution:** Vérifiez la configuration Nginx `location /static`

### Application lente

**Solutions:**
1. Augmenter le nombre de workers Gunicorn
   ```bash
   gunicorn wsgi:application --workers 8
   ```
2. Utiliser MySQL au lieu de SQLite
3. Activer la mise en cache

---

## 📊 Monitoring

### Vérifier l'État du Service (VPS)

```bash
sudo systemctl status ecoholding
```

### Logs en Temps Réel

```bash
sudo journalctl -u ecoholding -f
```

### Redémarrer l'Application

**Render:** Push vers Git (auto-redéploiement)

**VPS:**
```bash
sudo systemctl restart ecoholding
```

---

## 🔄 Mise à Jour de l'Application

### Render

```bash
git add .
git commit -m "Mise à jour"
git push
```

Render redéploiera automatiquement.

### VPS

```bash
cd /home/ecoholding/eco-holding
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart ecoholding
```

---

## 📚 Ressources

- [Documentation Flask](https://flask.palletsprojects.com/)
- [Documentation Gunicorn](https://gunicorn.org/)
- [Documentation Render](https://render.com/docs)
- [Guide Nginx](https://nginx.org/en/docs/)

---

## ✅ Checklist Pré-Déploiement

- [ ] `wsgi.py` créé et testé
- [ ] `gunicorn` ajouté dans `requirements.txt`
- [ ] Variables d'environnement configurées
- [ ] `SECRET_KEY` générée et sécurisée
- [ ] Base de données MySQL créée (si applicable)
- [ ] Mot de passe admin changé
- [ ] Tests locaux réussis avec Gunicorn
- [ ] Repository Git à jour
- [ ] Configuration email testée

---

## 🆘 Support

Pour toute question:
- Email: support@ecoholding.com
- Documentation: Ce fichier
- Issues GitHub: [Créer une issue](https://github.com/votre-repo/issues)

---

**✨ Bon déploiement! ✨**
