# 🚂 Déploiement ECO+HOLDING sur Railway

Guide complet et sans approximation pour déployer votre application Flask avec MySQL Railway.

---

## 📋 Vue d'Ensemble

```
GitHub/GitLab
    ↓
Railway (Backend Flask + Gunicorn)
    ↓
Railway MySQL (Base de données)
```

**Architecture:**
- Railway héberge votre application Flask
- Railway MySQL héberge votre base de données
- Flask lit DATABASE_URL depuis les variables d'environnement Railway

---

## ✅ Prérequis

### 1. Fichiers Requis (Déjà Présents)

- ✅ `wsgi.py` - Point d'entrée WSGI
- ✅ `requirements.txt` - Avec `Flask`, `gunicorn`, `PyMySQL`
- ✅ `init_db.py` - Script d'initialisation base de données
- ✅ `config.py` - Configuration Railway MySQL optimisée
- ✅ `.gitignore` - Protection fichiers sensibles

### 2. Vérifier requirements.txt

**OBLIGATOIRE** - Ces packages doivent être présents:

```txt
Flask==3.0.0
gunicorn==21.2.0
PyMySQL==1.1.0
SQLAlchemy
python-dotenv
```

⚠️ **Sans `PyMySQL`** → MySQL ne fonctionnera pas  
⚠️ **Sans `gunicorn`** → L'app ne démarrera pas

---

## 🚀 Étape 1: Créer le Projet Railway

### 1.1 Créer un Compte

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub/GitLab
3. Railway offre $5 de crédit gratuit

### 1.2 Créer un Nouveau Projet

1. Dashboard → **New Project**
2. Sélectionnez **Deploy from GitHub repo**
3. Choisissez votre repository `eco-holding`
4. Railway détecte automatiquement Python

---

## 🗄️ Étape 2: Ajouter MySQL Railway

### 2.1 Ajouter le Plugin MySQL

1. Dans votre projet Railway → **New** → **Database** → **Add MySQL**
2. Railway crée automatiquement une base MySQL
3. Railway génère automatiquement ces variables:
   - `MYSQLHOST`
   - `MYSQLPORT` 
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

### 2.2 Récupérer les Informations MySQL

Dans Railway → MySQL service → **Variables**

Vous verrez quelque chose comme:

```
MYSQLHOST=containers-us-west-42.railway.app
MYSQLPORT=6543
MYSQLUSER=root
MYSQLPASSWORD=abcd1234XYZ
MYSQLDATABASE=railway
```

---

## ⚙️ Étape 3: Configurer les Variables d'Environnement

### 3.1 Construire DATABASE_URL

**Format EXACT requis par Flask + SQLAlchemy + PyMySQL:**

```
mysql+pymysql://USER:PASSWORD@HOST:PORT/DATABASE
```

**Exemple concret Railway:**

Si Railway vous donne:
- USER: `root`
- PASSWORD: `abcd1234`
- HOST: `containers-us-west-42.railway.app`
- PORT: `6543`
- DATABASE: `railway`

Alors DATABASE_URL est:

```
mysql+pymysql://root:abcd1234@containers-us-west-42.railway.app:6543/railway
```

### 3.2 Ajouter les Variables dans Railway

Dans Railway → Votre app Flask → **Variables**:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `FLASK_ENV` | `production` | Mode production |
| `SECRET_KEY` | `<clé-aléatoire-64-char>` | Clé sécurité Flask |
| `DATABASE_URL` | `mysql+pymysql://...` | URL connexion MySQL |

**Générer SECRET_KEY:**

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 3.3 Variables Email (Optionnel)

Si vous utilisez l'envoi d'emails:

