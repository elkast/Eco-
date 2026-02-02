from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session,
    jsonify,
)
from models import db, DemandeClient, UtilisateurAdmin
from forms import FormulaireConnexionAdmin, FormulaireModificationStatut
from urllib.parse import quote
from datetime import datetime
from utils import envoyer_message_client

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.route("/")
def connexion_admin():
    """Page de connexion administrateur"""
    if "admin_id" in session:
        return redirect(url_for("admin.tableau_de_bord_admin"))
    form = FormulaireConnexionAdmin()
    return render_template("admin/connexion.html", form=form)


@admin_bp.route("/connexion", methods=["POST"])
def traiter_connexion_admin():
    """Traiter la connexion administrateur"""
    formulaire = FormulaireConnexionAdmin()

    if formulaire.validate_on_submit():
        admin = UtilisateurAdmin.query.filter_by(email=formulaire.email.data).first()
        if admin and admin.verifier_mot_de_passe(formulaire.mot_de_passe.data):
            session["admin_id"] = admin.id
            session["admin_nom"] = admin.nom
            flash("Connexion réussie!", "success")
            return redirect(url_for("admin.tableau_de_bord_admin"))

    flash("Email ou mot de passe incorrect.", "error")
    return redirect(url_for("admin.connexion_admin"))


@admin_bp.route("/deconnexion")
def deconnexion_admin():
    """Déconnexion administrateur"""
    session.clear()
    flash("Déconnexion réussie.", "info")
    return redirect(url_for("admin.connexion_admin"))


@admin_bp.route("/tableau-de-bord")
def tableau_de_bord_admin():
    """Tableau de bord administrateur"""
    if "admin_id" not in session:
        return redirect(url_for("admin.connexion_admin"))

    # Statistiques
    total_demandes = DemandeClient.query.count()
    nouvelles_demandes = DemandeClient.query.filter_by(statut="nouveau").count()
    en_cours = DemandeClient.query.filter_by(statut="en_cours").count()
    traitees = DemandeClient.query.filter_by(statut="traite").count()

    # Demandes récentes
    demandes_recentes = (
        DemandeClient.query.order_by(DemandeClient.date_creation.desc()).limit(5).all()
    )

    return render_template(
        "admin/tableau_de_bord.html",
        total_demandes=total_demandes,
        nouvelles_demandes=nouvelles_demandes,
        en_cours=en_cours,
        traitees=traitees,
        demandes_recentes=demandes_recentes,
    )


@admin_bp.route("/demandes")
def liste_demandes_admin():
    """Liste des demandes administrateur"""
    if "admin_id" not in session:
        return redirect(url_for("admin.connexion_admin"))

    page = request.args.get("page", 1, type=int)
    statut_filtre = request.args.get("statut", "")
    service_filtre = request.args.get("service", "")

    query = DemandeClient.query

    if statut_filtre:
        query = query.filter_by(statut=statut_filtre)
    if service_filtre:
        query = query.filter_by(service=service_filtre)

    demandes = query.order_by(DemandeClient.date_creation.desc()).paginate(
        page=page, per_page=20, error_out=False
    )

    return render_template(
        "admin/demandes.html",
        demandes=demandes,
        statut_filtre=statut_filtre,
        service_filtre=service_filtre,
    )


@admin_bp.route("/demande/<int:demande_id>", methods=["GET", "POST"])
def detail_demande_admin(demande_id):
    """Détail et modification d'une demande"""
    if "admin_id" not in session:
        return redirect(url_for("admin.connexion_admin"))

    demande = DemandeClient.query.get_or_404(demande_id)
    formulaire = FormulaireModificationStatut()

    if formulaire.validate_on_submit():
        demande.statut = formulaire.statut.data
        if formulaire.notes_admin.data:
            demande.notes_admin = formulaire.notes_admin.data
        demande.traite_par = session["admin_id"]

        db.session.commit()
        flash("Demande mise à jour avec succès!", "success")
        return redirect(url_for("admin.detail_demande_admin", demande_id=demande_id))

    # Pré-remplir le formulaire
    formulaire.statut.data = demande.statut
    formulaire.notes_admin.data = demande.notes_admin

    # Préparer un message WhatsApp par défaut
    tel_digits = "".join(filter(str.isdigit, demande.telephone or ""))
    if tel_digits and not tel_digits.startswith("225"):
        # Ajout simple de l'indicatif Côte d'Ivoire si manquant
        tel_digits = "225" + tel_digits
    message_defaut = (
        f"Bonjour {demande.nom}, suite à votre demande du "
        f"{demande.date_creation.strftime('%d/%m/%Y')} concernant '{demande.service}', "
        f"nous vous contactons pour vous apporter des précisions."
    )
    whatsapp_url = f"https://wa.me/{tel_digits}?text={quote(message_defaut)}" if tel_digits else None

    return render_template(
        "admin/detail_demande.html", demande=demande, formulaire=formulaire, whatsapp_url=whatsapp_url
    )


@admin_bp.route("/demande/<int:demande_id>/contacter", methods=["POST"])
def contacter_client(demande_id):
    if "admin_id" not in session:
        return redirect(url_for("admin.connexion_admin"))

    demande = DemandeClient.query.get_or_404(demande_id)
    sujet = request.form.get("sujet", "").strip()
    message = request.form.get("message", "").strip()

    if not message:
        flash("Le message est requis.", "error")
        return redirect(url_for("admin.detail_demande_admin", demande_id=demande_id))

    message_html = f"""
    <p>Bonjour {demande.nom},</p>
    <p>{message}</p>
    <hr/>
    <p><small>Réf. Demande #{demande.id} - {demande.service} - {demande.date_creation.strftime('%d/%m/%Y à %H:%M')}</small></p>
    """

    ok = envoyer_message_client(demande.email, sujet or f"Suite à votre demande #{demande.id}", message_html, message)

    if ok:
        # Journaliser dans les notes (option simple)
        notes = demande.notes_admin or ""
        horodatage = datetime.now().strftime("%d/%m/%Y %H:%M")
        journal = f"\n[{horodatage}] Email envoyé au client: {sujet or 'Sans sujet'}"
        demande.notes_admin = (notes + journal).strip()
        db.session.commit()
        flash("Message email envoyé avec succès.", "success")
    else:
        flash("Échec de l'envoi de l'email. Vérifiez la configuration mail.", "error")

    return redirect(url_for("admin.detail_demande_admin", demande_id=demande_id))
