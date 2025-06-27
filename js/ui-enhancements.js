// Module Améliorations UI
const AmeliorationsUI = {
    init() {
        this.ajouterBoutonWhatsApp();
    },

    ajouterBoutonWhatsApp() {
        const boutonWhatsapp = document.createElement('div');
        boutonWhatsapp.className = 'whatsapp-float';
        boutonWhatsapp.innerHTML = `
            <a href="https://wa.me/message/LHUEHGKHUIBHJ1?text=Bonjour, je souhaite obtenir plus d'informations sur vos services" target="_blank">
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
        
        // Ajouter les styles du bouton WhatsApp
        const style = document.createElement('style');
        style.textContent = `
            .whatsapp-float {
                position: fixed;
                width: 60px;
                height: 60px;
                bottom: 30px;
                right: 30px;
                background-color: #25d366;
                color: white;
                border-radius: 50px;
                text-align: center;
                font-size: 24px;
                box-shadow: 2px 2px 3px #999;
                z-index: 1000;
                animation: pulse 2s infinite;
                transition: var(--transition-fast);
            }
            
            .whatsapp-float:hover {
                transform: scale(1.1);
            }
            
            .whatsapp-float a {
                color: white;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
                100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
            }
            
            @media (max-width: 768px) {
                .whatsapp-float {
                    width: 50px;
                    height: 50px;
                    font-size: 20px;
                    bottom: 20px;
                    right: 20px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(boutonWhatsapp);
    }
};