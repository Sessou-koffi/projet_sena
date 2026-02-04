<template>
    <!-- 
        Footer du site
        Contient les informations de contact, liens utiles et QR Code
    -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <!-- Logo et description -->
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="../assets/logo.png" alt="SENA & FILS" class="logo-img" />
                    </div>
                    <p class="footer-description">
                        Votre partenaire pour des solutions d'impression professionnelles 
                        au Bénin. Vente, maintenance et fournitures pour entreprises et institutions.
                    </p>
                </div>

                <!-- Liens rapides -->
                <div class="footer-links">
                    <h4>Liens rapides</h4>
                    <ul>
                        <li><a href="#solutions">Nos solutions</a></li>
                        <li><a href="#produits">Nos produits</a></li>
                        <li><a href="#processus">Comment ça marche</a></li>
                        <li><a href="#temoignages">Témoignages</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                <!-- Services -->
                <div class="footer-services">
                    <h4>Nos services</h4>
                    <ul>
                        <li>Vente d'imprimantes</li>
                        <li>Vente de copieurs</li>
                        <li>Maintenance préventive</li>
                        <li>Maintenance corrective</li>
                        <li>Fournitures et encres</li>
                        <li>Leasing</li>
                    </ul>
                </div>

                <!-- Contact -->
                <div class="footer-contact">
                    <h4>Contact</h4>
                    <ul>
                        <li>
                            <span class="contact-icon">📞</span>
                            <a href="tel:+22997559059">+229 97 55 90 59</a>
                        </li>
                        <li>
                            <span class="contact-icon"></span>
                            <a :href="whatsappUrl" target="_blank">WhatsApp</a>
                        </li>
                        <li>
                            <span class="contact-icon"></span>
                            <a href="mailto:contact@sena-print.bj">contact@sena-print.bj</a>
                        </li>
                        <li>
                            <span class="contact-icon"></span>
                            <span>Cotonou, Bénin</span>
                        </li>
                    </ul>
                </div>

                <!-- QR Code pour le terrain -->
                <div class="footer-qr">
                    <h4>Scannez-nous</h4>
                    <div class="qr-code-section">
                        <a :href="whatsappUrl" target="_blank" class="qr-code-link">
                            <img 
                                :src="qrCodeUrl" 
                                alt="QR Code WhatsApp SENA & FILS" 
                                class="qr-code-img"
                            />
                        </a>
                        <p class="qr-label">Scannez pour nous contacter sur WhatsApp</p>
                    </div>
                </div>
            </div>

            <!-- Barre de copyright -->
            <div class="footer-bottom">
                <p>&copy; {{ currentYear }} SENA Copieurs & Imprimantes. Tous droits réservés.</p>
                <div class="footer-legal">
                    <a href="#">Mentions légales</a>
                    <a href="#">Politique de confidentialité</a>
                </div>
            </div>
        </div>

        <!-- Bouton WhatsApp flottant -->
        <a 
            :href="whatsappUrl" 
            target="_blank" 
            class="whatsapp-float"
            @click="trackWhatsAppClick"
            aria-label="Contacter sur WhatsApp"
        >
            <span class="whatsapp-icon">📱</span>
            <span class="whatsapp-tooltip">Besoin d'aide ?</span>
        </a>
    </footer>
</template>

<script setup>
import { computed } from 'vue';
import { analyticsService } from '../services/api';

/**
 * Année courante pour le copyright
 */
