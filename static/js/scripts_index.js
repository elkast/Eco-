 document.addEventListener('DOMContentLoaded', function() {
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
                });
            });
            
            // Animation AOS avec paramètres améliorés
            AOS.init({
                duration: 1000,
                once: true,
                offset: 80,
                easing: 'ease-out-cubic',
                delay: 100
            });
            
            // Défilement fluide
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Back to top
            const backToTopBtn = document.querySelector('.back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Formulaire de contact
            const contactForm = document.getElementById('form-rdv');
            
            if (contactForm) {
                contactForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    
                    // Désactiver le bouton et afficher le chargement
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Envoi en cours...';
                    
                    // Récupérer les valeurs du formulaire
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    
                    try {
                        const response = await fetch('/api/contact/creer', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            // Afficher un message de succès
                            alert('✓ ' + result.message);
                            
                            // Réinitialiser le formulaire
                            this.reset();
                        } else {
                            // Afficher le message d'erreur
                            alert('✗ ' + result.message);
                        }
                    } catch (error) {
                        console.error('Erreur:', error);
                        alert('✗ Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
                    } finally {
                        // Réactiver le bouton
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }
                });
            }
            
            // Navigation au scroll - Effet glassmorphic
            const navbar = document.querySelector('.barre-navigation');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 65, 106, 0.1)';
                } else {
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                }
            });
            
            // Active link highlighting on scroll
            const sections = document.querySelectorAll('section[id]');
            
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= sectionTop - 100) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
            
            // Animation pour la section hero
            const scrollDown = document.querySelector('.scroll-hero');
            
            if (scrollDown) {
                scrollDown.addEventListener('click', function() {
                    window.scrollTo({
                        top: window.innerHeight - 70,
                        behavior: 'smooth'
                    });
                });
            }
        });