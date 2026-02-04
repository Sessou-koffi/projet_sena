<template>
    <!-- 
        Page Showroom - Liste de tous les produits disponibles
        Avec filtres par catégorie et indication de disponibilité showroom
    -->
    <div class="showroom-page">
        <!-- Header de la page -->
        <div class="page-header">
            <div class="container">
                <h1 class="page-title">Notre Showroom</h1>
                <p class="page-subtitle">
                    Découvrez notre sélection de copieurs et imprimantes professionnels
                </p>
            </div>
        </div>

        <!-- Contenu principal -->
        <div class="container">
            <!-- Filtres -->
            <div class="filters-bar">
                <div class="filter-group">
                    <label>Catégorie :</label>
                    <div class="filter-buttons">
                        <button 
                            :class="['filter-btn', { active: activeFilter === 'all' }]"
                            @click="filterBy('all')"
                        >
                            Tous
                        </button>
                        <button 
                            :class="['filter-btn', { active: activeFilter === 'imprimante' }]"
                            @click="filterBy('imprimante')"
                        >
                            🖨️ Imprimantes
                        </button>
                        <button 
                            :class="['filter-btn', { active: activeFilter === 'copieur' }]"
                            @click="filterBy('copieur')"
                        >
                            📠 Copieurs
                        </button>
                    </div>
                </div>

                <div class="filter-group">
                    <label>
                        <input 
                            type="checkbox" 
                            v-model="showOnlyShowroom"
                        />
                        Disponible en showroom uniquement
                    </label>
                </div>
            </div>

            <!-- Grille de produits -->
            <div class="products-grid" v-if="!loading && filteredProduits.length > 0">
                <div 
                    class="product-card" 
                    v-for="produit in filteredProduits" 
                    :key="produit.id"
                >
                    <div class="product-image">
                        <img 
                            :src="produit.image_url || 'https://via.placeholder.com/400x300?text=' + encodeURIComponent(produit.nom)" 
                            :alt="produit.nom"
                        />
                        <div class="product-badges">
                            <span 
                                class="badge category-badge" 
                                :class="produit.categorie"
                            >
                                {{ produit.categorie === 'imprimante' ? 'Imprimante' : 'Copieur' }}
                            </span>
                            <span 
                                class="badge volume-badge"
                            >
                                {{ getVolumeLabel(produit.volume) }}
                            </span>
                        </div>
                        <span 
                            v-if="produit.disponible_showroom" 
                            class="showroom-ribbon"
                        >
                            ✓ En showroom
                        </span>
                    </div>

                    <div class="product-content">
                        <div class="product-header">
                            <span class="product-brand">{{ produit.marque }}</span>
                            <h3 class="product-name">{{ produit.nom }}</h3>
                        </div>

                        <p class="product-description">{{ truncateText(produit.description, 120) }}</p>

                        <!-- Caractéristiques principales -->
                        <div class="product-specs" v-if="produit.caracteristiques">
                            <div 
                                class="spec-item" 
                                v-for="(value, key) in getMainSpecs(produit.caracteristiques)" 
                                :key="key"
                            >
                                <span class="spec-label">{{ key }}:</span>
                                <span class="spec-value">{{ value }}</span>
                            </div>
                        </div>

                        <div class="product-footer">
                            <div class="product-price">
                                {{ produit.prix_formate }}
                            </div>
                            
                            <div class="product-actions">
                                <router-link 
                                    :to="`/produit/${produit.slug}`" 
                                    class="btn btn-outline"
                                >
                                    Voir détails
                                </router-link>
                                <button 
                                    v-if="produit.fiche_technique" 
                                    class="btn btn-secondary"
                                    @click="downloadFiche(produit)"
                                >
                                    📄 Fiche
                                </button>
                                <a 
                                    :href="getWhatsappUrl(produit)" 
                                    target="_blank" 
                                    class="btn btn-primary"
                                    @click="trackWhatsAppClick(produit)"
                                >
                                    💬 Devis
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- État de chargement -->
            <div class="loading-state" v-if="loading">
                <div class="loader"></div>
                <p>Chargement des produits...</p>
            </div>

            <!-- État vide -->
            <div class="empty-state" v-if="!loading && filteredProduits.length === 0">
                <div class="empty-icon">📦</div>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres ou contactez-nous pour vos besoins spécifiques.</p>
                <a :href="whatsappUrl" target="_blank" class="btn btn-primary">
                    💬 Nous contacter
                </a>
            </div>

            <!-- CTA final -->
            <div class="page-cta" v-if="!loading && filteredProduits.length > 0">
                <h3>Vous ne trouvez pas ce que vous cherchez ?</h3>
                <p>Contactez-nous pour une recommandation personnalisée</p>
                <a :href="whatsappUrl" target="_blank" class="btn btn-whatsapp btn-large">
                    📱 Parler à un conseiller
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { produitService, analyticsService } from '../services/api';

/**
 * État des données
 */
const produits = ref([]);
const loading = ref(true);
const activeFilter = ref('all');
const showOnlyShowroom = ref(false);

/**
 * Configuration WhatsApp générale
 */
const whatsappNumber = '22990536593';
const whatsappMessage = encodeURIComponent('Bonjour, je visite votre showroom en ligne et j\'aimerais plus d\'informations.');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Produits filtrés
 */