const currentYear = new Date().getFullYear();

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappMessage = encodeURIComponent('Bonjour, j\'aimerais avoir plus d\'informations sur vos solutions d\'impression.');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * QR Code dynamique vers WhatsApp (utilise l'API gratuite qrserver.com)
 */
const qrCodeUrl = computed(() => {
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(whatsappLink)}`;
});

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = () => {
    analyticsService.trackWhatsAppClick('footer_float');
};
</script>

<style scoped>
.footer {
    background: #1a1a1a;
    color: white;
    padding-top: 80px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
    gap: 30px;
    padding-bottom: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Brand section */
.footer-brand {
    max-width: 300px;
}

.footer-logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    background-color: #DC2626;
}

.footer-logo-img {
    height: 20px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1);
}

.footer-description {
    color: #94a3b8;
    line-height: 1.7;
    font-size: 0.95rem;
    margin-bottom: 25px;
}

/* QR Code */
.footer-qr h4 {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: white;
}

.qr-code-section {
    text-align: center;
}

.qr-code-link {
    display: inline-block;
    padding: 8px;
    background: white;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.qr-code-link:hover {
    transform: scale(1.05);
}

.qr-code-img {
    width: 120px;
    height: 120px;
    display: block;
}

.qr-label {
    font-size: 0.8rem;
    margin-top: 12px;
    color: #94a3b8;
    line-height: 1.4;
}

/* Footer links */
.footer-links h4,
.footer-services h4,
.footer-contact h4 {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: white;
}

.footer-links ul,
.footer-services ul,
.footer-contact ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li,
.footer-services li,
.footer-contact li {
    margin-bottom: 12px;
}

.footer-links a,
.footer-contact a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s;
    font-size: 0.95rem;
}

.footer-links a:hover,
.footer-contact a:hover {
    color: #DC2626;
}

.footer-services li {
    color: #94a3b8;
    font-size: 0.95rem;
}

.footer-contact li {
    display: flex;
    align-items: center;
    gap: 10px;
}

.contact-icon {
    font-size: 1.1rem;
}

/* Footer bottom */
.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 0;
    color: #64748b;
    font-size: 0.9rem;
}

.footer-legal {
    display: flex;
    gap: 20px;
}

.footer-legal a {
    color: #64748b;
    text-decoration: none;
}

.footer-legal a:hover {
    color: white;
}

/* Bouton WhatsApp flottant */
.whatsapp-float {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background: #3ac751;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
    z-index: 999;
    transition: all 0.3s ease;
    text-decoration: none;
}

.whatsapp-float:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(37, 211, 102, 0.5);
}

.whatsapp-icon {
    font-size: 1.8rem;
}

.whatsapp-tooltip {
    position: absolute;
    right: 70px;
    background: white;
    color: #1a1a1a;
    padding: 8px 15px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    pointer-events: none;
}

.whatsapp-float:hover .whatsapp-tooltip {
    opacity: 1;
    transform: translateX(0);
}

.whatsapp-tooltip::after {
    content: '';
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translateY(-50%);
    border: 8px solid transparent;
    border-left-color: white;
}

/* Responsive */
@media (max-width: 968px) {
    .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: 40px 30px;
    }
    
    .footer-brand {
        grid-column: span 2;
        max-width: 100%;
        text-align: center;
    }
    
    .qr-code-section {
        display: inline-block;
    }
}

@media (max-width: 600px) {
    .footer {
        padding-top: 40px;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 30px;
    }
    
    .footer-brand {
        grid-column: span 1;
    }
    
    .footer-logo {
        justify-content: center;
    }
    
    .logo-img {
        height: 50px;
    }
    
    .footer-description {
        font-size: 0.9rem;
    }
    
    .footer-links h4,
    .footer-services h4,
    .footer-contact h4 {
        font-size: 1rem;
        margin-bottom: 15px;
    }
    
    .footer-links li,
    .footer-services li,
    .footer-contact li {
        margin-bottom: 10px;
        font-size: 0.9rem;
    }
    
    .footer-contact li {
        justify-content: center;
    }
    
    .footer-bottom {
        flex-direction: column;
        gap: 12px;
        text-align: center;
        padding: 20px 0;
    }
    
    .footer-bottom p {
        font-size: 0.8rem;
    }
    
    .footer-legal {
        flex-direction: column;
        gap: 8px;
    }
    
    .footer-legal a {
        font-size: 0.8rem;
    }
    
    .whatsapp-float {
        bottom: 15px;
        right: 15px;
        width: 50px;
        height: 50px;
    }
    
    .whatsapp-icon {
        font-size: 1.5rem;
    }
    
    .whatsapp-tooltip {
        display: none;
    }
    
    .qr-code-section {
        padding: 12px;
    }
    
    .qr-code-placeholder {
        width: 80px;
        height: 80px;
        margin: 0 auto;
    }
}

@media (max-width: 380px) {
    .footer {
        padding-top: 30px;
    }
    
    .container {
        padding: 0 15px;
    }
}
</style>
