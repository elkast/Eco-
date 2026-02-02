from flask import Blueprint, render_template, request, jsonify
from models import db, DemandeClient
from forms import FormulaireDemandeClient
from utils import envoyer_notification_admin

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def accueil():
    """Page d'accueil"""
    return render_template("index.html")


# Pages d'information
@main_bp.route("/presentation")
def presentation():
    return render_template("presentation.html")


@main_bp.route("/services")
def services():
    return render_template("services.html")


@main_bp.route("/prestige-immobilier")
def prestige_immobilier():
    return render_template("prestige_immobilier.html")


@main_bp.route("/translogistique")
def translogistique():
    return render_template("translogistique.html")


@main_bp.route("/vision-valeurs")
def vision_valeurs():
    return render_template("vision_valeurs.html")


@main_bp.route("/equipe")
def equipe():
    return render_template("equipe.html")


@main_bp.route("/demande", methods=["POST"])
def soumettre_demande():
    """Traiter la soumission du formulaire de demande"""
    formulaire = FormulaireDemandeClient()

    if formulaire.validate_on_submit():
        try:
            # Créer une nouvelle demande
            demande = DemandeClient(
                nom=formulaire.nom.data,
                prenom=formulaire.prenom.data,
                email=formulaire.email.data,
                telephone=formulaire.telephone.data,
                service=formulaire.service.data,
                date_souhaitee=formulaire.date_souhaitee.data,
                message=formulaire.message.data,
                statut=DemandeClient.STATUT_NOUVEAU,
            )

            db.session.add(demande)
            db.session.commit()

            # Envoyer notification par email
            envoyer_notification_admin(demande)

            return jsonify(
                {
                    "success": True,
                    "message": "Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.",
                }
            )

        except Exception as e:
            db.session.rollback()
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Une erreur s'est produite. Veuillez réessayer.",
                    }
                ),
                500,
            )

    # En cas d'erreurs de validation
    erreurs = {champ: erreurs[0] for champ, erreurs in formulaire.errors.items()}

    return jsonify({"success": False, "errors": erreurs}), 400
