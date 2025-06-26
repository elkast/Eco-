// Hero Animations Module
const HeroAnimations = {
    init() {
        this.initParallax();
        this.initScrollIndicator();
    },

    initParallax() {
        // Add parallax effect to hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    },

    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                document.getElementById('services').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        }
    }
};