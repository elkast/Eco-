// Scroll Effects Module
const ScrollEffects = {
    init() {
        this.initStatsAnimation();
        this.initScrollToTop();
    },

    initStatsAnimation() {
        // Animate stats numbers when they come into view
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    let currentValue = 0;
                    const increment = finalValue / 50;
                    
                    const timer = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            target.textContent = finalValue + (target.textContent.includes('+') ? '+' : '');
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue) + (target.textContent.includes('+') ? '+' : '');
                        }
                    }, 50);
                    
                    observer.unobserve(target);
                }
            });
        });
        
        stats.forEach((stat) => {
            observer.observe(stat);
        });
    },

    initScrollToTop() {
        const scrollBtn = document.createElement('div');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        
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
        document.body.appendChild(scrollBtn);
        
        // Show/hide scroll button
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top functionality
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};