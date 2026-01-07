# 📊 Base de Données Eco+Holding - Guide Complet

## 🎯 Vue d'ensemble

Base de données MySQL pour l'application Eco+Holding, un système de gestion de demandes de rendez-vous et d'administration.

## 📋 Tables

### 1. `utilisateurs_admin`
Gestion des comptes administrateurs avec authentification sécurisée.

**Colonnes:**
- `id` (INT, PRIMARY KEY) - Identifiant unique
- `email` (VARCHAR(120), UNIQUE) - Email de connexion
- `nom` (VARCHAR(100)) - Nom de famille
- `prenom` (VARCHAR(100)) - Prénom
- `mot_de_passe_hash` (VARCHAR(255)) - Mot de passe hashé (pbkdf2:sha256)
- `role` (VARCHAR(20)) - Rôle: 'admin' ou 'super_admin'
- `actif` (BOOLEAN) - Compte actif ou non
- `date_creation` (DATETIME) - Date de création du compte
- `derniere_connexion` (DATETIME) - Date de dernière connexion

### 2. `demandes_clients`
Demandes de rendez-vous soumises par les clients via le formulaire.

**Colonnes:**
- `id` (INT, PRIMARY KEY) - Identifiant unique
- `nom` (VARCHAR(100)) - Nom du client
- `prenom` (VARCHAR(100)) - Prénom du client
- `email` (VARCHAR(120)) - Email de contact
- `telephone` (VARCHAR(25)) - Numéro de téléphone (international supporté)
- `service` (VARCHAR(50)) - Service demandé
- `date_souhaitee` (DATE) - Date de rendez-vous souhaitée
- `message` (TEXT) - Message optionnel
- `statut` (VARCHAR(20)) - Statut: 'nouveau', 'en_cours', 'traite', 'annule'
- `date_creation` (DATETIME) - Date de soumission
- `date_modification` (DATETIME) - Dernière modification
- `dernier_email_envoye` (DATETIME) - Date du dernier email
- `nombre_relances` (INT) - Nombre de relances effectuées
- `email_confirmation_envoye` (BOOLEAN) - Email de confirmation envoyé
- `notes_admin` (TEXT) - Notes de l'administrateur
- `traite_par` (INT, FK) - ID de l'admin qui traite la demande

## 🔍 Vues Créées

### `v_statistiques_globales`
Statistiques en temps réel pour le dashboard:
- Total de demandes
- Nouveaux, en cours, traités, annulés
- Nouvelles demandes aujourd'hui
- Total clients accompagnés

### `v_demandes_recentes`
Les 50 dernières demandes avec informations essentielles.

### `v_statistiques_par_service`
Statistiques regroupées par service.

## ⚙️ Procédures Stockées

### `sp_get_dashboard_stats()`
Retourne les statistiques du dashboard.

```sql
CALL sp_get_dashboard_stats();
```

### `sp_clean_old_cancelled(jours INT)`
Nettoie les demandes annulées anciennes.

```sql
CALL sp_clean_old_cancelled(90); -- Supprimer annulées de plus de 90 jours
```

### `sp_mark_expired_as_cancelled(jours INT)`
Marque les demandes expirées comme annulées.

```sql
CALL sp_mark_expired_as_cancelled(30); -- Annuler non traitées après 30 jours
```

## 🔐 Installation

### 1. Importer le schéma

```bash
# Option 1: Depuis MySQL CLI
mysql -u root -p < database_schema.sql

# Option 2: Depuis MySQL Workbench
# Fichier > Exécuter le script SQL > database_schema.sql
```

### 2. Créer l'utilisateur

L'utilisateur `eco_user` est créé automatiquement avec le schéma.

**Par défaut:**
- Utilisateur: `eco_user`
- Mot de passe: `VotreMotDePasseSecurise2026!`

⚠️ **IMPORTANT:** Changez le mot de passe en production!

```sql
ALTER USER 'eco_user'@'localhost' IDENTIFIED BY 'NouveauMotDePasseTresSecurise!';
```

### 3. Configuration de l'application

Créez/modifiez le fichier `.env`:

```env
# Base de données
DB_USER=eco_user
DB_PASSWORD=VotreMotDePasseSecurise2026!
DB_HOST=localhost
DB_NAME=eco_holding

# URL complète
DATABASE_URL=mysql+pymysql://eco_user:VotreMotDePasseSecurise2026!@localhost/eco_holding
```

## 📊 Données de Test

Le schéma inclut automatiquement:
- 1 administrateur par défaut
- 5 demandes clients exemples

**Compte admin par défaut:**
- Email: `admin@ecoholding.com`
- Mot de passe: `admin123`

⚠️ **IMPORTANT:** Changez ce mot de passe immédiatement en production!

## 🔄 Migration depuis SQLite

Si vous utilisez actuellement SQLite et voulez migrer vers MySQL:

```bash
# 1. Exporter les données SQLite
sqlite3 eco_holding.db .dump > backup.sql

# 2. Créer le schéma MySQL
mysql -u root -p < database_schema.sql

# 3. Adapter et importer les données
# (Nécessite adaptation manuelle du fichier backup.sql)
```

## 📈 Optimisations

### Index créés
- `idx_email` sur utilisateurs_admin.email
- `idx_statut` sur demandes_clients.statut
- `idx_service` sur demandes_clients.service
- `idx_date_creation` sur demandes_clients.date_creation
- `idx_statut_date` (composite)
- `idx_service_statut` (composite)

### Triggers de validation
- Validation format email
- Validation longueur téléphone

## 🛠️ Maintenance

### Sauvegarde quotidienne

```bash
# Créer un backup
mysqldump -u eco_user -p eco_holding > backup_$(date +%Y%m%d).sql

# Avec compression
mysqldump -u eco_user -p eco_holding | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restauration

```bash
mysql -u eco_user -p eco_holding < backup_20260107.sql
```

### Nettoyage automatique

Configurez un cron job pour le nettoyage:

```bash
# Ajouter au crontab (crontab -e)
# Nettoyer les annulées de plus de 90 jours chaque dimanche à 2h
0 2 * * 0 mysql -u eco_user -p'password' eco_holding -e "CALL sp_clean_old_cancelled(90);"
```

## 📞 Support

Pour toute question sur la base de données:
- Email: ecoholding192@gmail.com
- Documentation: Voir ce fichier

## 🔒 Sécurité

- ✅ Mots de passe hashés avec pbkdf2:sha256
- ✅ Validation des données par triggers
- ✅ Utilisateur avec permissions minimales
- ✅ Index pour performances optimales
- ⚠️ Changez TOUS les mots de passe par défaut en production