// Initialisation principale de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS (Animation en défilement)
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
});