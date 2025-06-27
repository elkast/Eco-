// Module Effets de Défilement
const EffetsDefilement = {
    init() {
        this.initAnimationStatistiques();
        this.initRetourHaut();
    },

    initAnimationStatistiques() {
        // Animer les chiffres des statistiques quand ils entrent dans la vue
        const statistiques = document.querySelectorAll('.stat-number');
        
        const observateur = new IntersectionObserver((entrees) => {
            entrees.forEach((entree) => {
                if (entree.isIntersecting) {
                    const cible = entree.target;
                    const valeurFinale = parseInt(cible.textContent);
                    let valeurActuelle = 0;
                    const increment = valeurFinale / 50;
                    
                    const minuteur = setInterval(() => {
                        valeurActuelle += increment;
                        if (valeurActuelle >= valeurFinale) {
                            cible.textContent = valeurFinale + (cible.textContent.includes('+') ? '+' : '');
                            clearInterval(minuteur);
                        } else {
                            cible.textContent = Math.floor(valeurActuelle) + (cible.textContent.includes('+') ? '+' : '');
                        }
                    }, 50);
                    
                    observateur.unobserve(cible);
                }
            });
        });
        
        statistiques.forEach((stat) => {
            observateur.observe(stat);
        });
    },

    initRetourHaut() {
        const boutonRetour = document.createElement('div');
        boutonRetour.className = 'scroll-to-top';
        boutonRetour.innerHTML = '<i class="fas fa-chevron-up"></i>';
        
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: var(--primary-blue);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: var(--transition-fast);
                z-index: 999;
            }
            
            .scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .scroll-to-top:hover {
                background: var(--secondary-pink);
                transform: translateY(-3px);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 90px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(boutonRetour);
        
        // Afficher/masquer le bouton de défilement
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                boutonRetour.classList.add('visible');
            } else {
                boutonRetour.classList.remove('visible');
            }
        });
        
        // Fonctionnalité de retour en haut
        boutonRetour.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

