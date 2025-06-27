// Module Formulaire Contact
const FormulaireContact = {
    formulaire: null,

    init() {
        this.formulaire = document.getElementById('contactForm');
        if (this.formulaire) {
            this.lierEvenements();
        }
    },

    lierEvenements() {
        this.formulaire.addEventListener('submit', (e) => this.gererSoumission(e));
    },

    async gererSoumission(e) {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const donneesFormulaire = new FormData(this.formulaire);
        const donnees = Object.fromEntries(donneesFormulaire);
        
        // Afficher l'état de chargement
        const boutonSoumettre = this.formulaire.querySelector('.submit-btn');
        const texteOriginal = boutonSoumettre.innerHTML;
        boutonSoumettre.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        boutonSoumettre.disabled = true;
        
        try {
            // Envoyer les données au backend PHP
            const reponse = await fetch('contact-handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donnees)
            });

            const resultat = await reponse.json();

            if (reponse.ok && resultat.success) {
                // Réinitialiser le formulaire
                this.formulaire.reset();
                
                // Afficher message de succès
                boutonSoumettre.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                boutonSoumettre.style.background = '#28a745';
                
                // Afficher alerte de succès
                alert('Merci pour votre message ! Nous vous recontacterons très prochainement.');
            } else {
                throw new Error(resultat.error || 'Erreur lors de l\'envoi');
            }
        } catch (erreur) {
            console.error('Erreur soumission formulaire:', erreur);
            boutonSoumettre.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
            boutonSoumettre.style.background = '#dc3545';
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
        
        // Réinitialiser le bouton après 3 secondes
        setTimeout(() => {
            boutonSoumettre.innerHTML = texteOriginal;
            boutonSoumettre.style.background = '';
            boutonSoumettre.disabled = false;
        }, 3000);
    }
};

// Fonctions utilitaires globales
window.scrollToContact = function() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};

window.openQuoteForm = function() {
    // Pré-sélectionner l'option "Devis gratuit" dans le formulaire de contact
    const selectService = document.getElementById('service');
    if (selectService) {
        // Ajouter option devis si elle n'existe pas
        const optionDevis = Array.from(selectService.options).find(option => option.value === 'devis');
        if (!optionDevis) {
            const nouvelleOption = document.createElement('option');
            nouvelleOption.value = 'devis';
            nouvelleOption.textContent = 'Demande de devis gratuit';
            selectService.appendChild(nouvelleOption);
        }
        selectService.value = 'devis';
    }
    scrollToContact();
};