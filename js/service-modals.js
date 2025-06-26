// Service Modals Module
const ServiceModals = {
    modal: null,
    modalContent: null,
    closeBtn: null,

    init() {
        this.modal = document.getElementById('serviceModal');
        this.modalContent = document.getElementById('modalContent');
        this.closeBtn = document.querySelector('.close');
        
        this.bindEvents();
        this.addModalStyles();
    },

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    },

    showServiceDetails(serviceType) {
        const serviceDetails = {
            'eco-holding': {
                title: 'Eco+Holding - Services Comptables et Fiscaux',
                content: `
                    <h3>Nos services comptables et fiscaux</h3>
                    <div class="service-detail-visual">
                        <div class="chart-animation">
                            <div class="chart-bar" style="height: 60%; animation-delay: 0.2s;"></div>
                            <div class="chart-bar" style="height: 80%; animation-delay: 0.4s;"></div>
                            <div class="chart-bar" style="height: 45%; animation-delay: 0.6s;"></div>
                            <div class="chart-bar" style="height: 90%; animation-delay: 0.8s;"></div>
                            <div class="chart-bar" style="height: 70%; animation-delay: 1s;"></div>
                        </div>
                    </div>
                    <ul class="detail-list">
                        <li><i class="fas fa-calculator"></i> Tenue de comptabilité complète</li>
                        <li><i class="fas fa-chart-line"></i> Suivi fiscal et déclarations</li>
                        <li><i class="fas fa-building"></i> Création et formalités d'entreprise</li>
                        <li><i class="fas fa-handshake"></i> Conseil en gestion d'entreprise</li>
                        <li><i class="fas fa-euro-sign"></i> Recouvrement de créances</li>
                        <li><i class="fas fa-credit-card"></i> Recherche de financement</li>
                    </ul>
                    <p>Notre équipe d'experts-comptables vous accompagne dans toutes vos démarches fiscales et comptables, de la création de votre entreprise à son développement.</p>
                `
            },
            'eco-immobilier': {
                title: 'Eco+Immobilier - Services Immobiliers',
                content: `
                    <h3>Vos projets immobiliers entre nos mains</h3>
                    <div class="service-detail-visual">
                        <div class="building-animation">
                            <div class="building-3d">
                                <div class="building-face front"></div>
                                <div class="building-face back"></div>
                                <div class="building-face left"></div>
                                <div class="building-face right"></div>
                                <div class="building-face top"></div>
                            </div>
                        </div>
                    </div>
                    <ul class="detail-list">
                        <li><i class="fas fa-key"></i> Gestion locative complète</li>
                        <li><i class="fas fa-home"></i> Vente et achat immobilier</li>
                        <li><i class="fas fa-search"></i> Recherche de biens</li>
                        <li><i class="fas fa-chart-bar"></i> Évaluation immobilière</li>
                        <li><i class="fas fa-file-contract"></i> Mandat de gestion</li>
                        <li><i class="fas fa-coins"></i> Conseil en investissement</li>
                    </ul>
                    <p>Que vous soyez propriétaire, locataire ou investisseur, nous gérons votre patrimoine immobilier avec expertise et transparence.</p>
                `
            },
            'eco-trans': {
                title: 'Eco+Trans-Logistique - Transport et Logistique',
                content: `
                    <h3>Solutions de transport premium</h3>
                    <div class="service-detail-visual">
                        <div class="car-animation">
                            <div class="luxury-car">
                                <div class="car-body"></div>
                                <div class="car-wheel wheel-1"></div>
                                <div class="car-wheel wheel-2"></div>
                                <div class="car-window"></div>
                            </div>
                            <div class="road-line"></div>
                        </div>
                    </div>
                    <ul class="detail-list">
                        <li><i class="fas fa-car"></i> Services VTC premium</li>
                        <li><i class="fas fa-users"></i> Transport d'entreprise</li>
                        <li><i class="fas fa-truck"></i> Gestion de flotte véhicules</li>
                        <li><i class="fas fa-shopping-cart"></i> Vente de véhicules</li>
                        <li><i class="fas fa-route"></i> Logistique et livraison</li>
                        <li><i class="fas fa-clock"></i> Disponibilité 24h/7j</li>
                    </ul>
                    <p>Des solutions de transport sur mesure pour particuliers et entreprises, avec un service de qualité premium et une flotte moderne.</p>
                `
            }
        };
        
        if (this.modalContent && serviceDetails[serviceType]) {
            this.modalContent.innerHTML = serviceDetails[serviceType].content;
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    addModalStyles() {
        // Add CSS for animations if not already present
        if (!document.querySelector('#service-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'service-modal-styles';
            style.textContent = `
                .service-detail-visual { text-align: center; margin: 30px 0; height: 200px; display: flex; align-items: center; justify-content: center; }
                .chart-animation { display: flex; align-items: end; gap: 10px; height: 120px; }
                .chart-bar { width: 40px; background: linear-gradient(to top, var(--primary-blue), var(--secondary-pink)); border-radius: 4px 4px 0 0; animation: chartGrow 1.5s ease-out forwards; opacity: 0; }
                @keyframes chartGrow { 0% { height: 0; opacity: 0; } 100% { opacity: 1; } }
                .building-3d { width: 120px; height: 120px; position: relative; transform-style: preserve-3d; animation: buildingRotate 3s ease-in-out infinite; }
                .building-face { position: absolute; width: 120px; height: 120px; background: var(--secondary-pink); border: 2px solid var(--primary-blue); }
                .building-face.front { transform: translateZ(60px); }
                .building-face.back { transform: translateZ(-60px) rotateY(180deg); }
                .building-face.left { transform: rotateY(-90deg) translateZ(60px); }
                .building-face.right { transform: rotateY(90deg) translateZ(60px); }
                .building-face.top { transform: rotateX(90deg) translateZ(60px); background: var(--primary-blue); }
                @keyframes buildingRotate { 0%, 100% { transform: rotateY(0deg) rotateX(0deg); } 50% { transform: rotateY(180deg) rotateX(10deg); } }
                .car-animation { position: relative; width: 200px; height: 100px; }
                .luxury-car { position: relative; width: 120px; height: 50px; animation: carMove 2s ease-in-out infinite; }
                .car-body { width: 100%; height: 30px; background: linear-gradient(to right, var(--primary-blue), var(--secondary-pink)); border-radius: 15px; position: relative; top: 10px; }
                .car-wheel { width: 20px; height: 20px; background: var(--dark-gray); border-radius: 50%; position: absolute; bottom: 0; animation: wheelSpin 1s linear infinite; }
                .wheel-1 { left: 10px; } .wheel-2 { right: 10px; }
                .car-window { width: 40px; height: 15px; background: rgba(255,255,255,0.8); border-radius: 8px; position: absolute; top: 15px; left: 50%; transform: translateX(-50%); }
                .road-line { position: absolute; bottom: 10px; left: 0; right: 0; height: 2px; background: repeating-linear-gradient(to right, var(--medium-gray) 0px, var(--medium-gray) 20px, transparent 20px, transparent 40px); animation: roadMove 1s linear infinite; }
                @keyframes carMove { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(20px) scale(1.05); } }
                @keyframes wheelSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes roadMove { 0% { background-position: 0px; } 100% { background-position: 40px; } }
                .detail-list { list-style: none; padding: 0; margin: 30px 0; }
                .detail-list li { padding: 10px 0; display: flex; align-items: center; gap: 15px; border-bottom: 1px solid var(--border-color); }
                .detail-list li:last-child { border-bottom: none; }
                .detail-list i { color: var(--primary-blue); width: 20px; }
            `;
            document.head.appendChild(style);
        }
    }
};

// Make function globally available
window.showServiceDetails = (serviceType) => ServiceModals.showServiceDetails(serviceType);
