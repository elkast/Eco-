/**
 * ECO+HOLDING - JavaScript Admin
 * Gestion de l'interface d'administration
 */

// ==================== FILTRAGE ET RECHERCHE ====================
function initialiser_filtres() {
  const filtreStatut = document.getElementById('filtre-statut');
  const filtreService = document.getElementById('filtre-service');
  const searchInput = document.getElementById('search-demandes');
  
  if (filtreStatut) {
    filtreStatut.addEventListener('change', function() {
      appliquer_filtres();
    });
  }
  
  if (filtreService) {
    filtreService.addEventListener('change', function() {
      appliquer_filtres();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
      filtrer_recherche(this.value);
    }, 300));
  }
}

function appliquer_filtres() {
  const statut = document.getElementById('filtre-statut')?.value || '';
  const service = document.getElementById('filtre-service')?.value || '';
  
  const params = new URLSearchParams();
  if (statut) params.append('statut', statut);
  if (service) params.append('service', service);
  
  window.location.href = `${window.location.pathname}?${params.toString()}`;
}

function filtrer_recherche(terme) {
  const lignes = document.querySelectorAll('.demande-row');
  const termeMin = terme.toLowerCase();
  
  lignes.forEach(ligne => {
    const texte = ligne.textContent.toLowerCase();
    ligne.style.display = texte.includes(termeMin) ? '' : 'none';
  });
}

// ==================== CONFIRMATION ACTIONS ====================
function confirmer_suppression(message) {
  return confirm(message || 'Êtes-vous sûr de vouloir supprimer cet élément ?');
}

function confirmer_modification(message) {
  return confirm(message || 'Êtes-vous sûr de vouloir effectuer cette modification ?');
}

// ==================== NOTIFICATIONS ====================
function afficher_notification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Masquer après 3 secondes
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ==================== STATISTIQUES EN TEMPS RÉEL ====================
async function actualiser_statistiques() {
  try {
    const response = await fetch('/admin/api/stats');
    const data = await response.json();
    
    if (data.success) {
      // Mettre à jour les compteurs
      document.getElementById('total-demandes').textContent = data.total_demandes;
      document.getElementById('nouvelles-demandes').textContent = data.nouvelles_demandes;
      document.getElementById('en-cours').textContent = data.en_cours;
      document.getElementById('traitees').textContent = data.traitees;
    }
  } catch (error) {
    console.error('Erreur lors de l\'actualisation des statistiques:', error);
  }
}

// ==================== EXPORT DE DONNÉES ====================
function exporter_demandes(format = 'csv') {
  const params = new URLSearchParams(window.location.search);
  params.append('export', format);
  window.location.href = `/admin/demandes/export?${params.toString()}`;
}

// ==================== MODIFICATION RAPIDE DU STATUT ====================
function modifier_statut_rapide(demandeId, nouveauStatut) {
  if (!confirmer_modification('Changer le statut de cette demande ?')) {
    return;
  }
  
  fetch(`/admin/demande/${demandeId}/statut`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ statut: nouveauStatut })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      afficher_notification('Statut mis à jour avec succès', 'success');
      // Recharger la page ou mettre à jour l'élément
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      afficher_notification('Erreur lors de la mise à jour', 'error');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    afficher_notification('Erreur de connexion', 'error');
  });
}

// ==================== UTILITAIRES ====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formater_date(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
  initialiser_filtres();
  
  // Actualiser les stats toutes les 30 secondes si on est sur le dashboard
  if (document.querySelector('.stats-grid')) {
    setInterval(actualiser_statistiques, 30000);
  }
  
  // Gestionnaire pour les boutons d'export
  const btnExport = document.getElementById('btn-export');
  if (btnExport) {
    btnExport.addEventListener('click', function() {
      exporter_demandes('csv');
    });
  }
});
