/**
 * ECO+HOLDING - JavaScript Principal
 * Gestion des interactions et animations
 */

// ==================== NAVIGATION STICKY ====================
const navbar = document.querySelector('.navbar');

function gerer_scroll_navbar() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', gerer_scroll_navbar);

// ==================== MENU MOBILE ====================
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (navbarToggle) {
  navbarToggle.addEventListener('click', function() {
    navbarMenu.classList.toggle('active');
    
    // Animation du bouton hamburger
    const spans = this.querySelectorAll('span');
    spans[0].style.transform = navbarMenu.classList.contains('active') 
      ? 'rotate(45deg) translateY(8px)' 
      : 'none';
    spans[1].style.opacity = navbarMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navbarMenu.classList.contains('active') 
      ? 'rotate(-45deg) translateY(-8px)' 
      : 'none';
  });
}

// Fermer le menu mobile lors du clic sur un lien
const navbarLinks = document.querySelectorAll('.navbar-menu a');
navbarLinks.forEach(link => {
  link.addEventListener('click', function() {
    if (window.innerWidth <= 768) {
      navbarMenu.classList.remove('active');
      
      // Réinitialiser l'animation du bouton
      const spans = navbarToggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    }
  });
});

// ==================== SCROLL FLUIDE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ==================== FORMULAIRE DE CONTACT ====================
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Désactiver le bouton de soumission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    
    // Réinitialiser les erreurs
    document.querySelectorAll('.form-error').forEach(error => {
      error.classList.remove('visible');
    });
    document.querySelectorAll('.form-control').forEach(control => {
      control.classList.remove('error');
    });
    
    // Préparer les données du formulaire
    const formData = new FormData(this);
    
    try {
      const response = await fetch('/demande', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Succès
        afficher_message(data.message, 'success');
        contactForm.reset();
      } else {
        // Erreurs de validation
        if (data.errors) {
          Object.keys(data.errors).forEach(field => {
            const input = document.getElementById(field);
            const errorDiv = document.getElementById(`${field}-error`);
            
            if (input && errorDiv) {
              input.classList.add('error');
              errorDiv.textContent = data.errors[field];
              errorDiv.classList.add('visible');
            }
          });
        }
        
        afficher_message(data.message, 'error');
      }
    } catch (error) {
      afficher_message('Une erreur s\'est produite. Veuillez réessayer.', 'error');
    } finally {
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function afficher_message(message, type) {
  if (!formMessage) return;
  
  formMessage.textContent = message;
  formMessage.className = `alert alert-${type}`;
  formMessage.style.display = 'block';
  
  // Faire défiler vers le message
  formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Masquer après 5 secondes
  setTimeout(() => {
    formMessage.style.display = 'none';
  }, 5000);
}

// ==================== LAZY LOADING IMAGES ====================
function charger_images_lazy() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Initialiser le lazy loading au chargement de la page
if ('IntersectionObserver' in window) {
  charger_images_lazy();
}

// ==================== ANIMATION AU SCROLL ====================
function animer_au_scroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(element => scrollObserver.observe(element));
}

// Initialiser les animations
document.addEventListener('DOMContentLoaded', function() {
  animer_au_scroll();
  
  // Ajouter une classe pour indiquer que la page est chargée
  document.body.classList.add('loaded');
});

// ==================== VALIDATION FORMULAIRE EN TEMPS RÉEL ====================
function configurer_validation_temps_reel() {
  const inputs = document.querySelectorAll('.form-control');
  
  inputs.forEach(input => {
    // Validation lors de la perte de focus
    input.addEventListener('blur', function() {
      valider_champ(this);
    });
    
    // Enlever l'erreur lors de la saisie
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorDiv = document.getElementById(`${this.id}-error`);
        if (errorDiv) {
          errorDiv.classList.remove('visible');
        }
      }
    });
  });
}

function valider_champ(champ) {
  const errorDiv = document.getElementById(`${champ.id}-error`);
  let message = '';
  
  // Validation selon le type de champ
  if (champ.hasAttribute('required') && !champ.value.trim()) {
    message = 'Ce champ est requis';
  } else if (champ.type === 'email' && champ.value && !valider_email(champ.value)) {
    message = 'Format d\'email invalide';
  } else if (champ.type === 'tel' && champ.value && champ.value.length < 8) {
    message = 'Numéro de téléphone invalide';
  }
  
  if (message && errorDiv) {
    champ.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
    return false;
  } else if (errorDiv) {
    champ.classList.remove('error');
    errorDiv.classList.remove('visible');
    return true;
  }
  
  return true;
}

function valider_email(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Configurer la validation au chargement
document.addEventListener('DOMContentLoaded', function() {
  configurer_validation_temps_reel();
});

// ==================== STATISTIQUES ANIMÉES ====================
function animer_compteurs() {
  const compteurs = document.querySelectorAll('.stat-number');
  
  compteurs.forEach(compteur => {
    const cible = parseInt(compteur.dataset.count);
    const duree = 2000; // 2 secondes
    const increment = cible / (duree / 16); // 60 FPS
    let actuel = 0;
    
    const timer = setInterval(() => {
      actuel += increment;
      if (actuel >= cible) {
        compteur.textContent = cible;
        clearInterval(timer);
      } else {
        compteur.textContent = Math.floor(actuel);
      }
    }, 16);
  });
}

// Observer pour déclencher l'animation des compteurs
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animer_compteurs();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// ==================== GESTION DES COOKIES / RGPD ====================
function afficher_bandeau_cookies() {
  const cookieBanner = document.getElementById('cookie-banner');
  
  if (cookieBanner && !localStorage.getItem('cookies-accepted')) {
    setTimeout(() => {
      cookieBanner.style.display = 'block';
    }, 1000);
  }
}

function accepter_cookies() {
  localStorage.setItem('cookies-accepted', 'true');
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    cookieBanner.style.display = 'none';
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
  afficher_bandeau_cookies();
  
  const acceptBtn = document.getElementById('accept-cookies');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', accepter_cookies);
  }
});
