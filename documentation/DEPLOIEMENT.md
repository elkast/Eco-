# Guide de Déploiement - Eco+Holding

## 📋 Prérequis

- Python 3.10+
- MySQL 8.0+
- Redis (pour les tâches asynchrones)
- Serveur web (PythonAnywhere, VPS, etc.)

## 🔧 Installation en Production

### 1. Préparer le Serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Python et dépendances
sudo apt install python3.10 python3.10-venv python3-pip -y

# Installer MySQL
sudo apt install mysql-server -y

# Installer Redis
sudo apt install redis-server -y
```

### 2. Créer la Base de Données MySQL

```bash
# Connecter à MySQL
sudo mysql -u root -p

# Créer la base et l'utilisateur
CREATE DATABASE eco_holding CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'eco_user'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON eco_holding.* TO 'eco_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Cloner et Configurer l'Application

```bash
# Cloner le projet
cd /var/www
git clone votre-repo.git eco-holding
cd eco-holding

# Créer l'environnement virtuel
python3.10 -m venv venv
source venv/bin/activate

# Installer les dépendances
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configuration (.env)

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer avec vos valeurs
nano .env
```

**Valeurs importantes à configurer:**

```env
FLASK_ENV=production
SECRET_KEY=GENERER_UNE_CLE_SECRETE_ALEATOIRE
DEBUG=False

DB_HOST=localhost
DB_USER=eco_user
DB_PASSWORD=VOTRE_MOT_DE_PASSE_MYSQL
DB_NAME=eco_holding

MAIL_USERNAME=ecoholding192@gmail.com
MAIL_PASSWORD=VOTRE_MOT_DE_PASSE_APPLICATION_GMAIL

REDIS_URL=redis://localhost:6379/0
```

### 5. Initialiser la Base de Données

```bash
# Activer l'environnement virtuel
source venv/bin/activate

# Initialiser les migrations
flask db init

# Créer la première migration
flask db migrate -m "Initial migration"

# Appliquer les migrations
flask db upgrade

# Créer l'utilisateur admin
python << EOF
from run import creer_app
from models import db, UtilisateurAdmin

app = creer_app('production')
with app.app_context():
    if UtilisateurAdmin.query.count() == 0:
        admin = UtilisateurAdmin(
            email='admin@ecoholding.com',
            nom='Kouassi',
            prenom='Yao',
            role='super_admin'
        )
        admin.definir_mot_de_passe('MotDePasseSecurise2025!')
        db.session.add(admin)
        db.session.commit()
        print("Admin créé avec succès")
EOF
```

### 6. Configurer Gunicorn

```bash
# Créer le fichier de service systemd
sudo nano /etc/systemd/system/eco-holding.service
```

**Contenu du fichier:**

```ini
[Unit]
Description=Eco+Holding Flask Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/eco-holding
Environment="PATH=/var/www/eco-holding/venv/bin"
ExecStart=/var/www/eco-holding/venv/bin/gunicorn --workers 4 --bind 0.0.0.0:8000 "run:creer_app('production')"
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Démarrer le service
sudo systemctl daemon-reload
sudo systemctl start eco-holding
sudo systemctl enable eco-holding
sudo systemctl status eco-holding
```

### 7. Configurer Celery (Tâches Asynchrones)

```bash
# Créer le service Celery Worker
sudo nano /etc/systemd/system/celery-worker.service
```

**Contenu:**

```ini
[Unit]
Description=Celery Worker Service
After=network.target

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/var/www/eco-holding
Environment="PATH=/var/www/eco-holding/venv/bin"
ExecStart=/var/www/eco-holding/venv/bin/celery -A celery_app:creer_celery_app worker --loglevel=info
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Créer le service Celery Beat (tâches planifiées)
sudo nano /etc/systemd/system/celery-beat.service
```

**Contenu:**

```ini
[Unit]
Description=Celery Beat Service
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/eco-holding
Environment="PATH=/var/www/eco-holding/venv/bin"
ExecStart=/var/www/eco-holding/venv/bin/celery -A celery_app:creer_celery_app beat --loglevel=info
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Démarrer les services
sudo systemctl daemon-reload
sudo systemctl start celery-worker
sudo systemctl start celery-beat
sudo systemctl enable celery-worker
sudo systemctl enable celery-beat
```

### 8. Configurer Nginx

```bash
sudo nano /etc/nginx/sites-available/eco-holding
```

**Contenu:**

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
        alias /var/www/eco-holding/static;
        expires 30d;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/eco-holding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. SSL avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Auto-renouvellement (déjà configuré automatiquement)
sudo certbot renew --dry-run
```

## 🔐 Sécurité Post-Déploiement

### Changements Obligatoires

1. **Changer le mot de passe admin:**
```bash
python << EOF
from run import creer_app
from models import db, UtilisateurAdmin

app = creer_app('production')
with app.app_context():
    admin = UtilisateurAdmin.query.filter_by(email='admin@ecoholding.com').first()
    admin.definir_mot_de_passe('NOUVEAU_MOT_DE_PASSE_TRES_SECURISE')
    db.session.commit()
EOF
```

2. **Générer une nouvelle SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
# Copier la valeur dans .env
```

3. **Configurer le firewall:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📊 Monitoring

### Vérifier les Logs

```bash
# Logs application
sudo journalctl -u eco-holding -f

# Logs Celery
sudo journalctl -u celery-worker -f
sudo journalctl -u celery-beat -f

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Surveiller les Performances

```bash
# État des services
sudo systemctl status eco-holding celery-worker celery-beat redis

# Utilisation des ressources
htop

# Connexions MySQL
mysql -u eco_user -p -e "SHOW PROCESSLIST;"
```

## 🔄 Mise à Jour

```bash
cd /var/www/eco-holding
source venv/bin/activate

# Pull les dernières modifications
git pull origin main

# Installer nouvelles dépendances
pip install -r requirements.txt

# Appliquer migrations
flask db migrate -m "Description"
flask db upgrade

# Redémarrer les services
sudo systemctl restart eco-holding
sudo systemctl restart celery-worker
sudo systemctl restart celery-beat
```

## 🆘 Dépannage

### Erreur de connexion MySQL

```bash
# Vérifier le service
sudo systemctl status mysql

# Tester la connexion
mysql -u eco_user -p eco_holding
```

### Emails ne s'envoient pas

1. Vérifier que Celery fonctionne: `sudo systemctl status celery-worker`
2. Vérifier les logs: `sudo journalctl -u celery-worker -f`
3. Tester le mot de passe d'application Gmail
4. Vérifier Redis: `redis-cli ping`

### L'application ne démarre pas

```bash
# Vérifier les logs
sudo journalctl -u eco-holding -n 50

# Tester manuellement
cd /var/www/eco-holding
source venv/bin/activate
gunicorn --bind 0.0.0.0:8000 "run:creer_app('production')"
```

## 📞 Support

Pour toute question: ecoholding192@gmail.com