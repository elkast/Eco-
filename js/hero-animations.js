// Module Animations Hero
const AnimationsHero = {
    init() {
        this.initParallaxe();
        this.initIndicateurDefilement();
    },

    initParallaxe() {
        // Ajouter effet parallaxe à la section hero
        window.addEventListener('scroll', function() {
            const positionDefilement = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${positionDefilement * 0.5}px)`;
            }
        });
    },

    initIndicateurDefilement() {
        const indicateurDefilement = document.querySelector('.scroll-indicator');
        if (indicateurDefilement) {
            indicateurDefilement.addEventListener('click', function() {
                document.getElementById('services').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }
};

