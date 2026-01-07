// Script de connexion admin - Eco+Holding

document.addEventListener('DOMContentLoaded', function() {
    const formulaire = document.getElementById('formulaire-connexion');
    const btnConnexion = document.getElementById('btn-connexion');
    const messageErreur = document.getElementById('message-erreur');
    
    formulaire.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Désactiver le bouton et afficher le spinner
        btnConnexion.classList.add('chargement');
        btnConnexion.disabled = true;
        messageErreur.style.display = 'none';
        
        // Récupérer les données du formulaire
        const email = document.getElementById('email').value;
        const mot_de_passe = document.getElementById('mot_de_passe').value;
        
        try {
            // Obtenir le token CSRF
            const csrfMeta = document.querySelector('meta[name="csrf-token"]');
            const csrfToken = csrfMeta ? csrfMeta.content : '';
            
            const response = await fetch('/admin/api/connexion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    email: email,
                    mot_de_passe: mot_de_passe
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Rediriger vers le tableau de bord
                window.location.href = '/admin/tableau-de-bord';
            } else {
                // Afficher le message d'erreur
                messageErreur.textContent = data.message || 'Erreur de connexion';
                messageErreur.style.display = 'block';
                
                // Réactiver le bouton
                btnConnexion.classList.remove('chargement');
                btnConnexion.disabled = false;
            }
        } catch (error) {
            console.error('Erreur:', error);
            messageErreur.textContent = 'Erreur de connexion au serveur';
            messageErreur.style.display = 'block';
            
            // Réactiver le bouton
            btnConnexion.classList.remove('chargement');
            btnConnexion.disabled = false;
        }
    });
});