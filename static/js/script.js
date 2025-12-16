// // script.js
// document.addEventListener('DOMContentLoaded', function() {
//     // Menu mobile
//     const menuBtn = document.getElementById('bouton-menu');
//     const menuNav = document.getElementById('menu-nav');
    
//     menuBtn.addEventListener('click', function() {
//         menuBtn.classList.toggle('active');
//         menuNav.classList.toggle('active');
//     });
    
//     // Fermer le menu en cliquant sur un lien
//     const navLinks = document.querySelectorAll('.lien-nav');
//     navLinks.forEach(link => {
//         link.addEventListener('click', () => {
//             menuBtn.classList.remove('active');
//             menuNav.classList.remove('active');
//         });
//     });
    
//     // Animation AOS
//     AOS.init({
//         duration: 800,
//         once: true,
//         offset: 100
//     });
    
//     // Défilement fluide
//     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//         anchor.addEventListener('click', function(e) {
//             e.preventDefault();
            
//             const targetId = this.getAttribute('href');
//             if (targetId === '#') return;
            
//             const targetElement = document.querySelector(targetId);
//             if (targetElement) {
//                 window.scrollTo({
//                     top: targetElement.offsetTop - 70,
//                     behavior: 'smooth'
//                 });
//             }
//         });
//     });
    
//     // Back to top
//     const backToTopBtn = document.querySelector('.back-to-top');
    
//     window.addEventListener('scroll', function() {
//         if (window.pageYOffset > 500) {
//             backToTopBtn.classList.add('visible');
//         } else {
//             backToTopBtn.classList.remove('visible');
//         }
//     });
    
//     backToTopBtn.addEventListener('click', function() {
//         window.scrollTo({
//             top: 0,
//             behavior: 'smooth'
//         });
//     });
    
//     // Formulaire de contact
//     const contactForm = document.getElementById('form-rdv');
    
//     if (contactForm) {
//         contactForm.addEventListener('submit', function(e) {
//             e.preventDefault();
            
//             // Récupérer les valeurs du formulaire
//             const formData = new FormData(this);
//             const data = Object.fromEntries(formData);
            
//             // Simulation d'envoi
//             console.log('Données du formulaire:', data);
            
//             // Afficher un message de succès
//             alert('Votre demande de rendez-vous a été envoyée avec succès ! Nous vous contacterons très rapidement.');
            
//             // Réinitialiser le formulaire
//             this.reset();
//         });
//     }
    
//     // Changement de couleur de la navigation au scroll
//     const navbar = document.querySelector('.barre-navigation');
    
//     window.addEventListener('scroll', function() {
//         if (window.scrollY > 50) {
//             navbar.style.backgroundColor = 'var(--couleur-blanc)';
//             navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
//         } else {
//             navbar.style.backgroundColor = '';
//             navbar.style.boxShadow = '';
//         }
//     });
    
//     // Animation pour la section hero
//     const scrollDown = document.querySelector('.scroll-hero');
    
//     if (scrollDown) {
//         scrollDown.addEventListener('click', function() {
//             window.scrollTo({
//                 top: window.innerHeight - 70,
//                 behavior: 'smooth'
//             });
//         });
//     }
// });