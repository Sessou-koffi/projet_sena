<template>
    <!-- 
        Page d'accueil principale - Landing page B2B
        Assemblage de toutes les sections du cahier de charges
    -->
    <div class="home-page">
        <!-- Hero Section -->
        <HeroSection />
        
        <!-- Section Problèmes clients -->
        <ProblemsSection />
        
        <!-- Section Solution proposée -->
        <SolutionSection />
        
        <!-- Section Offres commerciales -->
        <OffersSection @open-devis-modal="openDevisModal" />
        
        <!-- Section Catalogue Produits -->
        <ProductsSection />
        
        <!-- Section Clients de confiance + Témoignages (désactivée) -->
        <!-- <TrustSection /> -->
        
        <!-- Section Processus -->
        <ProcessSection />
        
        <!-- Section Contact / Formulaire -->
        <ContactSection />
    </div>
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue';
import ProblemsSection from '../components/ProblemsSection.vue';
import SolutionSection from '../components/SolutionSection.vue';
import OffersSection from '../components/OffersSection.vue';
import ProductsSection from '../components/ProductsSection.vue';
// import TrustSection from '../components/TrustSection.vue';
import ProcessSection from '../components/ProcessSection.vue';
import ContactSection from '../components/ContactSection.vue';

/**
 * Gestion de l'ouverture du modal de devis
 * @param {string} type - Type de produit (imprimante, copieur, maintenance)
 */
const openDevisModal = (type) => {
    // Scroll vers la section contact avec le type pré-sélectionné
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Sélectionner le type de besoin si possible
        setTimeout(() => {
            const selectBesoin = document.getElementById('besoin');
            if (selectBesoin) {
                selectBesoin.value = type;
                selectBesoin.dispatchEvent(new Event('change'));
            }
        }, 500);
    }
};
</script>

<style scoped>
.home-page {
    min-height: 100vh;
}
</style>
