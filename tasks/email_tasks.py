"""
Tâches asynchrones pour l'envoi d'emails
Utilise Celery pour ne pas bloquer les requêtes HTTP
"""
from celery import shared_task
from flask import render_template
from flask_mailman import EmailMessage
from models import db, DemandeClient
from datetime import datetime, timedelta
from sqlalchemy import and_


@shared_task(name='tasks.email_tasks.envoyer_email_confirmation_demande')
def envoyer_email_confirmation_demande(demande_id):
    """
    Envoyer un email de confirmation au client après sa demande
    Tâche asynchrone pour ne pas bloquer la requête
    """
    try:
        demande = DemandeClient.query.get(demande_id)
        if not demande:
            return {'success': False, 'message': 'Demande introuvable'}
        
        # Créer l'email
        email = EmailMessage(
            subject='Confirmation de votre demande - Eco+Holding',
            body=f"""
Bonjour {demande.nom},

Nous avons bien reçu votre demande de rendez-vous pour le service {demande.service}.

Détails de votre demande:
- Service: {demande.service}
- Date souhaitée: {demande.date_souhaitee.strftime('%d/%m/%Y')}
- Téléphone: {demande.telephone}

Notre équipe vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.

Cordialement,
L'équipe Eco+Holding
            """,
            from_email='ecoholding192@gmail.com',
            to=[demande.email]
        )
        
        email.send()
        
        # Mettre à jour la demande
        demande.email_confirmation_envoye = True
        demande.dernier_email_envoye = datetime.utcnow()
        db.session.commit()
        
        return {'success': True, 'message': 'Email envoyé avec succès'}
        
    except Exception as e:
        print(f"Erreur envoi email: {str(e)}")
        return {'success': False, 'message': str(e)}


@shared_task(name='tasks.email_tasks.envoyer_notification_admin')
def envoyer_notification_admin(demande_id):
    """
    Notifier les administrateurs d'une nouvelle demande
    """
    try:
        demande = DemandeClient.query.get(demande_id)
        if not demande:
            return {'success': False, 'message': 'Demande introuvable'}
        
        email = EmailMessage(
            subject=f'Nouvelle demande - {demande.nom}',
            body=f"""
Nouvelle demande de rendez-vous reçue:

Nom: {demande.nom} {demande.prenom or ''}
Email: {demande.email}
Téléphone: {demande.telephone}
Service: {demande.service}
Date souhaitée: {demande.date_souhaitee.strftime('%d/%m/%Y')}
Message: {demande.message or 'Aucun message'}

Connectez-vous au tableau de bord pour traiter cette demande.
            """,
            from_email='ecoholding192@gmail.com',
            to=['ecoholding192@gmail.com']
        )
        
        email.send()
        
        return {'success': True, 'message': 'Notification envoyée'}
        
    except Exception as e:
        print(f"Erreur notification admin: {str(e)}")
        return {'success': False, 'message': str(e)}


@shared_task(name='tasks.email_tasks.relancer_demandes_non_traitees')
def relancer_demandes_non_traitees():
    """
    Tâche périodique pour relancer les demandes non traitées après 48h
    À exécuter via Celery Beat (planificateur)
    """
    try:
        # Rechercher les demandes non traitées depuis plus de 48h
        limite_date = datetime.utcnow() - timedelta(hours=48)
        
        demandes_a_relancer = DemandeClient.query.filter(
            and_(
                DemandeClient.statut == 'nouveau',
                DemandeClient.date_creation < limite_date,
                DemandeClient.nombre_relances < 2  # Max 2 relances
            )
        ).all()
        
        compteur = 0
        for demande in demandes_a_relancer:
            try:
                email = EmailMessage(
                    subject='Rappel - Votre demande chez Eco+Holding',
                    body=f"""
Bonjour {demande.nom},

Nous avons bien reçu votre demande de rendez-vous et nous nous excusons du délai.

Notre équipe vous contactera très prochainement pour finaliser votre rendez-vous.

Cordialement,
L'équipe Eco+Holding
                    """,
                    from_email='ecoholding192@gmail.com',
                    to=[demande.email]
                )
                
                email.send()
                
                # Mettre à jour
                demande.nombre_relances += 1
                demande.dernier_email_envoye = datetime.utcnow()
                compteur += 1
                
            except Exception as e:
                print(f"Erreur relance demande {demande.id}: {str(e)}")
                continue
        
        db.session.commit()
        
        return {'success': True, 'relances_envoyees': compteur}
        
    except Exception as e:
        print(f"Erreur tâche relance: {str(e)}")
        return {'success': False, 'message': str(e)}