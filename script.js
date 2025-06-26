// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialize all modules
    Navigation.init();
    HeroAnimations.init();
    ServiceModals.init();
    ContactForm.init();
    ScrollEffects.init();
    UIEnhancements.init();
});