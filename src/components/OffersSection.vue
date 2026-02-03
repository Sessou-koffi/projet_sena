<template>
    <!-- 
        Section Offres Commerciales - Présentation des produits et services
        Section clé du cahier de charges avec 3 offres principales
    -->
    <section id="produits" class="offers-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Nos Offres</h2>
                <p class="section-subtitle">
                    Des solutions adaptées à chaque besoin d'entreprise
                </p>
            </div>

            <!-- Grille des offres -->
            <div class="offers-grid">
                <!-- Offre 1: Imprimantes professionnelles -->
                <div class="offer-card">
                    <div class="offer-icon"></div>
                    <h3 class="offer-title">Imprimantes professionnelles</h3>
                    <p class="offer-subtitle">Pour bureaux & PME</p>
                    
                    <ul class="offer-features">
                        <li>🔹 Impression rapide et économique</li>
                        <li>🔹 Adaptée aux volumes quotidiens</li>
                        <li>🔹 Qualité professionnelle garantie</li>
                        <li>🔹 Connectivité réseau et Wi-Fi</li>
                    </ul>

                    <div class="offer-price">
                        <span class="price-label">Solutions disponibles à partir de</span>
                        <span class="price-value">450 000 FCFA</span>
                        <span class="price-note">selon configuration</span>
                    </div>

                    <button class="btn btn-outline" @click="openDevisModal('imprimante')">
                        Demander un devis
                    </button>
                </div>

                <!-- Offre 2: Copieurs professionnels -->
                <div class="offer-card featured">
                    <div class="featured-badge">Populaire</div>
                    <div class="offer-icon"></div>
                    <h3 class="offer-title">Copieurs multifonctions</h3>
                    <p class="offer-subtitle">Pour entreprises & institutions</p>
                    
                    <ul class="offer-features">
                        <li>🔹 Impression – Scan – Copie</li>
                        <li>🔹 Haute capacité de production</li>
                        <li>🔹 Idéal pour grandes équipes</li>
                        <li>🔹 Gestion documentaire intégrée</li>
                    </ul>

                    <div class="offer-price">
                        <span class="price-label">Solutions disponibles à partir de</span>
                        <span class="price-value"> 500 000 FCFA</span>
                        <span class="price-note">selon volume et fonctionnalités</span>
                    </div>

                    <a 
                        :href="whatsappUrl" 
                        target="_blank" 
                        class="btn btn-primary"
                        @click="trackWhatsAppClick('copieur')"
                    >
                        <span>📱</span> Demander un devis
                    </a>
                </div>

                <!-- Offre 3: Services additionnels -->
                <div class="offer-card">
                    <div class="offer-icon"></div>
                    <h3 class="offer-title">Services additionnels</h3>
                    <p class="offer-subtitle">Support complet</p>
                    
                    <ul class="offer-features">
                        <li>✔ Maintenance préventive et corrective</li>
                        <li>✔ Fourniture d'encres et consommables</li>
                        <li>✔ Assistance technique rapide</li>
                        <li>✔ Contrats de maintenance sur mesure</li>
                        <li>✔ Formation des utilisateurs</li>
                    </ul>

                    <div class="offer-price">
                        <span class="price-label">Contrats sur mesure</span>
                        <span class="price-value">Sur devis</span>
                        <span class="price-note">adapté à vos besoins</span>
                    </div>

                    <button class="btn btn-outline" @click="openDevisModal('maintenance')">
                        Nous contacter
                    </button>
                </div>
            </div>

            <!-- Produits dynamiques depuis l'API -->
            <div class="products-showcase" v-if="produits.length > 0">
                <h3 class="showcase-title">Découvrez nos produits phares</h3>
                
                <div class="products-grid">
                    <div 
                        class="product-card" 
                        v-for="produit in produits" 
                        :key="produit.id"
                    >
                        <div class="product-image">
                            <img 
                                :src="produit.image_url || 'https://via.placeholder.com/300x200?text=Produit'" 
                                :alt="produit.nom"
                            />
                            <span 
                                class="product-badge" 
                                :class="produit.categorie"
                            >
                                {{ produit.categorie === 'imprimante' ? 'Imprimante' : 'Copieur' }}
                            </span>
                            <span 
                                v-if="produit.disponible_showroom" 
                                class="showroom-badge"
                            >
                                Disponible en showroom
                            </span>
                        </div>
                        
                        <div class="product-info">
                            <h4 class="product-name">{{ produit.nom }}</h4>
                            <p class="product-brand">{{ produit.marque }}</p>
                            <p class="product-description">{{ truncateText(produit.description, 100) }}</p>
                            
                            <div class="product-price">
                                {{ produit.prix_formate }}
                            </div>
                            
                            <div class="product-actions">
                                <router-link 
                                    :to="`/produit/${produit.slug}`" 
                                    class="btn btn-sm btn-outline"
                                >
                                    Voir détails
                                </router-link>
                                <button 
                                    v-if="produit.fiche_technique" 
                                    class="btn btn-sm btn-secondary"
                                    @click="downloadFiche(produit)"
                                >
                                     Fiche technique
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="showcase-cta">
                    <router-link to="/showroom" class="btn btn-outline-primary">
                        Voir tous nos produits →
                    </router-link>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { produitService, analyticsService } from '../services/api';

// Émissions d'événements
const emit = defineEmits(['open-devis-modal']);

/**
 * État des produits
 */
const produits = ref([]);
const loading = ref(false);

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22990000000';
const whatsappMessage = encodeURIComponent('Bonjour, je suis intéressé par vos copieurs multifonctions. Pouvez-vous me faire un devis ?');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Charger les produits depuis l'API
 */
