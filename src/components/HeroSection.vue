<template>
    <!-- 
        Section Hero - Premier écran visible
        Objectif: Capter l'attention + proposer une solution claire
    -->
    <section class="hero">
        <!-- Background avec overlay -->
        <div class="hero-background">
            <div class="hero-overlay"></div>
        </div>

        <div class="container">
            <div class="hero-content">
                <!-- Texte principal -->
                <div class="hero-text">
                    <h1 class="hero-title">
                        Optimisez vos coûts d'impression avec des 
                        <span class="highlight">copieurs et imprimantes professionnels</span> 
                        fiables et adaptés à votre volume réel.
                    </h1>
                    
                    <p class="hero-subtitle">
                        Solutions adaptées aux entreprises, institutions et PME au Bénin
                    </p>

                    <!-- Points forts -->
                    <div class="hero-features">
                        <span class="feature-badge"> Vente</span>
                        <span class="feature-badge"> Maintenance</span>
                        <span class="feature-badge"> Leasing</span>
                        <span class="feature-badge"> Fourniture</span>
                        <span class="feature-badge"> Encres</span>
                    </div>

                    <!-- Bouton CTA principal -->
                    <div class="hero-cta">
                        <a 
                            :href="whatsappUrl" 
                            target="_blank" 
                            class="btn btn-primary btn-large"
                            @click="handleCtaClick"
                        >
                            Demander un devis gratuit sur WhatsApp
                        </a>
                        
                        <a href="#contact" class="btn btn-secondary">
                            Remplir le formulaire
                        </a>
                    </div>
                </div>

                <!-- Slider d'images de produits -->
                <div class="hero-slider">
                    <div class="slider-container">
                        <transition-group name="slide" tag="div" class="slides">
                            <div 
                                v-for="(image, index) in sliderImages" 
                                :key="index"
                                v-show="currentSlide === index"
                                class="slide"
                            >
                                <img :src="image.src" :alt="image.alt" />
                                <p class="slide-caption">{{ image.caption }}</p>
                            </div>
                        </transition-group>

                        <!-- Indicateurs de slide -->
                        <div class="slider-dots">
                            <button 
                                v-for="(_, index) in sliderImages" 
                                :key="index"
                                :class="['dot', { active: currentSlide === index }]"
                                @click="goToSlide(index)"
                                :aria-label="`Slide ${index + 1}`"
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scroll indicator - Cliquable -->
        <a href="#catalogue" class="scroll-indicator" @click.prevent="scrollToCatalogue">
            <span>Découvrir notre catalogue</span>
            <div class="scroll-arrow">↓</div>
        </a>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { analyticsService } from '../services/api';

// Import des images produits (format carré)
import img2525AC from '../assets/TOSHIBA_STUDIO_2525_couleur.png';
import img2528A from '../assets/TOSHIBA_STUDIO_2528_A.png';
import img2508A from '../assets/TOSHIBA_STUDIO_2508_A.png';
import img2518A from '../assets/TOSHIBA_STUDIO_2518_A.png';
import imgB235 from '../assets/XEROW_B_235.png';
import imgB400 from '../assets/XEROX_B400.png';
import img409AS from '../assets/Toshiba_E_STUDIO_409AS.png';
import img409CS from '../assets/Toshiba_E_STUDIO_409CS.png';
import img339CS from '../assets/Toshiba_E_STUDIO_339CS.png';

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappMessage = encodeURIComponent('Bonjour, je souhaite obtenir un devis pour des solutions d\'impression professionnelles.');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Scroll vers la section Catalogue
 */
const scrollToCatalogue = () => {
    const section = document.getElementById('catalogue');
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

/**
 * Images du slider - Produits réels
 */
const sliderImages = ref([
    {
        src: img2525AC,
        alt: 'TOSHIBA e-STUDIO 2525AC',
        caption: 'TOSHIBA e-STUDIO 2525AC - Copieur couleur A3/A4'
    },
    {
        src: img2528A,
        alt: 'TOSHIBA e-STUDIO 2528A',
        caption: 'TOSHIBA e-STUDIO 2528A - Copieur monochrome A3'
    },
    {
        src: img2508A,
        alt: 'TOSHIBA e-STUDIO 2508A',
        caption: 'TOSHIBA e-STUDIO 2508A - Copieur monochrome A3/A4'
    },
    {
        src: img2518A,
        alt: 'TOSHIBA e-STUDIO 2518A',
        caption: 'TOSHIBA e-STUDIO 2518A - Copieur multifonction A3'
    },
    {
        src: imgB235,
        alt: 'XEROX B235',
        caption: 'XEROX B235 - Imprimante multifonction A4'
    },
    {
        src: imgB400,
        alt: 'XEROX B400',
        caption: 'XEROX B400 - Imprimante haute performance A4'
    },
    {
        src: img409AS,
        alt: 'TOSHIBA e-STUDIO 409AS',
        caption: 'TOSHIBA e-STUDIO 409AS - Multifonction monochrome A4'
    },
    {
        src: img409CS,
        alt: 'TOSHIBA e-STUDIO 409CS',
        caption: 'TOSHIBA e-STUDIO 409CS - Multifonction couleur A4'
    },
    {
        src: img339CS,
        alt: 'TOSHIBA e-STUDIO 339CS',
        caption: 'TOSHIBA e-STUDIO 339CS - Multifonction couleur A4'
    }
]);

// État du slider
const currentSlide = ref(0);
let slideInterval = null;

/**
 * Navigation du slider
 */
const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % sliderImages.value.length;
};