const filteredProduits = computed(() => {
    let result = produits.value;
    
    // Filtrer par catégorie
    if (activeFilter.value !== 'all') {
        result = result.filter(p => p.categorie === activeFilter.value);
    }
    
    // Filtrer par disponibilité showroom
    if (showOnlyShowroom.value) {
        result = result.filter(p => p.disponible_showroom);
    }
    
    return result;
});

/**
 * Charger les produits
 */
const loadProduits = async () => {
    loading.value = true;
    try {
        const response = await produitService.getAll();
        if (response.success) {
            produits.value = response.data;
        }
    } catch (error) {
        console.error('Erreur chargement produits:', error);
    } finally {
        loading.value = false;
    }
};

/**
 * Filtrer par catégorie
 */
const filterBy = (category) => {
    activeFilter.value = category;
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
 * Tronquer le texte
 */
const truncateText = (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Obtenir les spécifications principales (3 premières)
 */
const getMainSpecs = (caracteristiques) => {
    if (typeof caracteristiques === 'string') {
        try {
            caracteristiques = JSON.parse(caracteristiques);
        } catch (e) {
            return {};
        }
    }
    
    const entries = Object.entries(caracteristiques || {}).slice(0, 3);
    return Object.fromEntries(entries);
};

/**
 * Générer l'URL WhatsApp pour un produit
 */
const getWhatsappUrl = (produit) => {
    const message = encodeURIComponent(
        `Bonjour, je suis intéressé par le produit "${produit.nom}" (${produit.marque}). Pouvez-vous me faire un devis ?`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
};

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = (produit) => {
    analyticsService.trackWhatsAppClick('showroom');
    analyticsService.trackCtaClick('whatsapp_produit', 'showroom');
};

/**
 * Télécharger la fiche technique
 */
const downloadFiche = (produit) => {
    analyticsService.trackFicheDownload(produit.id);
    if (produit.fiche_technique_url) {
        window.open(produit.fiche_technique_url, '_blank');
    }
};

// Charger les produits au montage
onMounted(() => {
    loadProduits();
});
</script>

<style scoped>
.showroom-page {
    padding-top: 70px;
    min-height: 100vh;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Page header */
.page-header {
    background: linear-gradient(135deg, #1a1a1a 0%, #DC2626 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.page-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Filtres */
.filters-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 25px 0;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 30px;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 15px;
}

.filter-group label {
    font-weight: 500;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.filter-group input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.filter-buttons {
    display: flex;
    gap: 10px;
}

.filter-btn {
    padding: 10px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    color: #475569;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn:hover {
    border-color: #DC2626;
    color: #DC2626;
}

.filter-btn.active {
    background: #DC2626;
    border-color: #DC2626;
    color: white;
}

/* Grille de produits */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
}

.product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.product-image {
    position: relative;
    height: 220px;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.product-badges {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    gap: 8px;
}

.badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
}

.category-badge.imprimante {
    background: #1a1a1a;
}

.category-badge.copieur {
    background: #DC2626;
}

.volume-badge {
    background: rgba(0, 0, 0, 0.6);
}

.showroom-ribbon {
    position: absolute;
    top: 15px;
    right: -30px;
    background: #22c55e;
    color: white;
    padding: 5px 40px;
    font-size: 0.75rem;
    font-weight: 600;
    transform: rotate(45deg);
}

.product-content {
    padding: 25px;
}

.product-header {
    margin-bottom: 15px;
}

.product-brand {
    font-size: 0.85rem;
    color: #737373;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.product-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 5px 0 0 0;
}

.product-description {
    color: #737373;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 15px;
}

.product-specs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8fafc;
    border-radius: 10px;
}

.spec-item {
    font-size: 0.85rem;
    flex: 1 1 45%;
}

.spec-label {
    color: #737373;
}

.spec-value {
    color: #1a1a1a;
    font-weight: 500;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    padding-top: 15px;
    border-top: 1px solid #f1f5f9;
}

.product-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #DC2626;
}

.product-actions {
    display: flex;
    gap: 8px;
}

/* Boutons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-outline {
    background: transparent;
    color: #DC2626;
    border: 2px solid #DC2626;
}

.btn-outline:hover {
    background: #DC2626;
    color: white;
}

.btn-secondary {
    background: #f1f5f9;
    color: #475569;
}

.btn-secondary:hover {
    background: #e2e8f0;
}

.btn-primary {
    background: #25d366;
    color: white;
}

.btn-primary:hover {
    background: #128c7e;
}

.btn-whatsapp {
    background: #25d366;
    color: white;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn-whatsapp:hover {
    background: #128c7e;
}

.btn-large {
    padding: 16px 32px;
    font-size: 1.1rem;
}

/* États de chargement et vide */
.loading-state,
.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.loader {
    width: 50px;
    height: 50px;
    border: 4px solid #e5e5e5;
    border-top-color: #DC2626;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.empty-state h3 {
    font-size: 1.5rem;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.empty-state p {
    color: #737373;
    margin-bottom: 20px;
}

/* CTA final */
.page-cta {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
    border-radius: 20px;
    margin-bottom: 60px;
}

.page-cta h3 {
    font-size: 1.5rem;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.page-cta p {
    color: #737373;
    margin-bottom: 25px;
}

/* Responsive */
@media (max-width: 768px) {
    .page-header {
        padding: 40px 0;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .filters-bar {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .filter-buttons {
        flex-wrap: wrap;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .product-footer {
        flex-direction: column;
        align-items: stretch;
    }
    
    .product-actions {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .page-title {
        font-size: 1.75rem;
    }
    
    .filter-btn {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
    
    .product-content {
        padding: 20px;
    }
    
    .product-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>
