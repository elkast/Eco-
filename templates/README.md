# Structure Modulaire des Templates - Eco+Holding

## Organisation des Fichiers

```
templates/
├── layouts/
│   └── base.html              # Layout de base (navigation, footer, scripts)
│
├── components/
│   ├── navigation.html        # Barre de navigation
│   ├── footer.html            # Pied de page
│   └── back_to_top.html       # Bouton retour en haut
│
├── sections/
│   ├── hero.html              # Section héro d'accueil
│   ├── about.html             # Section à propos
│   ├── departments.html       # Section départements
│   ├── cta.html               # Section call-to-action
│   └── appointment_form.html  # Formulaire de rendez-vous
│
├── admin/
│   ├── connexion.html         # Page de connexion admin
│   └── tableau_de_bord.html   # Dashboard admin
│
├── index.html                 # Page d'accueil (assemble tous les composants)
├── 404.html                   # Page erreur 404
├── 500.html                   # Page erreur 500
├── CGU.html                   # Conditions générales
├── Mentions légales.html      # Mentions légales
├── Plan du site.html          # Plan du site
└── Politique de confidentialité.html  # Politique de confidentialité
```

## Utilisation

### 1. Layout de Base (base.html)
Le fichier `layouts/base.html` contient la structure HTML de base :
- Head avec meta tags, fonts, CSS
- Inclusion de la navigation
- Block content (à remplir par les pages)
- Inclusion du footer
- Scripts JS

### 2. Composants Réutilisables
Les composants dans `components/` sont des éléments réutilisables :
- `navigation.html` : Menu de navigation
- `footer.html` : Pied de page avec liens et contacts
- `back_to_top.html` : Bouton de retour en haut

### 3. Sections de Page
Les sections dans `sections/` sont des blocs de contenu modulaires :
- `hero.html` : Bannière d'accueil avec CTA
- `about.html` : Présentation du cabinet
- `departments.html` : Les 3 pôles d'activité
- `cta.html` : Call-to-action pour conversion
- `appointment_form.html` : Formulaire de prise de rendez-vous

### 4. Exemple d'Utilisation dans index.html

```jinja
{% extends "layouts/base.html" %}

{% block content %}
    {% include 'sections/hero.html' %}
    {% include 'sections/about.html' %}
    {% include 'sections/departments.html' %}
    {% include 'sections/cta.html' %}
{% endblock %}
```

## Avantages de cette Structure

1. **Modularité** : Chaque composant est indépendant et réutilisable
2. **Maintenabilité** : Modifications isolées sans affecter le reste
3. **Réutilisabilité** : Les composants peuvent être utilisés sur plusieurs pages
4. **Organisation** : Structure claire et logique
5. **Collaboration** : Plusieurs développeurs peuvent travailler simultanément

## Modification d'un Composant

Pour modifier un élément :
1. Localisez le fichier approprié (component ou section)
2. Modifiez uniquement ce fichier
3. Les changements s'appliquent automatiquement partout où il est inclus

## Ajout d'une Nouvelle Page

1. Créer un nouveau fichier dans `templates/`
2. Étendre le layout de base : `{% extends "layouts/base.html" %}`
3. Inclure les sections nécessaires
4. Ajouter la route dans `run.py`

Exemple :
```python
@app.route('/nouvelle-page')
def nouvelle_page():
    return render_template('nouvelle_page.html')
```