| Variable | Exemple |
|----------|---------|
| `MAIL_SERVER` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USE_TLS` | `True` |
| `MAIL_USERNAME` | `votre-email@gmail.com` |
| `MAIL_PASSWORD` | `mot-de-passe-app` |
| `ADMIN_EMAIL` | `admin@ecoholding.com` |

---

## 🔧 Étape 4: Configuration du Build Railway

### 4.1 Build Command

Railway détecte automatiquement, mais vous pouvez forcer:

```bash
pip install -r requirements.txt
```

### 4.2 Start Command

**IMPORTANT** - Dans Railway → Settings → **Start Command**:

```bash
gunicorn wsgi:application --bind 0.0.0.0:$PORT --workers 4
```

⚠️ Railway utilise la variable `$PORT` automatiquement

---

## 🗃️ Étape 5: Initialiser la Base de Données

### 5.1 Première Initialisation

Après le premier déploiement, la base MySQL est vide. Vous devez créer les tables.

**Option A: Via Railway CLI (Recommandé)**

1. Installer Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Se connecter:
   ```bash
   railway login
   ```

3. Lier votre projet:
   ```bash
   railway link
   ```

4. Exécuter l'initialisation:
   ```bash
   railway run python init_db.py
   ```

**Option B: Depuis votre machine locale**

1. Créer un fichier `.env` local avec les variables Railway
2. Exécuter:
   ```bash
   python init_db.py
   ```

### 5.2 Vérifier l'Initialisation

Le script `init_db.py` va:
- ✅ Créer toutes les tables SQL
- ✅ Créer un admin par défaut (`admin@ecoholding.com` / `admin123`)
- ✅ Créer quelques demandes de test

⚠️ **IMPORTANT:** Changez le mot de passe admin immédiatement!

---

## 🧪 Étape 6: Tester la Connexion MySQL

### 6.1 Tester en Local AVANT de Déployer

**Fortement recommandé** pour éviter les erreurs:

1. Copier les variables Railway dans `.env` local:
   ```env
   FLASK_ENV=developpement
   DATABASE_URL=mysql+pymysql://root:abcd1234@containers-us-west-42.railway.app:6543/railway
   SECRET_KEY=votre-cle
   ```

2. Lancer en local:
   ```bash
   python run.py
   ```

3. Si ça fonctionne en local → ça fonctionnera sur Railway

### 6.2 Vérifier les Logs Railway

Dans Railway → Votre app → **Deployments** → **View Logs**

**Logs de succès:**
```
✅ Booting worker with pid: 123
✅ Listening at: http://0.0.0.0:8080
```

**Logs d'erreur:**
```
❌ ModuleNotFoundError: No module named 'pymysql'
   → Ajouter PyMySQL dans requirements.txt

❌ OperationalError: (2003, "Can't connect to MySQL")
   → DATABASE_URL incorrecte

❌ Access denied for user 'root'
   → Mauvais USER ou PASSWORD
```

---

## 🔍 Étape 7: Dépannage Railway

### Erreur: "No module named 'pymysql'"

**Cause:** PyMySQL absent de requirements.txt

**Solution:**
```bash
pip install PyMySQL
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add PyMySQL"
git push
```

### Erreur: "Can't connect to MySQL (2003)"

**Causes possibles:**
1. DATABASE_URL incorrecte
2. Mauvais HOST ou PORT
3. Service MySQL pas démarré

**Solutions:**
1. Vérifier que DATABASE_URL utilise `mysql+pymysql://` (pas `mysql://`)
2. Vérifier HOST et PORT dans Railway MySQL → Variables
3. Redémarrer le service MySQL

### Erreur: "Access denied for user"

**Cause:** Mauvais USER ou PASSWORD

**Solution:**
1. Railway MySQL → Variables
2. Copier exactement MYSQLUSER et MYSQLPASSWORD
3. Reconstruire DATABASE_URL

### Erreur: "Unknown database"

**Cause:** Mauvais nom de base de données

**Solution:**
1. Railway MySQL → Variables → MYSQLDATABASE
2. Utiliser exactement ce nom (généralement `railway`)

### Erreur: "NoneType DATABASE_URL"

**Cause:** Variable DATABASE_URL non définie dans Railway

**Solution:**
1. Railway → App → Variables
2. Ajouter DATABASE_URL
3. Redéployer