const goToSlide = (index) => {
    currentSlide.value = index;
};

/**
 * Démarrer l'autoplay du slider
 */
const startAutoplay = () => {
    slideInterval = setInterval(nextSlide, 4000);
};

/**
 * Arrêter l'autoplay
 */
const stopAutoplay = () => {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
};

/**
 * Tracker le clic sur le CTA
 */
const handleCtaClick = () => {
    analyticsService.trackWhatsAppClick('hero');
    analyticsService.trackCtaClick('hero_whatsapp', 'hero');
};

// Lifecycle
onMounted(() => {
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
});
</script>

<style scoped>
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 70px;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #DC2626 100%);
    z-index: -2;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
}

.hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

/* Texte Hero */
.hero-text {
    color: white;
}

.hero-title {
    font-size: 2.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
}

.highlight {
    color: #DC2626;
    background: linear-gradient(180deg, transparent 60%, rgba(220, 38, 38, 0.3) 60%);
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 25px;
    line-height: 1.6;
}

/* Badges de fonctionnalités */
.hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 35px;
}

.feature-badge {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Boutons CTA */
.hero-cta {
    display: flex;
    flex-wrap: nowrap;
    gap: 15px;
    align-items: center;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-large {
    padding: 18px 32px;
    font-size: 1.1rem;
}

.btn-primary {
    background: #eb3f3fd3;
    color: white;
    box-shadow: 0 4px 15px rgba(216, 102, 74, 0.3);
}

.btn-primary:hover {
    background: #9e3232;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
}

.btn-icon {
    font-size: 1.3rem;
}

/* Slider */
.hero-slider {
    position: relative;
}

.slider-container {
    position: relative;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.slides {
    position: relative;
    aspect-ratio: 1 / 1;
    max-height: 400px;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.slide img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #ffffff;
    padding: 15px;
}

.slide-caption {
    padding: 20px;
    text-align: center;
    font-weight: 500;
    color: #1a1a1a;
    background: white;
}

.slider-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 15px;
    background: white;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e0e0e0;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.dot.active {
    background: #DC2626;
    transform: scale(1.2);
}

/* Animation slide */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* Scroll indicator - Cliquable */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: white;
    opacity: 0.7;
    animation: bounce 2s infinite;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
    opacity: 1;
}

.scroll-indicator span {
    font-size: 0.85rem;
    display: block;
    margin-bottom: 5px;
}

.scroll-arrow {
    font-size: 1.5rem;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-10px);
    }
    60% {
        transform: translateX(-50%) translateY(-5px);
    }
}

/* Responsive - Tablettes et mobiles */
@media (max-width: 1024px) {
    .hero-content {
        gap: 40px;
    }
    
    .hero-title {
        font-size: 2.25rem;
    }
}

@media (max-width: 968px) {
    .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-features {
        justify-content: center;
    }
    
    .hero-cta {
        justify-content: center;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .btn {
        width: 100%;
    }
    
    .hero-slider {
        max-width: 500px;
        margin: 0 auto;
        width: 100%;
    }
    
    .slides {
        aspect-ratio: 1 / 1;
        max-height: 350px;
    }
    
    .slide img {
        padding: 15px;
    }
}

@media (max-width: 600px) {
    .hero {
        padding-top: 70px;
        min-height: auto;
        padding-bottom: 60px;
    }
    
    .hero-content {
        gap: 25px;
    }
    
    .hero-title {
        font-size: 1.5rem;
        line-height: 1.35;
    }
    
    .hero-subtitle {
        font-size: 0.95rem;
        margin-bottom: 18px;
    }
    
    .btn {
        width: 100%;
        padding: 14px 20px;
        font-size: 0.95rem;
    }
    
    .btn-large {
        padding: 14px 20px;
        font-size: 0.95rem;
    }
    
    .hero-cta {
        width: 100%;
        max-width: 100%;
        gap: 12px;
        padding: 0 5px;
    }
    
    .feature-badge {
        font-size: 0.75rem;
        padding: 6px 12px;
    }
    
    .hero-slider {
        max-width: 100%;
        margin: 0;
    }
    
    .slider-container {
        border-radius: 12px;
    }
    
    .slides {
        aspect-ratio: 1 / 1;
        max-height: 280px;
    }
    
    .slide img {
        object-fit: contain;
        background: #ffffff;
        padding: 12px;
    }
    
    .slide-caption {
        padding: 12px;
        font-size: 0.85rem;
    }
    
    .slider-dots {
        padding: 10px;
        gap: 8px;
    }
    
    .dot {
        width: 10px;
        height: 10px;
    }
    
    .scroll-indicator {
        display: none;
    }
    
    .container {
        padding: 0 15px;
    }
}

@media (max-width: 480px) {
    .hero {
        padding-top: 65px;
    }
    
    .hero-title {
        font-size: 1.35rem;
    }
    
    .hero-subtitle {
        font-size: 0.9rem;
    }
    
    .hero-features {
        gap: 8px;
    }
    
    .feature-badge {
        font-size: 0.7rem;
        padding: 5px 10px;
    }
}

@media (max-width: 380px) {
    .hero {
        padding-top: 60px;
    }
    
    .hero-title {
        font-size: 1.2rem;
    }
    
    .hero-features {
        gap: 6px;
    }
    
    .feature-badge {
        font-size: 0.65rem;
        padding: 4px 8px;
    }
    
    .slides {
        aspect-ratio: 1 / 1;
        max-height: 220px;
    }
    
    .slide img {
        padding: 10px;
    }
    
    .container {
        padding: 0 12px;
    }
}
</style>
