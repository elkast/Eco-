// Initialisation principale avec commentaires en français
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les animations AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialiser tous les modules
    Navigation.init();
    AnimationsHero.init();
    ModalesServices.init();
    FormulaireContact.init();
    EffetsDefilement.init();
    AmeliorationsUI.init();
    
    // Initialiser les fonctionnalités spécifiques
    initCarouselImages();
    initIndicateurDefilementNav();
    initOptimisationsSEO();
});

// Fonction pour le carousel d'images dans la section expertise
function initCarouselImages() {
    const cartes = document.querySelectorAll('.expertise-card');
    
    cartes.forEach(carte => {
        const images = carte.querySelectorAll('.carousel-image');
        let indexActuel = 0;
        
        // Rotation automatique des images
        setInterval(() => {
            images[indexActuel].classList.remove('active');
            indexActuel = (indexActuel + 1) % images.length;
            images[indexActuel].classList.add('active');
        }, 3000);
    });
}

// Indicateur de progression de défilement dans la navigation
function initIndicateurDefilementNav() {
    const indicateur = document.createElement('div');
    indicateur.className = 'scroll-indicator';
    document.querySelector('.navbar').appendChild(indicateur);
    
    window.addEventListener('scroll', function() {
        const hauteurDocument = document.documentElement.scrollHeight - window.innerHeight;
        const progression = (window.pageYOffset / hauteurDocument) * 100;
        indicateur.style.transform = `scaleX(${progression / 100})`;
    });
}

// Optimisations SEO dynamiques
function initOptimisationsSEO() {
    // Mise à jour du titre de page selon la section visible
    const sections = document.querySelectorAll('section[id]');
    const titres = {
        'accueil': 'Eco+ - Cabinet de Services Professionnels',
        'services': 'Nos Services - Eco+ Cabinet',
        'about': 'À Propos - Eco+ Cabinet',
        'contact': 'Contact - Eco+ Cabinet'
    };
    
    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach(entree => {
            if (entree.isIntersecting) {
                const idSection = entree.target.id;
                if (titres[idSection]) {
                    document.title = titres[idSection];
                }
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observateur.observe(section));
}
