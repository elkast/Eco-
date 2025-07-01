class ServiceModals {
    constructor() {
        this.modals = {};
        this.activeModal = null;
        this.init();
    }

    init() {
        this.setupModals();
        this.bindEvents();
        this.setupKeyboardNavigation();
    }

    setupModals() {
        // Get all modal elements
        const modalElements = document.querySelectorAll('.modal');
        modalElements.forEach(modal => {
            const modalId = modal.id;
            this.modals[modalId] = {
                element: modal,
                content: modal.querySelector('.modal-content'),
                closeBtn: modal.querySelector('.close')
            };
        });
    }

    bindEvents() {
        // Bind service card clicks
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const service = card.dataset.service;
                this.openModal(`${service}Modal`);
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });
        });

        // Bind modal close events
        Object.values(this.modals).forEach(modal => {
            // Close button
            if (modal.closeBtn) {
                modal.closeBtn.addEventListener('click', () => {
                    this.closeModal(modal.element.id);
                });
            }

            // Click outside to close
            modal.element.addEventListener('click', (e) => {
                if (e.target === modal.element) {
                    this.closeModal(modal.element.id);
                }
            });

            // Prevent closing when clicking inside modal content
            modal.content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Bind modal footer buttons
        this.bindModalButtons();
    }

    bindModalButtons() {
        const modalButtons = document.querySelectorAll('.modal-footer .btn');
        modalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = button.textContent.trim();
                this.handleModalAction(buttonText);
            });
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal(this.activeModal);
            }
        });
    }

    openModal(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Close any currently open modal
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }

        // Animate modal opening
        modal.element.style.display = 'flex';
        modal.element.classList.add('show');
        
        // Add body scroll lock
        document.body.style.overflow = 'hidden';
        
        // Set active modal
        this.activeModal = modalId;

        // Focus management
        modal.content.setAttribute('tabindex', '-1');
        modal.content.focus();

        // Animate modal content
        this.animateModalContent(modal.content, 'in');

        // Track modal opening
        this.trackModalEvent('open', modalId);
    }

    closeModal(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;

        // Animate modal closing
        this.animateModalContent(modal.content, 'out', () => {
            modal.element.classList.remove('show');
            modal.element.style.display = 'none';
            
            // Remove body scroll lock
            document.body.style.overflow = '';
            
            // Clear active modal
            this.activeModal = null;
        });

        // Track modal closing
        this.trackModalEvent('close', modalId);
    }

    animateModalContent(content, direction, callback) {
        const keyframes = direction === 'in' 
            ? [
                { opacity: 0, transform: 'translateY(50px) scale(0.9)' },
                { opacity: 1, transform: 'translateY(0) scale(1)' }
            ]
            : [
                { opacity: 1, transform: 'translateY(0) scale(1)' },
                { opacity: 0, transform: 'translateY(-50px) scale(0.9)' }
            ];

        const animation = content.animate(keyframes, {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        });

        if (callback) {
            animation.addEventListener('finish', callback);
        }
    }

    addHoverEffect(card) {
        const icon = card.querySelector('.service-icon');
        const button = card.querySelector('.btn-service');
        
        // Add pulse effect to icon
        icon.style.animation = 'pulse 1.5s ease-in-out infinite';
        
        // Animate button
        if (button) {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        }
    }

    removeHoverEffect(card) {
        const icon = card.querySelector('.service-icon');
        const button = card.querySelector('.btn-service');
        
        // Remove pulse effect
        icon.style.animation = '';
        
        // Reset button
        if (button) {
            button.style.transform = '';
            button.style.boxShadow = '';
        }
    }

    handleModalAction(action) {
        const actions = {
            'Demander un devis': () => this.requestQuote(),
            'Prendre rendez-vous': () => this.scheduleAppointment(),
            'Évaluer mon bien': () => this.evaluateProperty(),
            'Consultation gratuite': () => this.freeConsultation(),
            'Réserver maintenant': () => this.bookNow(),
            'En savoir plus': () => this.learnMore()
        };

        const actionFn = actions[action];
        if (actionFn) {
            actionFn();
        }
    }

    requestQuote() {
        this.closeCurrentModal();
        this.scrollToContact();
        this.populateContactForm('devis');
    }

    scheduleAppointment() {
        this.closeCurrentModal();
        this.scrollToContact();
        this.populateContactForm('rendez-vous');
    }

    evaluateProperty() {
        this.closeCurrentModal();
        this.scrollToContact();
        this.populateContactForm('evaluation');
    }

    freeConsultation() {
        this.closeCurrentModal();
        this.scrollToContact();
        this.populateContactForm('consultation');
    }

    bookNow() {
        this.closeCurrentModal();
        this.scrollToContact();
        this.populateContactForm('reservation');
    }

    learnMore() {
        this.closeCurrentModal();
        this.scrollToContact();
    }

    closeCurrentModal() {
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
    }

    scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    populateContactForm(type) {
        const messageField = document.getElementById('message');
        const serviceField = document.getElementById('service');
        
        const messages = {
            'devis': 'Bonjour, je souhaiterais recevoir un devis pour vos services. Merci de me recontacter.',
            'rendez-vous': 'Bonjour, j\'aimerais prendre rendez-vous pour discuter de mes besoins. Merci.',
            'evaluation': 'Bonjour, je souhaiterais faire évaluer mon bien immobilier. Pouvez-vous me recontacter ?',
            'consultation': 'Bonjour, j\'aimerais bénéficier d\'une consultation gratuite. Merci de me recontacter.',
            'reservation': 'Bonjour, je souhaiterais réserver un service de transport. Merci de me recontacter.'
        };

        if (messageField && messages[type]) {
            messageField.value = messages[type];
            messageField.focus();
        }

        // Auto-select service if possible
        if (serviceField && this.activeModal) {
            const serviceMap = {
                'comptabiliteModal': 'comptabilite',
                'immobilierModal': 'immobilier',
                'transportModal': 'transport'
            };
            
            const serviceValue = serviceMap[this.activeModal];
            if (serviceValue) {
                serviceField.value = serviceValue;
            }
        }
    }

    trackModalEvent(action, modalId) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'modal_' + action, {
                'modal_id': modalId,
                'event_category': 'engagement'
            });
        }
    }

    // Public methods for external use
    getActiveModal() {
        return this.activeModal;
    }

    isModalOpen() {
        return this.activeModal !== null;
    }

    closeAllModals() {
        Object.keys(this.modals).forEach(modalId => {
            this.closeModal(modalId);
        });
    }
}

// Initialize service modals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.serviceModals = new ServiceModals();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceModals;
}

