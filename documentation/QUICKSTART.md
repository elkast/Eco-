# 🚀 Quick Start - Eco+Holding

## Démarrage Rapide (5 minutes)

### Windows

```powershell
# 1. Lancer le script de démarrage
.\start_dev.ps1

# Ou manuellement:
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python run.py
```

### Linux / Mac

```bash
# 1. Rendre le script exécutable (une seule fois)
chmod +x start_dev.sh

# 2. Lancer le script
./start_dev.sh

# Ou manuellement:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python init_db.py
python run.py
```

## 🌐 Accès

- **Site public**: http://localhost:5000
- **Admin**: http://localhost:5000/admin/connexion

**Compte admin par défaut:**
- Email: `admin@ecoholding.com`
- Mot de passe: `admin123`

⚠️ **IMPORTANT**: Changez ce mot de passe immédiatement !

## 🎯 Premiers Pas

### 1. Tester le Formulaire de Rendez-vous

1. Aller sur http://localhost:5000
2. Cliquer sur "Prendre RDV"
3. Remplir le formulaire
4. Vérifier dans l'interface admin

### 2. Explorer l'Interface Admin

1. Se connecter: http://localhost:5000/admin/connexion
2. Voir le dashboard avec statistiques
3. Gérer les demandes
4. Changer les statuts

### 3. Générer des Données de Test

```bash
# Générer 20 demandes avec des noms ivoiriens
python seed_data.py 20

# Nettoyer les données de test
python seed_data.py --clean
```

## 🔧 Commandes Utiles

```bash
# Vérifier l'installation
python test_installation.py

# Initialiser/Réinitialiser la base
python init_db.py
python init_db.py --reset  # ⚠️ Supprime toutes les données

# Lancer l'application
python run.py

# Créer une migration (après modification des modèles)
flask db migrate -m "Description"
flask db upgrade
```

## 📧 Configuration Email (Optionnel)

Pour activer l'envoi d'emails:

1. Modifier `.env`:
```env
MAIL_USERNAME=votre.email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe_application
```

2. Installer Redis (pour Celery):
```bash
# Windows: Télécharger depuis https://github.com/microsoftarchive/redis/releases
# Linux:
sudo apt install redis-server

# Mac:
brew install redis
```

3. Lancer Celery:
```bash
# Terminal 1: Worker
celery -A celery_app:creer_celery_app worker --loglevel=info

# Terminal 2: Beat (tâches planifiées)
celery -A celery_app:creer_celery_app beat --loglevel=info
```

## 🐛 Dépannage

### Erreur "Module not found"
```bash
pip install -r requirements.txt
```

### Erreur "Table doesn't exist"
```bash
python init_db.py
```

### Port 5000 déjà utilisé
Modifier dans `run.py`:
```python
port=5001  # ou autre port
```

### L'application ne démarre pas
```bash
# Vérifier l'installation
python test_installation.py

# Voir les logs d'erreur
python run.py
```

## 📚 Documentation Complète

- [README.md](README.md) - Documentation générale
- [DEPLOIEMENT.md](DEPLOIEMENT.md) - Guide de déploiement production
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [TODO.md](TODO.md) - Roadmap et tâches

## 💡 Conseils

1. **Développement**: Toujours travailler dans l'environnement virtuel
2. **Base de données**: Sauvegarder régulièrement `eco_holding.db`
3. **Sécurité**: Ne jamais commiter `.env`
4. **Tests**: Utiliser `seed_data.py` pour générer des données
5. **Production**: Suivre le guide [DEPLOIEMENT.md](DEPLOIEMENT.md)

## 🎨 Personnalisation

### Modifier les Couleurs

Éditer `static/css/styles.css` et `static/css/admin.css`:
```css
:root {
    --couleur-primaire: #1E3A8A;  /* Bleu principal */
    --couleur-accent: #D4AF37;     /* Or accent */
    /* ... */
}
```

### Ajouter un Service

1. Modifier `forms.py`:
```python
choices=[
    ('finance', 'Eco+Holding Finance'),
    ('nouveau_service', 'Nouveau Service'),
]
```

2. Mettre à jour les templates et JavaScript

## 📞 Support

- Email: ecoholding192@gmail.com
- Issues GitHub: [Créer une issue](../../issues)

---

**Prêt à commencer ?** Lancez `python run.py` et visitez http://localhost:5000 ! 🎉