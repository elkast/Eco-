// Module Navigation
const Navigation = {
    init() {
        this.lierEvenements();
        this.initEffetDefilement();
        this.initMenuMobile();
    },

    lierEvenements() {
        // Défilement fluide pour les liens de navigation
        document.querySelectorAll('a[href^="#"]').forEach(ancre => {
            ancre.addEventListener('click', function (e) {
                e.preventDefault();
                const cible = document.querySelector(this.getAttribute('href'));
                if (cible) {
                    // Fermer le menu mobile s'il est ouvert
                    const menuMobile = document.querySelector('.nav-menu');
                    const boutonMobile = document.querySelector('.mobile-menu-toggle');
                    if (menuMobile && menuMobile.classList.contains('active')) {
                        menuMobile.classList.remove('active');
                        boutonMobile.classList.remove('active');
                    }
                    
                    cible.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },

    initEffetDefilement() {
        // Effet de défilement pour la barre de navigation
        window.addEventListener('scroll', function() {
            const barreNav = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                barreNav.style.background = 'rgba(255, 255, 255, 0.98)';
                barreNav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                barreNav.style.background = 'rgba(255, 255, 255, 0.95)';
                barreNav.style.boxShadow = 'none';
            }
        });
    },

    initMenuMobile() {
        // Basculement du menu mobile
        const boutonMenuMobile = document.querySelector('.mobile-menu-toggle');
        const menuNav = document.querySelector('.nav-menu');

        if (boutonMenuMobile && menuNav) {
            boutonMenuMobile.addEventListener('click', function() {
                menuNav.classList.toggle('active');
                this.classList.toggle('active');
                
                // Empêcher le défilement du body quand le menu est ouvert
                if (menuNav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Fermer le menu en cliquant à l'extérieur
            document.addEventListener('click', function(e) {
                if (!menuNav.contains(e.target) && !boutonMenuMobile.contains(e.target)) {
                    menuNav.classList.remove('active');
                    boutonMenuMobile.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Fermer le menu lors du redimensionnement de la fenêtre
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    menuNav.classList.remove('active');
                    boutonMenuMobile.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }
};

