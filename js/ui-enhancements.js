class UIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupScrollToTop();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupCardAnimations();
        this.setupFormEnhancements();
        this.setupLoadingStates();
        this.setupTooltips();
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    this.updateActiveNavLink(href);
                }
            });
        });
    }

    setupScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Retour en haut');
        document.body.appendChild(scrollBtn);

        // Show/hide based on scroll position
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    if (scrolled > 500) {
                        scrollBtn.classList.add('visible');
                    } else {
                        scrollBtn.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Scroll to top functionality
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupParallaxEffects() {
        // Simple parallax for hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        const rate = scrolled * -0.5;
                        hero.style.transform = `translateY(${rate}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    }

    setupCounterAnimations() {
        // Animate counters in about section
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 40);
    }

    setupCardAnimations() {
        // Intersection Observer for card animations
        const cards = document.querySelectorAll('.service-card, .testimonial-card, .hero-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        cards.forEach(card => observer.observe(card));
    }

    setupFormEnhancements() {
        // Enhanced form interactions
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            // Floating label effect
            const wrapper = input.parentElement;
            if (wrapper && wrapper.classList.contains('form-group')) {
                input.addEventListener('focus', () => {
                    wrapper.classList.add('focused');
                });

                input.addEventListener('blur', () => {
                    if (input.value === '') {
                        wrapper.classList.remove('focused');
                    }
                });

                // Check initial state
                if (input.value !== '') {
                    wrapper.classList.add('focused');
                }
            }

            // Real-time validation feedback
            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const wrapper = field.parentElement;
        
        if (wrapper) {
            wrapper.classList.remove('valid', 'invalid');
            if (field.value !== '') {
                wrapper.classList.add(isValid ? 'valid' : 'invalid');
            }
        }
    }

    setupLoadingStates() {
        // Add loading states to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.type === 'submit') {
                    this.showLoadingState(button);
                }
            });
        });
    }

    showLoadingState(button) {
        const originalText = button.textContent;
        button.textContent = 'Chargement...';
        button.disabled = true;
        button.classList.add('loading');

        // Reset after 3 seconds (in real app, this would be when response comes back)
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        }, 3000);
    }

    setupTooltips() {
        // Simple tooltip system
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });

            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';

        setTimeout(() => tooltip.classList.add('visible'), 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    updateActiveNavLink(href) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize UI enhancements
document.addEventListener('DOMContentLoaded', () => {
    window.uiEnhancements = new UIEnhancements();
});

// Add CSS for UI enhancements
const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .scroll-to-top:hover {
        background: var(--primary-blue-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }

    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    .form-group {
        position: relative;
    }

    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
        border-color: var(--primary-blue);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-group.valid input,
    .form-group.valid textarea {
        border-color: var(--success);
    }

    .form-group.invalid input,
    .form-group.invalid textarea {
        border-color: var(--error);
    }

    .tooltip {
        position: absolute;
        background: var(--gray-900);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.2s ease;
        pointer-events: none;
    }

    .tooltip.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: var(--gray-900);
    }

    .nav-link.active {
        color: var(--primary-blue);
        font-weight: 600;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

