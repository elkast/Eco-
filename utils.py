from flask import current_app
from flask_mail import Mail, Message
from models import DemandeClient

mail = Mail()


def envoyer_notification_admin(demande):
    """Envoyer une notification par email à l'administrateur"""
    try:
        msg = Message(
            subject=f"Nouvelle demande de service - {demande.service}",
            sender=current_app.config["MAIL_USERNAME"],
            recipients=[current_app.config["ADMIN_EMAIL"]],
        )

        # Construire le contenu HTML avec gestion conditionnelle du message
        message_html = ""
        if demande.message:
            message_html = f"""
        <h3>Message:</h3>
        <p>{demande.message}</p>
            """

        msg.html = f"""
        <h2>Nouvelle demande de service reçue</h2>

        <h3>Informations client:</h3>
        <p><strong>Nom:</strong> {demande.nom} {demande.prenom}</p>
        <p><strong>Email:</strong> {demande.email}</p>
        <p><strong>Téléphone:</strong> {demande.telephone}</p>
        <p><strong>Service demandé:</strong> {demande.service}</p>
        <p><strong>Date souhaitée:</strong> {demande.date_souhaitee.strftime('%d/%m/%Y')}</p>
        {message_html}
        <p><em>Cette demande a été soumise le {demande.date_creation.strftime('%d/%m/%Y à %H:%M')}</em></p>

        <p>Connectez-vous à l'interface d'administration pour gérer cette demande.</p>
        """

        mail.send(msg)
        current_app.logger.info(
            f"Notification email envoyée pour la demande #{demande.id}"
        )

    except Exception as e:
        current_app.logger.error(f"Erreur lors de l'envoi de l'email: {str(e)}")


def envoyer_message_client(email_to: str, sujet: str, message_html: str, message_texte: str | None = None) -> bool:
    """Envoyer un message au client par email (Flask-Mail).
    Retourne True si l'envoi a réussi, False sinon.
    """
    try:
        if not email_to:
            raise ValueError("Adresse email du destinataire manquante")

        sujet_final = sujet.strip() if sujet else "Message de ECO+HOLDING"
        msg = Message(
            subject=sujet_final,
            sender=current_app.config.get("MAIL_USERNAME"),
            recipients=[email_to],
        )
        if message_texte:
            msg.body = message_texte
        msg.html = message_html or ""

        mail.send(msg)
        current_app.logger.info(f"Email envoyé au client {email_to} - Sujet: {sujet_final}")
        return True
    except Exception as e:
        current_app.logger.error(f"Erreur envoi email client {email_to}: {str(e)}")
        return False
