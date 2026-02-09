<template>
    <!-- 
        Composant Header - Barre de navigation fixe
        Affiche le logo, les liens de navigation et le bouton CTA WhatsApp
    -->
    <header class="header" :class="{ 'scrolled': isScrolled }">
        <div class="container">
            <div class="header-content">
                <!-- Logo et nom de l'entreprise -->
                <router-link to="/" class="logo">
                    <img src="../assets/logo.png" alt="SENA & FILS" class="logo-img" />
                     <span class="logo-text">
                        <strong>SENA & FILS</strong> <br/>
                        <small>Copieurs & Imprimantes</small>
                    </span> 
                </router-link>

                <!-- Navigation desktop -->
                <nav class="nav-desktop">
                    <router-link to="/#solutions" class="nav-link" @click="scrollToSection('solutions')">Solutions</router-link>
                    <router-link to="/#catalogue" class="nav-link" @click="scrollToSection('catalogue')">Catalogue</router-link>
                    <router-link to="/#processus" class="nav-link" @click="scrollToSection('processus')">Comment ça marche</router-link>
                    <router-link to="/#contact" class="nav-link" @click="scrollToSection('contact')">Contact</router-link>
                </nav>

                <!-- Bouton CTA WhatsApp -->
                <a 
                    :href="whatsappUrl" 
                    target="_blank" 
                    class="btn btn-whatsapp"
                    @click="trackWhatsAppClick"
                >
                    <span class="whatsapp-icon"></span>
                    <span class="btn-text">Contactez-nous</span>
                </a>

                <!-- Menu hamburger mobile -->
                <button class="menu-toggle" @click="toggleMobileMenu" aria-label="Menu">
                    <span class="hamburger" :class="{ 'active': isMobileMenuOpen }"></span>
                </button>
            </div>
        </div>

        <!-- Menu mobile -->
        <transition name="slide">
            <nav v-if="isMobileMenuOpen" class="nav-mobile">
                <router-link to="/#solutions" class="nav-link" @click="scrollToSection('solutions')">Solutions</router-link>
                <router-link to="/#catalogue" class="nav-link" @click="scrollToSection('catalogue')">Catalogue</router-link>
                <router-link to="/#processus" class="nav-link" @click="scrollToSection('processus')">Comment ça marche</router-link>
                <router-link to="/#contact" class="nav-link" @click="scrollToSection('contact')">Contact</router-link>
                <a 
                    :href="whatsappUrl" 
                    target="_blank" 
                    class="btn btn-whatsapp-mobile"
                    @click="trackWhatsAppClick"
                >
                     Contacter sur WhatsApp
                </a>
            </nav>
        </transition>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { analyticsService } from '../services/api';

const router = useRouter();
const route = useRoute();

/**
 * Configuration WhatsApp
 * Numéro pour les redirections WhatsApp
 */
const whatsappNumber = '22997559059'; // Numéro au format international sans +
const whatsappMessage = encodeURIComponent('Bonjour, je suis intéressé par vos solutions d\'impression professionnelles. Pouvez-vous me rappeler ?');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

// État du composant
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

/**
 * Gestion du scroll pour le header fixe
 */
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

/**
 * Scroll vers une section de la page d'accueil
 * Gère la navigation depuis n'importe quelle page
 */
const scrollToSection = (sectionId) => {
    closeMobileMenu();
    
    // Si on est déjà sur la page d'accueil, scroll direct
    if (route.path === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    } else {
        // Si on est sur une autre page, naviguer vers l'accueil puis scroll
        router.push('/').then(() => {
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });
    }
};

/**
 * Toggle du menu mobile
 */
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
    // Empêcher le scroll du body quand le menu est ouvert
    document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : '';
};

/**
 * Fermer le menu mobile
 */
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
    document.body.style.overflow = '';
};

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = () => {
    analyticsService.trackWhatsAppClick('header');
    closeMobileMenu();
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.body.style.overflow = '';
});
</script>

<style scoped>
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border-bottom: 1px solid transparent;
}

