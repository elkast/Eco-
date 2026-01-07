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
    
    // Désactiver le rafraîchissement automatique pour éviter les requêtes excessives
    // Les utilisateurs peuvent utiliser le bouton rafraîchir manuellement
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
    document.getElementById('btn-rafraichir').addEventListener('click', async function() {
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-sync fa-spin"></i>';
        
        await Promise.all([
            chargerStatistiques(),
            chargerDemandes()
        ]);
        
        this.disabled = false;
        this.innerHTML = '<i class="fas fa-sync"></i>';
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
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        return;
    }
    
    try {
        await fetch('/admin/api/deconnexion', {
            method: 'POST'
        });
        window.location.href = '/admin/connexion';
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la déconnexion');
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
            
            // Mettre à jour les nouvelles d'aujourd'hui
            if (document.getElementById('stat-nouvelles-aujourdhui')) {
                document.getElementById('stat-nouvelles-aujourdhui').textContent = stats.nouvelles_aujourdhui || 0;
            }
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
                <td colspan="7" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; color: var(--couleur-texte-clair); margin-bottom: 1rem;"></i>
                    <p style="color: var(--couleur-texte-clair);">Aucune demande trouvée</p>
                </td>
            </tr>
        `;
        return;
    }
    
    corpsTableau.innerHTML = demandes.map(demande => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <img src="https://i.pravatar.cc/40?u=${demande.email}" alt="${demande.nom}" style="width: 40px; height: 40px; border-radius: 50%;">
                    <div>
                        <div style="font-weight: 600;">${demande.nom} ${demande.prenom || ''}</div>
                    </div>
                </div>
            </td>
            <td>
                <div style="font-size: 0.875rem;">
                    <div style="color: var(--couleur-texte);">${demande.email}</div>
                    <div style="color: var(--couleur-texte-clair); margin-top: 0.25rem;">${formaterTelephone(demande.telephone)}</div>
                </div>
            </td>
            <td>${obtenirLibelleService(demande.service)}</td>
            <td>${formaterDate(demande.date_souhaitee)}</td>
            <td><span class="badge-statut ${demande.statut}">${obtenirLibelleStatut(demande.statut)}</span></td>
            <td>${formaterDateHeure(demande.date_creation)}</td>
            <td>
                <div class="actions-tableau">
                    <button class="btn-action btn-voir" onclick="afficherDetails(${demande.id})" title="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-supprimer" onclick="supprimerDemande(${demande.id})" title="Supprimer">
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
        'gestion_affaires': 'ECO+HOLDING - Gestion d\'Affaires',
        'prestige_immobilier': 'PRESTIGE IMMOBILIER',
        'logistique': 'ECO+TRANS-LOGISTIQUE',
        // Anciens services pour compatibilité
        'finance': 'ECO+HOLDING - Gestion d\'Affaires',
        'immobilier': 'PRESTIGE IMMOBILIER'
    };
    return services[service] || service;
}

function obtenirLibelleStatut(statut) {
    const statuts = {
        'nouveau': 'Nouveau',
        'en_cours': 'En cours',
        'traite': 'Traité',
        'annule': 'Annulé'
    };
    return statuts[statut] || statut;
}