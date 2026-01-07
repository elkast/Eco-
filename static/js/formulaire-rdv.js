/**
 * Gestion du formulaire de rendez-vous
 * Envoi asynchrone avec validation et feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Créer et injecter le formulaire modal
    creerModalFormulaire();
    
    // Gérer tous les boutons "Prendre RDV"
    const boutonsRdv = document.querySelectorAll('a[href="#contact"], a[href="#"]');
    boutonsRdv.forEach(bouton => {
        if (bouton.textContent.includes('Prendre RDV') || bouton.textContent.includes('Nous Contacter')) {
            bouton.addEventListener('click', function(e) {
                e.preventDefault();
                ouvrirModalFormulaire();
            });
        }
    });
});

function creerModalFormulaire() {
    const modalHTML = `
        <div class="modal-rdv" id="modal-rdv">
            <div class="modal-rdv-contenu">
                <div class="modal-rdv-header">
                    <h2>Prendre rendez-vous</h2>
                    <button class="modal-rdv-fermer" id="btn-fermer-rdv">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-rdv-corps">
                    <p style="color: var(--couleur-texte-clair); margin-bottom: 1.5rem;">
                        Remplissez le formulaire et nous vous contacterons dans les plus brefs délais
                    </p>
                    
                    <form id="formulaire-rdv">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="nom">
                                    <i class="fas fa-user"></i>
                                    Nom complet *
                                </label>
                                <input type="text" id="nom" name="nom" required placeholder="Votre nom">
                            </div>
                            
                            <div class="form-group">
                                <label for="prenom">
                                    <i class="fas fa-user"></i>
                                    Prénom
                                </label>
                                <input type="text" id="prenom" name="prenom" placeholder="Votre prénom">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="email">
                                    <i class="fas fa-envelope"></i>
                                    Email *
                                </label>
                                <input type="email" id="email" name="email" required placeholder="votre.email@exemple.com">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group" style="flex: 0 0 150px;">
                                <label for="indicatif">
                                    <i class="fas fa-flag"></i>
                                    Pays *
                                </label>
                                <select id="indicatif" name="indicatif" required style="padding-right: 0.5rem;">
                                    <option value="+225">🇨🇮 +225</option>
                                    <option value="+33">🇫🇷 +33</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+237">🇨🇲 +237</option>
                                    <option value="+221">🇸🇳 +221</option>
                                    <option value="+229">🇧🇯 +229</option>
                                    <option value="+226">🇧🇫 +226</option>
                                    <option value="+228">🇹🇬 +228</option>
                                    <option value="+223">🇲🇱 +223</option>
                                    <option value="+224">🇬🇳 +224</option>
                                    <option value="+212">🇲🇦 +212</option>
                                    <option value="+213">🇩🇿 +213</option>
                                    <option value="+216">🇹🇳 +216</option>
                                    <option value="+234">🇳🇬 +234</option>
                                    <option value="+233">🇬🇭 +233</option>
                                    <option value="+27">🇿🇦 +27</option>
                                    <option value="+254">🇰🇪 +254</option>
                                    <option value="+32">🇧🇪 +32</option>
                                    <option value="+41">🇨🇭 +41</option>
                                    <option value="+49">🇩🇪 +49</option>
                                    <option value="+39">🇮🇹 +39</option>
                                    <option value="+34">🇪🇸 +34</option>
                                </select>
                            </div>
                            
                            <div class="form-group" style="flex: 1;">
                                <label for="telephone">
                                    <i class="fas fa-phone"></i>
                                    Téléphone *
                                </label>
                                <input type="tel" id="telephone" name="telephone" required placeholder="XX XX XX XX XX" pattern="[0-9\s]{8,15}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="service">
                                    <i class="fas fa-briefcase"></i>
                                    Service *
                                </label>
                                <select id="service" name="service" required>
                                    <option value="">Sélectionnez un service...</option>
                                    <option value="gestion_affaires">ECO+HOLDING - Gestion d'Affaires</option>
                                    <option value="prestige_immobilier">PRESTIGE IMMOBILIER - Gestion Immobilière</option>
                                    <option value="logistique">ECO+TRANS-LOGISTIQUE - Transport et Logistique</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="date_souhaitee">
                                    <i class="fas fa-calendar"></i>
                                    Date souhaitée *
                                </label>
                                <input type="date" id="date_souhaitee" name="date_souhaitee" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">
                                <i class="fas fa-comment-dots"></i>
                                Message (optionnel)
                            </label>
                            <textarea id="message" name="message" rows="4" placeholder="Décrivez brièvement votre besoin..."></textarea>
                        </div>
                        
                        <div class="message-formulaire" id="message-formulaire" style="display: none;"></div>
                        
                        <button type="submit" class="btn btn-primaire btn-submit-rdv">
                            <span class="texte-bouton">
                                <i class="fas fa-paper-plane"></i>
                                Envoyer ma demande
                            </span>
                            <span class="spinner-bouton" style="display: none;">
                                <i class="fas fa-circle-notch fa-spin"></i>
                                Envoi en cours...
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Injecter le modal dans le body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialiser le formulaire
    initialiserFormulaireRdv();
    
    // Définir la date minimale (aujourd'hui)
    const dateInput = document.getElementById('date_souhaitee');
    const aujourd_hui = new Date().toISOString().split('T')[0];
    dateInput.min = aujourd_hui;
}

function initialiserFormulaireRdv() {
    const formulaire = document.getElementById('formulaire-rdv');
    const btnFermer = document.getElementById('btn-fermer-rdv');
    const modal = document.getElementById('modal-rdv');
    
    // Fermer le modal
    btnFermer.addEventListener('click', fermerModalFormulaire);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fermerModalFormulaire();
        }
    });
    
    // Soumettre le formulaire
    formulaire.addEventListener('submit', async function(e) {
        e.preventDefault();
        await soumettreFormulaireRdv(formulaire);
    });
}

function ouvrirModalFormulaire() {
    const modal = document.getElementById('modal-rdv');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function fermerModalFormulaire() {
    const modal = document.getElementById('modal-rdv');
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Réinitialiser le formulaire
    const formulaire = document.getElementById('formulaire-rdv');
    formulaire.reset();
    
    const messageDiv = document.getElementById('message-formulaire');
    messageDiv.style.display = 'none';
}

async function soumettreFormulaireRdv(formulaire) {
    const btnSubmit = formulaire.querySelector('.btn-submit-rdv');
    const texteBtn = btnSubmit.querySelector('.texte-bouton');
    const spinnerBtn = btnSubmit.querySelector('.spinner-bouton');
    const messageDiv = document.getElementById('message-formulaire');
    
    // Désactiver le bouton
    btnSubmit.disabled = true;
    texteBtn.style.display = 'none';
    spinnerBtn.style.display = 'inline-flex';
    messageDiv.style.display = 'none';
    
    try {
        // Récupérer les données du formulaire
        const formData = new FormData(formulaire);
        
        // Combiner indicatif et téléphone
        const indicatif = formData.get('indicatif');
        const telephone = formData.get('telephone').replace(/\s/g, ''); // Enlever les espaces
        const telephoneComplet = indicatif + telephone;
        
        // Obtenir le token CSRF
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        
        // Préparer les données pour envoi au format form-data (compatible Flask-WTF)
        const formDataToSend = new FormData();
        formDataToSend.append('nom', formData.get('nom'));
        formDataToSend.append('prenom', formData.get('prenom') || '');
        formDataToSend.append('email', formData.get('email'));
        formDataToSend.append('telephone', telephoneComplet);
        formDataToSend.append('service', formData.get('service'));
        formDataToSend.append('date_souhaitee', formData.get('date_souhaitee'));
        formDataToSend.append('message', formData.get('message') || '');
        formDataToSend.append('csrf_token', csrfToken);
        
        // Envoyer la requête
        const response = await fetch('/api/contact/creer', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formDataToSend
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Succès
            messageDiv.className = 'message-formulaire message-succes';
            messageDiv.innerHTML = `
                <i class="fas fa-check-circle"></i>
                ${result.message}
            `;
            messageDiv.style.display = 'flex';
            
            // Réinitialiser le formulaire
            formulaire.reset();
            
            // Fermer le modal après 3 secondes
            setTimeout(() => {
                fermerModalFormulaire();
            }, 3000);
        } else {
            // Erreur avec message du serveur
            const erreurMessage = result.message || result.erreurs?.join(', ') || 'Une erreur est survenue';
            messageDiv.className = 'message-formulaire message-erreur';
            messageDiv.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                ${erreurMessage}
            `;
            messageDiv.style.display = 'flex';
        }
    } catch (error) {
        console.error('Erreur complète:', error);
        messageDiv.className = 'message-formulaire message-erreur';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Impossible de contacter le serveur. Veuillez vérifier votre connexion et réessayer.
        `;
        messageDiv.style.display = 'flex';
    } finally {
        // Réactiver le bouton
        btnSubmit.disabled = false;
        texteBtn.style.display = 'inline-flex';
        spinnerBtn.style.display = 'none';
    }
}