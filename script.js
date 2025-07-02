// Initialisation des animations
        document.addEventListener('DOMContentLoaded', function() {
            // Initialisation de AOS
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
            
            // Menu mobile
            const menuBtn = document.getElementById('bouton-menu');
            const menuNav = document.getElementById('menu-nav');
            
            menuBtn.addEventListener('click', function() {
                menuBtn.classList.toggle('active');
                menuNav.classList.toggle('active');
            });
            
            // Fermer le menu en cliquant sur un lien
            const navLinks = document.querySelectorAll('.lien-nav');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuBtn.classList.remove('active');
                    menuNav.classList.remove('active');
                    
                    // Mettre à jour le lien actif
                    navLinks.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                });
            });
            
            // Scroll vers les sections
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Bouton retour en haut
            const backToTopBtn = document.querySelector('.back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('active');
                } else {
                    backToTopBtn.classList.remove('active');
                }
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Animation du formulaire
            const form = document.getElementById('form-rdv');
            if (form) {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Animation de succès
                    form.innerHTML = `
                        <div style="text-align: center; padding: 40px 0;">
                            <i class="fas fa-check-circle" style="font-size: 4rem; color: #4CAF50; margin-bottom: 20px;"></i>
                            <h3>Demande envoyée avec succès !</h3>
                            <p>Nous vous contacterons dans les plus brefs délais.</p>
                        </div>
                    `;
                });
            }
            
            // Effet parallaxe sur la section hero
            const hero = document.querySelector('.hero');
            if (hero) {
                window.addEventListener('scroll', function() {
                    const scrollPosition = window.pageYOffset;
                    hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
                });
            }
            
            // Date minimale pour le formulaire
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const minDate = tomorrow.toISOString().split('T')[0];
            document.getElementById('date').min = minDate;
        });