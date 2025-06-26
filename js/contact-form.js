// Contact Form Module
const ContactForm = {
    form: null,

    init() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Send data to PHP backend
            const response = await fetch('contact-handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Reset form
                this.form.reset();
                
                // Show success message
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                submitBtn.style.background = '#28a745';
                
                // Show success alert
                alert('Merci pour votre message ! Nous vous recontacterons très prochainement.');
            } else {
                throw new Error(result.error || 'Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur';
            submitBtn.style.background = '#dc3545';
            alert('Une erreur est survenue. Veuillez réessayer.');
        }
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
};

// Global utility functions
window.scrollToContact = function() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
};

window.openQuoteForm = function() {
    // Pre-select "Devis gratuit" option in the contact form
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        // Add devis option if it doesn't exist
        const devisOption = Array.from(serviceSelect.options).find(option => option.value === 'devis');
        if (!devisOption) {
            const newOption = document.createElement('option');
            newOption.value = 'devis';
            newOption.textContent = 'Demande de devis gratuit';
            serviceSelect.appendChild(newOption);
        }
        serviceSelect.value = 'devis';
    }
    scrollToContact();
};