const loadProduits = async () => {
    loading.value = true;
    try {
        const response = await produitService.getAll();
        if (response.success) {
            // Prendre les 4 premiers produits pour l'aperçu
            produits.value = response.data.slice(0, 4);
        }
    } catch (error) {
        console.error('Erreur chargement produits:', error);
    } finally {
        loading.value = false;
    }
};

/**
 * Tronquer le texte
 */
const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Ouvrir le modal de demande de devis
 */
const openDevisModal = (type) => {
    emit('open-devis-modal', type);
    analyticsService.trackCtaClick(`offer_${type}`, 'offers');
};

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = (type) => {
    analyticsService.trackWhatsAppClick('offers');
    analyticsService.trackCtaClick(`whatsapp_${type}`, 'offers');
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
.offers-section {
    padding: 100px 0;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-title {
    font-size: 2.5rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 15px;
}

.section-subtitle {
    font-size: 1.2rem;
    color: #737373;
}

/* Grille des offres */
.offers-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 80px;
}

.offer-card {
    background: white;
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    border: 2px solid transparent;
}

.offer-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.offer-card.featured {
    border-color: #DC2626;
    transform: scale(1.05);
}

.offer-card.featured:hover {
    transform: scale(1.05) translateY(-10px);
}

.featured-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: #DC2626;
    color: white;
    padding: 5px 20px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.offer-icon {
    font-size: 3rem;
    margin-bottom: 20px;
}

.offer-title {
    font-size: 1.5rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 5px;
}

.offer-subtitle {
    color: #737373;
    margin-bottom: 25px;
}

.offer-features {
    list-style: none;
    padding: 0;
    margin: 0 0 25px 0;
    text-align: left;
}

.offer-features li {
    padding: 8px 0;
    color: #374151;
    font-size: 0.95rem;
    border-bottom: 1px solid #f1f5f9;
}

.offer-features li:last-child {
    border-bottom: none;
}

.offer-price {
    margin-bottom: 25px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
}

.price-label {
    display: block;
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 5px;
}

.price-value {
    display: block;
    font-size: 1.75rem;
    font-weight: 700;
    color: #DC2626;
}

.price-note {
    display: block;
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 5px;
}

/* Boutons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    width: 100%;
}

.btn-primary {
    background: #ad571d;
    color: white;
    border: none;
}

.btn-primary:hover {
    background: #128c7e;
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

.btn-outline-primary {
    background: transparent;
    color: #DC2626;
    border: 2px solid #DC2626;
    width: auto;
    padding: 14px 40px;
}

.btn-outline-primary:hover {
    background: #DC2626;
    color: white;
}

/* Showcase produits */
.products-showcase {
    border-top: 1px solid #e2e8f0;
    padding-top: 60px;
}

.showcase-title {
    text-align: center;
    font-size: 1.75rem;
    color: #1a1a1a;
    margin-bottom: 40px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25px;
    margin-bottom: 40px;
}

.product-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.product-image {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    color: white;
}

.product-badge.imprimante {
    background: #1a1a1a;
}

.product-badge.copieur {
    background: #DC2626;
}

.showroom-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: #22c55e;
    color: white;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.7rem;
    font-weight: 500;
}

.product-info {
    padding: 20px;
}

.product-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 5px;
}

.product-brand {
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 10px;
}

.product-description {
    font-size: 0.85rem;
    color: #475569;
    line-height: 1.5;
    margin-bottom: 15px;
}

.product-price {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2563eb;
    margin-bottom: 15px;
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 0.85rem;
}

.btn-secondary {
    background: #f1f5f9;
    color: #475569;
    border: none;
}

.btn-secondary:hover {
    background: #e2e8f0;
}

.showcase-cta {
    text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
    .offers-grid {
        grid-template-columns: 1fr;
        max-width: 450px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .offer-card.featured {
        transform: none;
    }
    
    .offer-card.featured:hover {
        transform: translateY(-10px);
    }
    
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .offers-section {
        padding: 60px 0;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }
}

@media (max-width: 600px) {
    .offers-section {
        padding: 50px 0;
    }
    
    .container {
        padding: 0 15px;
    }
    
    .section-header {
        margin-bottom: 40px;
    }
    
    .section-title {
        font-size: 1.6rem;
    }
    
    .section-subtitle {
        font-size: 1rem;
    }
    
    .offers-grid {
        gap: 20px;
        max-width: 100%;
        margin-bottom: 50px;
    }
    
    .offer-card {
        padding: 25px 18px;
        border-radius: 15px;
    }
    
    .offer-icon {
        font-size: 2.5rem;
        margin-bottom: 15px;
    }
    
    .offer-title {
        font-size: 1.2rem;
    }
    
    .offer-subtitle {
        font-size: 0.9rem;
        margin-bottom: 20px;
    }
    
    .offer-features {
        margin-bottom: 20px;
    }
    
    .offer-features li {
        font-size: 0.9rem;
        padding: 6px 0;
    }
    
    .offer-price {
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .price-label {
        font-size: 0.8rem;
    }
    
    .price-value {
        font-size: 1.4rem;
    }
    
    .price-note {
        font-size: 0.75rem;
    }
    
    .btn {
        padding: 12px 20px;
        font-size: 0.95rem;
    }
    
    .featured-badge {
        padding: 4px 15px;
        font-size: 0.8rem;
    }
    
    .showcase-title {
        font-size: 1.4rem;
        margin-bottom: 30px;
    }
}

@media (max-width: 380px) {
    .section-title {
        font-size: 1.4rem;
    }
    
    .offer-card {
        padding: 20px 15px;
    }
    
    .offer-title {
        font-size: 1.1rem;
    }
    
    .price-value {
        font-size: 1.3rem;
    }
}
</style>
