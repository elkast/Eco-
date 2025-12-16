// Script du tableau de bord admin - Eco+Holding

let pageActuelle = 1;
let filtres = {
    statut: '',
    service: '',
    recherche: ''
};
let tri = {
    champ: 'date_creation',
    ordre: 'desc'
};

// Vérifier la session au chargement
document.addEventListener('DOMContentLoaded', async function() {
    await verifierSession();
    await chargerStatistiques();
    await chargerDemandes();
    
    initialiserEvenements();
});

async function verifierSession() {
    try {
        const response = await fetch('/admin/api/verifier-session');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/admin/connexion';
            return;
        }
        
        // Afficher le nom de l'utilisateur
        document.getElementById('nom-utilisateur').textContent = data.utilisateur.nom;
    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = '/admin/connexion';
    }
}

function initialiserEvenements() {
    // Déconnexion
    document.getElementById('btn-deconnexion').addEventListener('click', deconnexion);
    
    // Rafraîchir
    document.getElementById('btn-rafraichir').addEventListener('click', function() {
        chargerStatistiques();
        chargerDemandes();
    });
    
    // Filtres
    document.getElementById('filtre-statut').addEventListener('change', function(e) {
        filtres.statut = e.target.value;
        pageActuelle = 1;
        chargerDemandes();
    });
    
    document.getElementById('filtre-service').addEventListener('change', function(e) {
        filtres.service = e.target.value;
        pageActuelle = 1;
        chargerDemandes();
    });
    
    let timeoutRecherche;
    document.getElementById('recherche').addEventListener('input', function(e) {
        clearTimeout(timeoutRecherche);
        timeoutRecherche = setTimeout(() => {
            filtres.recherche = e.target.value;
            pageActuelle = 1;
            chargerDemandes();
        }, 500);
    });
    
    // Pagination
    document.getElementById('btn-precedent').addEventListener('click', function() {
        if (pageActuelle > 1) {
            pageActuelle--;
            chargerDemandes();
        }
    });
    
    document.getElementById('btn-suivant').addEventListener('click', function() {
        pageActuelle++;
        chargerDemandes();
    });
    
    // Tri
    document.querySelectorAll('.tableau-demandes th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const champ = this.dataset.sort;
            if (tri.champ === champ) {
                tri.ordre = tri.ordre === 'asc' ? 'desc' : 'asc';
            } else {
                tri.champ = champ;
                tri.ordre = 'desc';
            }
            chargerDemandes();
        });
    });
    
    // Modal
    document.getElementById('btn-fermer-modal').addEventListener('click', fermerModal);
    document.getElementById('modal-details').addEventListener('click', function(e) {
        if (e.target === this) {
            fermerModal();
        }
    });
}

