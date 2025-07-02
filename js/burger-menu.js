document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Vérifier que les éléments existent
    if (!burgerMenu || !navMenu) {
        console.warn('Menu burger ou navigation non trouvés');
        return;
    }
    
    // État du menu
    let isMenuOpen = false;
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        isMenuOpen = true;
        burgerMenu.classList.add('active');
        navMenu.classList.add('active');
        navMenu.classList.remove('closing');
        body.classList.add('menu-open');
        
        // Accessibilité
        burgerMenu.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        
        // Focus sur le premier lien
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        isMenuOpen = false;
        burgerMenu.classList.remove('active');
        navMenu.classList.add('closing');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Accessibilité
        burgerMenu.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        
        // Nettoyer la classe closing après l'animation
        setTimeout(() => {
            navMenu.classList.remove('closing');
        }, 300);
    }
    
    // Toggle du menu
    function toggleMenu() {
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Event listener pour le bouton burger
    burgerMenu.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Fermer le menu en cliquant sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !navMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
            burgerMenu.focus();
        }
    });
    
    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Navigation au clavier dans le menu
    navMenu.addEventListener('keydown', function(e) {
        if (!isMenuOpen) return;
        
        const focusableElements = navMenu.querySelectorAll('.nav-link');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    // Initialisation des attributs d'accessibilité
    burgerMenu.setAttribute('aria-expanded', 'false');
    burgerMenu.setAttribute('aria-controls', 'nav-menu');
    burgerMenu.setAttribute('aria-label', 'Menu de navigation');
    navMenu.setAttribute('aria-hidden', 'true');
    navMenu.setAttribute('id', 'nav-menu');
});