### App démarre mais erreurs 500

**Debug:**

1. Ajouter temporairement dans `wsgi.py`:
   ```python
   import os
   print("DATABASE_URL:", os.environ.get('DATABASE_URL'))
   print("FLASK_ENV:", os.environ.get('FLASK_ENV'))
   ```

2. Railway → Logs → Vérifier l'output

---

## 📊 Étape 8: Accéder à votre Application

### 8.1 URL Publique

Railway génère automatiquement une URL:

```
https://eco-holding-production.up.railway.app
```

Trouvez-la dans: Railway → App → **Settings** → **Domains**

### 8.2 Custom Domain (Optionnel)

1. Railway → Settings → **Domains**
2. **Add Custom Domain**
3. Entrez votre domaine: `www.ecoholding.com`
4. Configurez les DNS chez votre registrar

---

## 🔄 Étape 9: Mises à Jour

### Push vers Git = Redéploiement Automatique

```bash
git add .
git commit -m "Mise à jour"
git push
```

Railway détecte automatiquement et redéploie.

### Forcer un Redéploiement

Railway → Deployments → **⋮** → **Redeploy**

---

## 🛡️ Sécurité Production

### ✅ Checklist de Sécurité

- [ ] `SECRET_KEY` générée aléatoirement (64+ caractères)
- [ ] Mot de passe admin changé (pas `admin123`)
- [ ] `FLASK_ENV=production` (pas `developpement`)
- [ ] `.env` dans `.gitignore` (ne JAMAIS commit)
- [ ] Variables sensibles uniquement dans Railway Variables
- [ ] MySQL accessible uniquement depuis Railway (pas Internet)

### Changer le Mot de Passe Admin

```python
# Créer un script change_password.py
from app import creer_app
from models import db, UtilisateurAdmin

app = creer_app('production')
with app.app_context():
    admin = UtilisateurAdmin.query.filter_by(email='admin@ecoholding.com').first()
    admin.definir_mot_de_passe('nouveau_mot_de_passe_tres_fort')
    db.session.commit()
    print("✅ Mot de passe changé")
```

Exécuter via Railway CLI:
```bash
railway run python change_password.py
```

---

## 📈 Monitoring

### Logs en Temps Réel

```bash
railway logs
```

### Métriques

Railway Dashboard → App → **Metrics**:
- CPU
- Mémoire
- Bande passante
- Temps de réponse

---

## 💰 Pricing Railway

| Plan | Prix | Specs |
|------|------|-------|
| **Trial** | $5 gratuit | 512MB RAM, 1GB disque |
| **Developer** | $5/mois | 512MB RAM, 1GB disque |
| **Hobby** | $20/mois | 8GB RAM, 100GB disque |

**MySQL inclus** dans tous les plans.

---

## 📚 Ressources

- [Railway Docs](https://docs.railway.app/)
- [Railway MySQL Guide](https://docs.railway.app/databases/mysql)
- [PyMySQL Documentation](https://pymysql.readthedocs.io/)
- [Flask SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)

---

## ✅ Checklist Finale

- [ ] Repository Git à jour
- [ ] `requirements.txt` contient `PyMySQL` et `gunicorn`
- [ ] Projet Railway créé
- [ ] MySQL Railway ajouté
- [ ] Variables d'environnement configurées
- [ ] DATABASE_URL au format `mysql+pymysql://...`
- [ ] Base de données initialisée avec `init_db.py`
- [ ] Application déployée et accessible
- [ ] Logs Railway vérifiés (pas d'erreurs)
- [ ] Mot de passe admin changé
- [ ] Tests fonctionnels réussis

---

## 🆘 Support

**Problèmes Railway:**
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway GitHub: [github.com/railwayapp/railway](https://github.com/railwayapp/railway)

**Problèmes Application:**
- Vérifiez les logs Railway
- Consultez `DEPLOIEMENT.md` pour des solutions générales
- Testez en local d'abord avec les variables Railway

---

**✨ Votre application est maintenant en production sur Railway! ✨**