async function deconnexion() {
    try {
        await fetch('/admin/api/deconnexion', {
            method: 'POST'
        });
        window.location.href = '/admin/connexion';
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function chargerStatistiques() {
    try {
        const response = await fetch('/admin/api/statistiques');
        const data = await response.json();
        
        if (data.success) {
            const stats = data.statistiques;
            document.getElementById('stat-total').textContent = stats.total;
            document.getElementById('stat-nouveau').textContent = stats.nouveau;
            document.getElementById('stat-en-cours').textContent = stats.en_cours;
            document.getElementById('stat-traite').textContent = stats.traite;
            document.getElementById('badge-nouveau').textContent = stats.nouveau;
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

async function chargerDemandes() {
    const corpsTableau = document.getElementById('corps-tableau');
    corpsTableau.innerHTML = `
        <tr class="ligne-chargement">
            <td colspan="8" style="text-align: center; padding: 2rem;">
                <i class="fas fa-circle-notch fa-spin fa-2x"></i>
                <p>Chargement des demandes...</p>
            </td>
        </tr>
    `;
    
    try {
        const params = new URLSearchParams({
            page: pageActuelle,
            limit: 10,
            sort_by: tri.champ,
            sort_order: tri.ordre,
            ...filtres
        });
        
        const response = await fetch(`/admin/api/demandes?${params}`);
        const data = await response.json();
        
        if (data.success) {
            afficherDemandes(data.demandes);
            mettreAJourPagination(data.page, data.pages, data.has_prev, data.has_next);
        } else {
            corpsTableau.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: var(--couleur-erreur);">
                        Erreur lors du chargement des demandes
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Erreur:', error);
        corpsTableau.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--couleur-erreur);">
                    Erreur de connexion au serveur
                </td>
            </tr>
        `;
    }
}

function afficherDemandes(demandes) {
    const corpsTableau = document.getElementById('corps-tableau');
    
    if (demandes.length === 0) {
        corpsTableau.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--couleur-texte-clair);">
                    Aucune demande trouvée
                </td>
            </tr>
        `;
        return;
    }
    
    corpsTableau.innerHTML = demandes.map(demande => `
        <tr>
            <td><strong>${demande.nom}</strong></td>
            <td>${demande.email}</td>
            <td>${formaterTelephone(demande.telephone)}</td>
            <td>${obtenirLibelleService(demande.service)}</td>
            <td>${formaterDate(demande.date_souhaitee)}</td>
            <td><span class="badge-statut ${demande.statut}">${obtenirLibelleStatut(demande.statut)}</span></td>
            <td>${formaterDateHeure(demande.date_creation)}</td>
            <td>
                <div class="actions-tableau">
                    <button class="btn-action btn-voir" onclick="afficherDetails(${demande.id})">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                    <button class="btn-action btn-supprimer" onclick="supprimerDemande(${demande.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function mettreAJourPagination(page, totalPages, hasPrev, hasNext) {
    document.getElementById('info-page').textContent = `Page ${page} sur ${totalPages}`;
    document.getElementById('btn-precedent').disabled = !hasPrev;
    document.getElementById('btn-suivant').disabled = !hasNext;
}

async function afficherDetails(id) {
    try {
        const response = await fetch(`/admin/api/demandes/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const demande = data.demande;
            const modalCorps = document.getElementById('modal-corps');
            
            modalCorps.innerHTML = `
                <div class="detail-ligne">
                    <span class="detail-label">Nom:</span>
                    <span class="detail-valeur">${demande.nom}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Email:</span>
                    <span class="detail-valeur">${demande.email}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Téléphone:</span>
                    <span class="detail-valeur">${formaterTelephone(demande.telephone)}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Service:</span>
                    <span class="detail-valeur">${obtenirLibelleService(demande.service)}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Date souhaitée:</span>
                    <span class="detail-valeur">${formaterDate(demande.date_souhaitee)}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Message:</span>
                    <span class="detail-valeur">${demande.message || 'Aucun message'}</span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Statut:</span>
                    <span class="detail-valeur">
                        <span class="badge-statut ${demande.statut}">${obtenirLibelleStatut(demande.statut)}</span>
                    </span>
                </div>
                <div class="detail-ligne">
                    <span class="detail-label">Date de création:</span>
                    <span class="detail-valeur">${formaterDateHeure(demande.date_creation)}</span>
                </div>
                <div class="actions-modal">
                    <button class="btn-modal btn-modal-primaire" onclick="changerStatut(${demande.id}, 'en_cours')">
                        Marquer en cours
                    </button>
                    <button class="btn-modal btn-modal-primaire" onclick="changerStatut(${demande.id}, 'traite')">
                        Marquer traité
                    </button>
                    <button class="btn-modal btn-modal-secondaire" onclick="fermerModal()">
                        Fermer
                    </button>
                </div>
            `;
            
            document.getElementById('modal-details').classList.add('actif');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des détails');
    }
}

function fermerModal() {
    document.getElementById('modal-details').classList.remove('actif');
}

async function changerStatut(id, nouveauStatut) {
    try {
        const response = await fetch(`/admin/api/demandes/${id}/statut`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ statut: nouveauStatut })
        });
        
        const data = await response.json();
        
        if (data.success) {
            fermerModal();
            await chargerStatistiques();
            await chargerDemandes();
        } else {
            alert(data.message || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

async function supprimerDemande(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/admin/api/demandes/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            await chargerStatistiques();
            await chargerDemandes();
        } else {
            alert(data.message || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

// Fonctions utilitaires
function formaterDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function formaterDateHeure(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formaterTelephone(tel) {
    if (!tel) return '-';
    return tel.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

function obtenirLibelleService(service) {
    const services = {
        'expertise-comptable': 'Suivi fiscal',
        'conseil-gestion': 'Conseil en gestion',
        'creation-entreprise': "Création d'entreprise",
        'recouvrement': 'Recouvrement',
        'immobilier': 'Gestion Immobilière',
        'logistique': 'Gestion de Flotte',
        'vente-voiture': 'Vente de voiture'
    };
    return services[service] || service;
}

function obtenirLibelleStatut(statut) {
    const statuts = {
        'nouveau': 'Nouveau',
        'en_cours': 'En cours',
        'traite': 'Traité',
        'archive': 'Archivé'
    };
    return statuts[statut] || statut;
}