.header.scrolled {
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e0e0e0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

/* Logo */
.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
}

.logo-img {
    height: 70px;
    width: auto;
    object-fit: contain;
}

/* Navigation desktop */
.nav-desktop {
    display: flex;
    align-items: center;
    gap: 30px;
}

.nav-link {
    color: #1a1a1a;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s;
    position: relative;
}

.nav-link:hover {
    color: #DC2626;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: #DC2626;
    transition: width 0.3s;
}

.nav-link:hover::after {
    width: 100%;
}

/* Bouton WhatsApp */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-whatsapp {
    background: #971f3d;
    color: white;
}

.btn-whatsapp:hover {
    background: #d44641;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.whatsapp-icon {
    font-size: 1.2rem;
}

/* Menu hamburger - Style professionnel et bien aligné */
.menu-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 12px;
    z-index: 1001;
    width: 48px;
    height: 48px;
    border-radius: 8px;
    transition: background 0.2s ease;
}

.menu-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
}

.menu-toggle:active {
    background: rgba(0, 0, 0, 0.1);
}

.hamburger {
    display: block;
    width: 24px;
    height: 2px;
    background: #1a1a1a;
    position: relative;
    transition: background 0.3s ease;
    border-radius: 2px;
}

.hamburger::before,
.hamburger::after {
    content: '';
    position: absolute;
    left: 0;
    width: 24px;
    height: 2px;
    background: #1a1a1a;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.hamburger::before {
    top: -7px;
}

.hamburger::after {
    bottom: -7px;
}

.hamburger.active {
    background: transparent;
}

.hamburger.active::before {
    top: 0;
    transform: rotate(45deg);
}

.hamburger.active::after {
    bottom: 0;
    transform: rotate(-45deg);
}

/* Navigation mobile */
.nav-mobile {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 10px;
    overflow-y: auto;
}

.nav-mobile .nav-link {
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    font-size: 1.1rem;
}

.nav-mobile .nav-link:hover {
    background: #f1f5f9;
}

.btn-whatsapp-mobile {
    margin-top: 20px;
    padding: 15px;
    background: #25d366;
    color: white;
    text-align: center;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

/* Responsive - Breakpoints professionnels */
@media (max-width: 1024px) {
    .nav-desktop {
        gap: 20px;
    }
    
    .nav-link {
        font-size: 0.9rem;
    }
}

@media (max-width: 968px) {
    .nav-desktop {
        display: none;
    }
    
    .btn-whatsapp {
        display: none;
    }
    
    .menu-toggle {
        display: flex;
    }
    
    .logo-img {
        height: 55px;
    }
    
    .header-content {
        gap: 10px;
    }
}

@media (max-width: 600px) {
    .header-content {
        height: 60px;
        padding: 0;
    }
    
    .logo-img {
        height: 48px;
    }
    
    .logo-text {
        display: none;
    }
    
    .nav-mobile {
        top: 60px;
        padding: 20px 15px;
    }
    
    .nav-mobile .nav-link {
        padding: 14px 16px;
        font-size: 1rem;
        border-radius: 10px;
        background: #f8fafc;
        margin-bottom: 8px;
    }
    
    .nav-mobile .nav-link:hover,
    .nav-mobile .nav-link:active {
        background: #e2e8f0;
    }
    
    .btn-whatsapp-mobile {
        margin-top: 15px;
        padding: 16px;
        font-size: 1rem;
        border-radius: 10px;
    }
    
    .container {
        padding: 0 12px;
    }
    
    .menu-toggle {
        width: 44px;
        height: 44px;
        padding: 10px;
    }
}

@media (max-width: 380px) {
    .header-content {
        height: 56px;
    }
    
    .logo-img {
        height: 42px;
    }
    
    .nav-mobile {
        top: 56px;
    }
    
    .menu-toggle {
        width: 40px;
        height: 40px;
        padding: 8px;
    }
    
    .hamburger {
        width: 20px;
    }
    
    .hamburger::before,
    .hamburger::after {
        width: 20px;
    }
    
    .container {
        padding: 0 10px;
    }
}
</style>
