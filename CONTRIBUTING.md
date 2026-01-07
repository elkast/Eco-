# Guide de Contribution - Eco+Holding

Merci de votre intérêt pour contribuer à Eco+Holding ! 🎉

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Standards de Code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler un Bug](#signaler-un-bug)
- [Proposer une Fonctionnalité](#proposer-une-fonctionnalité)

## 📜 Code de Conduite

Ce projet adhère à un code de conduite. En participant, vous acceptez de maintenir un environnement respectueux et professionnel.

## 🚀 Comment Contribuer

### Prérequis

- Python 3.10+
- Git
- Compte GitHub
- Connaissance de Flask

### Configuration de l'Environnement

```bash
# Fork le projet sur GitHub
# Clone votre fork
git clone https://github.com/VOTRE_USERNAME/eco-holding.git
cd eco-holding

# Ajouter le repo original comme remote
git remote add upstream https://github.com/ORIGINAL/eco-holding.git

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Installer les dépendances
pip install -r requirements.txt

# Installer les dépendances de développement
pip install pytest pytest-flask black flake8

# Initialiser la base de données
python init_db.py
```

### Workflow de Développement

1. **Créer une branche**
```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-du-bug
```

2. **Faire vos modifications**
   - Écrire du code propre et documenté
   - Ajouter des tests si applicable
   - Mettre à jour la documentation

3. **Tester vos modifications**
```bash
# Lancer les tests
pytest

# Vérifier le style de code
black --check .
flake8 .
```

4. **Committer vos changements**
```bash
git add .
git commit -m "feat: description de la fonctionnalité"
# ou
git commit -m "fix: description de la correction"
```

5. **Pousser vers votre fork**
```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

6. **Créer une Pull Request**
   - Aller sur GitHub
   - Cliquer sur "New Pull Request"
   - Décrire vos changements en détail

## 📐 Standards de Code

### Style Python

Nous suivons les conventions PEP 8 avec quelques ajustements:

- **Indentation**: 4 espaces
- **Longueur de ligne**: 100 caractères maximum
- **Imports**: Groupés et triés (stdlib, tiers, local)
- **Noms**: snake_case pour fonctions et variables
- **Classes**: PascalCase

```python
# Bon
def calculer_total_demandes(statut=None):
    """
    Calculer le nombre total de demandes
    
    Args:
        statut (str, optional): Filtrer par statut
        
    Returns:
        int: Nombre de demandes
    """
    query = DemandeClient.query
    if statut:
        query = query.filter_by(statut=statut)
    return query.count()

# Mauvais
def CalDem(s=None):  # Pas de docstring, noms cryptiques
    q=DemandeClient.query
    if s:q=q.filter_by(statut=s)
    return q.count()
```

### Style HTML/CSS

- **HTML**: Indentation 2 espaces, balises en minuscules
- **CSS**: Classes en kebab-case, propriétés triées logiquement
- **JavaScript**: Indentation 4 espaces, camelCase pour variables

### Conventions de Nommage

#### Fichiers
- `snake_case.py` pour Python
- `kebab-case.html` pour HTML
- `kebab-case.css` pour CSS
- `camelCase.js` pour JavaScript

#### Git Commits

Format: `type(scope): description`

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, pas de changement de code
- `refactor`: Refactoring du code
- `test`: Ajout de tests
- `chore`: Maintenance

**Exemples:**
```bash
feat(admin): ajouter export Excel des demandes
fix(formulaire): corriger validation email
docs(readme): mettre à jour instructions installation
```

## 🔍 Processus de Pull Request

### Checklist Avant Soumission

- [ ] Le code fonctionne localement
- [ ] Les tests passent
- [ ] Le code suit les standards
- [ ] La documentation est à jour
- [ ] Les commits sont propres
- [ ] Pas de conflits avec main

### Description de PR

Votre PR doit inclure:

1. **Titre clair**: `[Type] Description courte`
2. **Description détaillée**:
   - Quel problème résout-elle?
   - Comment le résout-elle?
   - Captures d'écran si applicable
3. **Tests effectués**
4. **Notes pour les reviewers**

### Exemple de PR Description

```markdown
## [Feature] Ajout export Excel des demandes

### Description
Permet aux administrateurs d'exporter les demandes au format Excel.

### Modifications
- Ajout de la route `/admin/export/excel`
- Nouvelle bibliothèque: openpyxl
- Bouton "Exporter" dans le dashboard

### Tests
- [x] Export avec toutes les demandes
- [x] Export avec filtres actifs
- [x] Vérification du format Excel

### Screenshots
![Export Button](screenshots/export-button.png)
```

### Processus de Review

1. Soumission de la PR
2. Review automatique (CI/CD si configuré)
3. Review par un mainteneur
4. Ajustements si nécessaire
5. Approbation et merge

## 🐛 Signaler un Bug

### Avant de Signaler

- Vérifiez qu'il n'existe pas déjà
- Testez avec la dernière version
- Isolez le problème

### Template de Bug Report

```markdown
## Description
[Description claire du bug]

## Étapes pour Reproduire
1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement Attendu
[Ce qui devrait se passer]

## Comportement Actuel
[Ce qui se passe réellement]

## Environnement
- OS: [Windows/Linux/Mac]
- Python: [version]
- Navigateur: [Chrome/Firefox/...]

## Captures d'écran
[Si applicable]

## Logs
```
[Logs d'erreur]
```
```

## 💡 Proposer une Fonctionnalité

### Template de Feature Request

```markdown
## Problème à Résoudre
[Quel problème cette fonctionnalité résout-elle?]

## Solution Proposée
[Comment voyez-vous cette fonctionnalité?]

## Alternatives Considérées
[Autres solutions envisagées]

## Bénéfices
- Bénéfice 1
- Bénéfice 2

## Complexité Estimée
[Facile / Moyen / Difficile]
```

## 🎯 Domaines de Contribution

### Facile (Good First Issue)
- Documentation
- Corrections de typos
- Amélioration messages d'erreur
- Tests unitaires

### Moyen
- Nouvelles fonctionnalités mineures
- Optimisations performance
- Refactoring code
- UI/UX améliorations

### Avancé
- Architecture système
- Sécurité
- Intégrations tierces
- Migrations complexes

## 📚 Ressources

- [Documentation Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PEP 8 Style Guide](https://pep8.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)

## 💬 Questions?

- 📧 Email: ecoholding192@gmail.com
- 💬 Issues GitHub pour questions techniques

---

Merci de contribuer à Eco+Holding! 🙏