<template>
    <!-- 
        Page de détail d'un produit
        Affiche toutes les caractéristiques et permet de demander un devis
    -->
    <div class="product-detail-page">
        <!-- Loader -->
        <div class="loading-state" v-if="loading">
            <div class="loader"></div>
            <p>Chargement du produit...</p>
        </div>

        <!-- Contenu principal -->
        <template v-if="!loading && produit">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <div class="container">
                    <router-link to="/">Accueil</router-link>
                    <span>/</span>
                    <router-link to="/showroom">Showroom</router-link>
                    <span>/</span>
                    <span class="current">{{ produit.nom }}</span>
                </div>
            </div>

            <!-- Contenu produit -->
            <div class="container">
                <div class="product-content">
                    <!-- Galerie d'images -->
                    <div class="product-gallery">
                        <div class="main-image">
                            <img 
                                :src="currentImage || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(produit.nom)" 
                                :alt="produit.nom"
                            />
                            <span 
                                v-if="produit.disponible_showroom" 
                                class="showroom-badge"
                            >
                                ✓ Disponible en showroom
                            </span>
                        </div>
                        
                        <!-- Miniatures si galerie disponible -->
                        <div class="gallery-thumbnails" v-if="produit.images_galerie?.length > 0">
                            <button 
                                v-for="(img, index) in [produit.image_url, ...produit.images_galerie]" 
                                :key="index"
                                :class="['thumbnail', { active: currentImage === img }]"
                                @click="currentImage = img"
                            >
                                <img :src="img" :alt="`${produit.nom} - image ${index + 1}`" />
                            </button>
                        </div>
                    </div>

                    <!-- Informations produit -->
                    <div class="product-info">
                        <div class="product-header">
                            <span class="product-brand">{{ produit.marque }}</span>
                            <h1 class="product-name">{{ produit.nom }}</h1>
                            <div class="product-badges">
                                <span class="badge" :class="produit.categorie">
                                    {{ produit.categorie === 'imprimante' ? '🖨️ Imprimante' : '📠 Copieur' }}
                                </span>
                                <span class="badge volume">
                                    {{ getVolumeLabel(produit.volume) }}
                                </span>
                            </div>
                        </div>

                        <div class="product-price">
                            {{ produit.prix_formate }}
                        </div>

                        <p class="product-description">
                            {{ produit.description }}
                        </p>

                        <!-- Actions principales -->
                        <div class="product-actions">
                            <a 
                                :href="whatsappUrl" 
                                target="_blank" 
                                class="btn btn-whatsapp btn-large"
                                @click="trackWhatsAppClick"
                            >
                                <span>📱</span>
                                Demander un devis sur WhatsApp
                            </a>
                            
                            <button 
                                v-if="produit.fiche_technique" 
                                class="btn btn-outline btn-large"
                                @click="downloadFiche"
                            >
                                <span>📄</span>
                                Télécharger la fiche technique
                            </button>
                        </div>

                        <!-- Caractéristiques techniques -->
                        <div class="product-specs" v-if="caracteristiques">
                            <h3>Caractéristiques techniques</h3>
                            <table class="specs-table">
                                <tbody>
                                    <tr v-for="(value, key) in caracteristiques" :key="key">
                                        <td class="spec-label">{{ key }}</td>
                                        <td class="spec-value">{{ value }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Contact rapide -->
                        <div class="quick-contact">
                            <h4>Besoin d'aide ?</h4>
                            <p>Nos conseillers sont disponibles pour vous accompagner</p>
                            <div class="contact-options">
                                <a href="tel:+22990000000" class="contact-option">
                                    <span class="icon">📞</span>
                                    <span>+229 90 00 00 00</span>
                                </a>
                                <a :href="whatsappUrl" target="_blank" class="contact-option">
                                    <span class="icon">💬</span>
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA final -->
            <div class="page-cta">
                <div class="container">
                    <h3>Intéressé par ce produit ?</h3>
                    <p>Obtenez un devis personnalisé et gratuit en quelques minutes</p>
                    <a :href="whatsappUrl" target="_blank" class="btn btn-whatsapp btn-large">
                        📱 Demander mon devis gratuit
                    </a>
                </div>
            </div>
        </template>

        <!-- Produit non trouvé -->
        <div class="not-found" v-if="!loading && !produit">
            <div class="container">
                <div class="not-found-content">
                    <div class="not-found-icon">🔍</div>
                    <h2>Produit non trouvé</h2>
                    <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
                    <router-link to="/showroom" class="btn btn-primary">
                        Voir tous les produits
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { produitService, analyticsService } from '../services/api';

const route = useRoute();

/**
 * État des données
 */
const produit = ref(null);
const loading = ref(true);
const currentImage = ref(null);

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22990000000';
const whatsappUrl = computed(() => {
    if (!produit.value) return '#';
    const message = encodeURIComponent(
        `Bonjour, je suis intéressé par le produit "${produit.value.nom}" (${produit.value.marque}). Pouvez-vous me faire un devis personnalisé ?`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
});

/**
 * Parser les caractéristiques
 */
const caracteristiques = computed(() => {
    if (!produit.value?.caracteristiques) return null;
    
    if (typeof produit.value.caracteristiques === 'string') {
        try {
            return JSON.parse(produit.value.caracteristiques);
        } catch (e) {
            return null;
        }
    }
    return produit.value.caracteristiques;
});

/**
 * Charger le produit
 */
const loadProduit = async () => {
    loading.value = true;
    const slug = route.params.slug;
    
    try {
        const response = await produitService.getBySlug(slug);
        if (response.success) {
            produit.value = response.data;
            currentImage.value = response.data.image_url;
            
            // Mettre à jour le titre de la page
            document.title = `${response.data.nom} - SENA Copieurs & Imprimantes`;
        }
    } catch (error) {
        console.error('Erreur chargement produit:', error);
        produit.value = null;
    } finally {
        loading.value = false;
    }
};

/**
 * Obtenir le label du volume
 */
const getVolumeLabel = (volume) => {
    const labels = {
        'petit': 'Petit volume',
        'moyen': 'Moyen volume',
        'grand': 'Grand volume'
    };
    return labels[volume] || volume;
};

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = () => {
    analyticsService.trackWhatsAppClick('product_detail');
    analyticsService.trackCtaClick('whatsapp_produit_detail', 'product_detail');
};

/**
 * Télécharger la fiche technique
 */
const downloadFiche = () => {
    if (produit.value?.id) {
        analyticsService.trackFicheDownload(produit.value.id);
    }
    if (produit.value?.fiche_technique_url) {
        window.open(produit.value.fiche_technique_url, '_blank');
    }
};

// Charger le produit au montage et quand la route change
onMounted(loadProduit);
watch(() => route.params.slug, loadProduit);
</script>

<style scoped>
.product-detail-page {
    padding-top: 70px;
    min-height: 100vh;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Breadcrumb */
.breadcrumb {
    background: white;
    padding: 15px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 40px;
}

.breadcrumb a {
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb a:hover {
    color: #2563eb;
}

.breadcrumb span {
    color: #94a3b8;
    margin: 0 10px;
}

.breadcrumb .current {
    color: #1a365d;
    font-weight: 500;
}

/* Contenu produit */
.product-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-bottom: 60px;
}

/* Galerie */
.product-gallery {
    position: sticky;
    top: 90px;
}

.main-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
}

.showroom-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #22c55e;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.gallery-thumbnails {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.thumbnail {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    border: 3px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    background: none;
}

.thumbnail.active {
    border-color: #2563eb;
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Informations produit */
.product-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.product-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-brand {
    font-size: 0.9rem;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.product-name {
    font-size: 2rem;
    color: #1a365d;
    font-weight: 700;
    margin: 0;
}

.product-badges {
    display: flex;
    gap: 10px;
}

.badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.badge.imprimante {
    background: #f3e8ff;
    color: #7c3aed;
}

.badge.copieur {
    background: #dbeafe;
    color: #2563eb;
}

.badge.volume {
    background: #f1f5f9;
    color: #475569;
}

.product-price {
    font-size: 2rem;
    font-weight: 700;
    color: #2563eb;
}

.product-description {
    color: #475569;
    line-height: 1.8;
    font-size: 1.05rem;
}

/* Actions */
.product-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 28px;
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

.btn-whatsapp {
    background: #25d366;
    color: white;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp:hover {
    background: #128c7e;
    transform: translateY(-2px);
}

.btn-outline {
    background: white;
    color: #2563eb;
    border: 2px solid #2563eb;
}

.btn-outline:hover {
    background: #2563eb;
    color: white;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-primary:hover {
    background: #1d4ed8;
}

/* Caractéristiques */
.product-specs {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.product-specs h3 {
    font-size: 1.25rem;
    color: #1a365d;
    margin-bottom: 20px;
}

.specs-table {
    width: 100%;
    border-collapse: collapse;
}

.specs-table tr {
    border-bottom: 1px solid #f1f5f9;
}

.specs-table tr:last-child {
    border-bottom: none;
}

.specs-table td {
    padding: 12px 0;
}

.spec-label {
    color: #64748b;
    font-weight: 500;
    width: 40%;
}

.spec-value {
    color: #1a365d;
    font-weight: 600;
}

/* Contact rapide */
.quick-contact {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border-radius: 15px;
    padding: 25px;
}

.quick-contact h4 {
    color: #1a365d;
    margin-bottom: 5px;
}

.quick-contact p {
    color: #64748b;
    margin-bottom: 20px;
    font-size: 0.95rem;
}

.contact-options {
    display: flex;
    gap: 15px;
}

.contact-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: white;
    border-radius: 8px;
    color: #1a365d;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.contact-option:hover {
    background: #2563eb;
    color: white;
}

.contact-option .icon {
    font-size: 1.2rem;
}

/* CTA final */
.page-cta {
    background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
    margin-bottom: 0;
}

.page-cta h3 {
    font-size: 1.75rem;
    margin-bottom: 10px;
}

.page-cta p {
    opacity: 0.9;
    margin-bottom: 25px;
}

/* États */
.loading-state,
.not-found {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.loader {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.not-found-content {
    text-align: center;
    padding: 40px;
}

.not-found-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.not-found-content h2 {
    font-size: 1.75rem;
    color: #1a365d;
    margin-bottom: 10px;
}

.not-found-content p {
    color: #64748b;
    margin-bottom: 25px;
}

/* Responsive */
@media (max-width: 968px) {
    .product-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .product-gallery {
        position: static;
    }
    
    .main-image img {
        height: 350px;
    }
}

@media (max-width: 600px) {
    .product-name {
        font-size: 1.5rem;
    }
    
    .product-price {
        font-size: 1.5rem;
    }
    
    .main-image img {
        height: 280px;
    }
    
    .contact-options {
        flex-direction: column;
    }
    
    .page-cta h3 {
        font-size: 1.5rem;
    }
}
</style>
