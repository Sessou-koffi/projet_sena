<template>
    <!-- 
        Section Catalogue Produits - Affichage de tous les produits disponibles
        Grille responsive avec filtres par catégorie
    -->
    <section id="catalogue" class="products-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Notre Catalogue</h2>
                <p class="section-subtitle">
                    Découvrez notre gamme complète de copieurs et imprimantes professionnels
                </p>
            </div>

            <!-- Filtres par catégorie -->
            <div class="filters">
                <button 
                    :class="['filter-btn', { active: activeFilter === 'all' }]"
                    @click="activeFilter = 'all'"
                >
                    Tous
                </button>
                <button 
                    :class="['filter-btn', { active: activeFilter === 'copieur' }]"
                    @click="activeFilter = 'copieur'"
                >
                    Copieurs
                </button>
                <button 
                    :class="['filter-btn', { active: activeFilter === 'imprimante' }]"
                    @click="activeFilter = 'imprimante'"
                >
                    Imprimantes bureau
                </button>
            </div>

            <!-- Grille de produits -->
            <div class="products-grid">
                <div 
                    v-for="product in filteredProducts" 
                    :key="product.id"
                    class="product-card"
                    @click="goToProduct(product.slug)"
                >
                    <!-- Image produit -->
                    <div class="product-image">
                        <img :src="product.image" :alt="product.name" />
                        <div class="product-overlay">
                            <span class="view-btn">Voir détails</span>
                        </div>
                    </div>

                    <!-- Infos produit -->
                    <div class="product-info">
                        <!-- Badge catégorie -->
                        <div class="product-badges">
                            <span :class="['badge', product.type]">
                                {{ product.type === 'copieur' ? 'Copieur' : 'Imprimante' }}
                            </span>
                            <span :class="['badge', product.color]">
                                {{ product.color === 'couleur' ? 'Couleur' : 'N&B' }}
                            </span>
                        </div>
                        
                        <span class="product-brand">{{ product.brand }}</span>
                        <h3 class="product-name">{{ product.name }}</h3>
                        
                        <div class="product-specs">
                            <span class="spec">
                                <strong>{{ product.speed }}</strong> ppm
                            </span>
                            <span class="spec">
                                Format <strong>{{ product.format }}</strong>
                            </span>
                        </div>

                        <div class="product-price">
                            <span class="price-ttc">{{ formatPrice(product.priceTTC) }} TTC</span>
                            <span class="price-ht" v-if="product.priceHT">
                                {{ formatPrice(product.priceHT) }} HT
                            </span>
                        </div>

                        <button class="btn-devis" @click.stop="requestDevis(product)">
                            Demander un devis
                        </button>
                    </div>
                </div>
            </div>

            <!-- CTA bas de section -->
            <div class="section-cta">
                <p>Vous ne trouvez pas ce que vous cherchez ?</p>
                <div class="cta-buttons">
                    <a :href="whatsappUrl" target="_blank" class="btn btn-whatsapp">
                        Contactez-nous sur WhatsApp
                    </a>
                    <a href="/catalogue-sena.pdf" download class="btn btn-download">
                        Télécharger le catalogue PDF
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Import des images produits
import img2525AC from '../assets/TOSHIBA_STUDIO_2525_couleur.png';
import img2528A from '../assets/TOSHIBA_STUDIO_2528_A.png';
import img2508A from '../assets/TOSHIBA_STUDIO_2508_A.png';
import img2518A from '../assets/TOSHIBA_STUDIO_18_A.png';
import imgB235 from '../assets/XEROW_B_235.png';
import imgB400 from '../assets/XEROX_B400.png';
import img409AS from '../assets/Toshiba_E_STUDIO_409AS.png';
import img409CS from '../assets/Toshiba_E_STUDIO_409CS.png';
import img339CS from '../assets/Toshiba_E-STUDIO.png';

const router = useRouter();

/**
 * Filtre actif
 */
const activeFilter = ref('all');

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappMessage = encodeURIComponent('Bonjour, je souhaite des informations sur vos produits.');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Liste des produits du catalogue
 */
const products = ref([
    // COPIEURS
    {
        id: 1,
        slug: 'toshiba-e-studio-2525ac',
        name: 'e-STUDIO 2525AC',
        brand: 'TOSHIBA',
        type: 'copieur',
        color: 'couleur',
        format: 'A3/A4',
        speed: '25',
        priceHT: 4775000,
        priceTTC: 5634500,
        image: img2525AC,
        description: 'Système multifonction couleur A3/A4 conçu pour les environnements de bureau.',
        features: [
            'Multifonction couleur (impression, copie, numérisation, télécopie en option)',
            '25 pages par minute en couleur et monochrome',
            'Écran tactile couleur 10.1 pouces personnalisable',
            'Capacité 1 200 feuilles, extensible jusqu\'à 5 200 feuilles',
            '4 Go RAM + SSD 128 Go chiffré',
            'Numérisation recto-verso 240 ipm',
            'Connectivité USB 2.0, Ethernet, Wi-Fi (option)'
        ]
    },
    {
        id: 2,
        slug: 'toshiba-e-studio-2528a',
        name: 'e-STUDIO 2528A',
        brand: 'TOSHIBA',
        type: 'copieur',
        color: 'monochrome',
        format: 'A3/A4',
        speed: '25',
        priceHT: 3785000,
        priceTTC: 4466300,
        image: img2528A,
        description: 'Système multifonction monochrome A3 performant pour la gestion documentaire professionnelle.',
        features: [
            'Impressions, copies, numérisations (télécopie en option)',
            '25 ppm (A4) / 16 ppm (A3)',
            'Résolution 2400 x 600 dpi avec lissage',
            'Écran tactile couleur 10.1 pouces',
            '4 Go RAM + HDD 320 Go ou SSD 128 Go',
            'Capacité extensible jusqu\'à 5 200 feuilles',
            'Sécurité complète pour données et réseau'
        ]
    },
    {
        id: 3,
        slug: 'toshiba-e-studio-2508a',
        name: 'e-STUDIO 2508A',
        brand: 'TOSHIBA',
        type: 'copieur',
        color: 'monochrome',
        format: 'A3/A4',
        speed: '25',
        priceHT: 2600000,
        priceTTC: 3068000,
        image: img2508A,
        description: 'Système multifonction monochrome A3/A4 pour optimiser les flux de travail bureautiques.',
        features: [
            'Impressions, copies, numérisations (télécopie en option)',
            '25 pages par minute (A4)',
            'Résolution copie 2400 x 1200 dpi',
            'Écran tactile couleur 9 pouces personnalisable',
            'Capacité 1 200 feuilles, extensible jusqu\'à 3 200 feuilles',
            'Recto-verso automatique standard',
            'Sécurité FIPS 140-2, cycle max 100 000 pages/mois'
        ]
    },
    {
        id: 4,
        slug: 'toshiba-e-studio-2518a',
        name: 'e-STUDIO 2518A',
        brand: 'TOSHIBA',
        type: 'copieur',
        color: 'monochrome',
        format: 'A3/A4',
        speed: '25',
        priceHT: 3300000,
        priceTTC: 3894000,
        image: img2518A,
        description: 'Photocopieur multifonction laser A3 monochrome avec scan couleur et contrôleur e-BRIDGE Next.',
        features: [
            'Impression, copie, scan couleur, fax (option)',
            '25 ppm (A4) / 16 ppm (A3)',
            'Résolution 1200 x 1200 dpi impression, 2400 dpi copie',
            'Écran tactile couleur 10.1 pouces',
            'Capacité 2x550 feuilles + 100 feuilles bac manuel',
            'USB 2.0, Ethernet, Wi-Fi Direct, Bluetooth',
            'Cryptage données, impression privée, authentification'
        ]
    },
    // IMPRIMANTES
    {
        id: 5,
        slug: 'xerox-b235',
        name: 'B235',
        brand: 'XEROX',
        type: 'imprimante',
        color: 'monochrome',
        format: 'A4',
        speed: '34-36',
        priceHT: null,
        priceTTC: 365000,
        image: imgB235,
        description: 'Imprimante multifonction laser monochrome A4 compacte, idéale pour PME et télétravail.',
        features: [
            'Impression, copie, numérisation, télécopie',
            'Jusqu\'à 34-36 pages par minute',
            'Recto-verso automatique standard',
            'Wi-Fi 802.11b/g/n, Ethernet, USB 2.0',
            'Apple AirPrint, Mopria, Wi-Fi Direct',
            'Chargeur automatique 50 feuilles',
            'Écran tactile couleur 2.4 pouces',
            'Volume recommandé 2 500 pages/mois'
        ]
    },
    {
        id: 6,
        slug: 'xerox-b400',
        name: 'B400',
        brand: 'XEROX',
        type: 'imprimante',
        color: 'monochrome',
        format: 'A4',
        speed: '40',
        priceHT: null,
        priceTTC: 380000,
        image: imgB400,
        description: 'Imprimante monochrome A4 haute performance pour équipes de 3 à 15 utilisateurs.',
        features: [
            'Impression monochrome haute vitesse',
            '40 pages par minute (A4)',
            'Résolution 1700 x 1700 dpi',
            'Volume mensuel 80 000 pages',
            'Recto-verso automatique',
            'Écran tactile couleur intuitif',
            'USB 2.0, Ethernet, Wi-Fi',
            'Impression mobile et Cloud native'
        ]
    },
    {
        id: 7,
        slug: 'toshiba-e-studio-409as',
        name: 'e-STUDIO 409AS',
        brand: 'TOSHIBA',
        type: 'imprimante',
        color: 'monochrome',
        format: 'A4',
        speed: '40-42',
        priceHT: 525000,
        priceTTC: 619500,
        image: img409AS,
        description: 'Multifonction monochrome compact A4 haute productivité et faible consommation.',
        features: [
            'Impression, copie, scan, fax monochrome',
            '40-42 pages par minute',
            'Numérisation 46 ipm avec ADF',
            'Écran tactile couleur 4.3 pouces',
            'Résolution 1200 x 1200 dpi',
            'Capacité papier 900 feuilles max',
            'Recto-verso automatique (impression et scan)',
            'AirPrint, Mopria, TPM intégré'
        ]
    },
    {
        id: 8,
        slug: 'toshiba-e-studio-409cs',
        name: 'e-STUDIO 409CS',
        brand: 'TOSHIBA',
        type: 'imprimante',
        color: 'couleur',
        format: 'A4',
        speed: '40-42',
        priceHT: 417000,
        priceTTC: 492060,
        image: img409CS,
        description: 'Multifonction laser couleur A4 compacte et performante pour petits groupes de travail.',
        features: [
            'Impression, copie, scan et fax couleur',
            '40-42 ppm couleur et noir & blanc',
            'Numérisation 104 ipm (double balayage)',
            'Écran tactile couleur 7 pouces personnalisable',
            'Résolution 1200 x 1200 dpi',
            'Capacité 251 feuilles, extensible à 2 001',
            'Réseau, USB et Wi-Fi',
            'TPM et cryptage intégrés'
        ]
    },
    {
        id: 9,
        slug: 'toshiba-e-studio-339cs',
        name: 'e-STUDIO 339CS',
        brand: 'TOSHIBA',
        type: 'imprimante',
        color: 'couleur',
        format: 'A4',
        speed: '33',
        priceHT: 625000,
        priceTTC: 737500,
        image: img339CS,
        description: 'Multifonction laser couleur A4 compacte et robuste, idéale pour les PME.',
        features: [
            'Impression, copie, scan et fax couleur',
            '33 pages par minute couleur et N&B',
            'Première page en 7.2-7.5 secondes',
            'Résolution 1200 x 1200 dpi',
            'Écran tactile couleur 4.3 pouces',
            'Capacité 250 feuilles, extensible à 2 001',
            'USB, Gigabit Ethernet, Wi-Fi',
            'Châssis acier, TPM, scanner recto-verso'
        ]
    }
]);

/**
 * Produits filtrés selon le filtre actif
 */
const filteredProducts = computed(() => {
    if (activeFilter.value === 'all') {
        return products.value;
    }
    return products.value.filter(product => {
        if (activeFilter.value === 'copieur' || activeFilter.value === 'imprimante') {
            return product.type === activeFilter.value;
        }
        if (activeFilter.value === 'couleur' || activeFilter.value === 'monochrome') {
            return product.color === activeFilter.value;
        }
        return true;
    });
});

/**
 * Formater le prix en FCFA
 */
const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('fr-FR').format(price) + ' F CFA';
};

/**
 * Naviguer vers la page détail du produit
 */
const goToProduct = (slug) => {
    router.push({ name: 'ProduitDetail', params: { slug } });
};

/**
 * Demander un devis pour un produit
 */
const requestDevis = (product) => {
    const message = encodeURIComponent(`Bonjour, je souhaite un devis pour le ${product.brand} ${product.name}. Merci de me recontacter.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
};
</script>

<style scoped>
.products-section {
    padding: 100px 0;
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section-header {
    text-align: center;
    margin-bottom: 50px;
}

.section-title {
    font-size: 2.5rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 15px;
}

.section-subtitle {
    font-size: 1.2rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
}

/* Filtres */
.filters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 50px;
}

.filter-btn {
    padding: 12px 24px;
    border: 2px solid #e2e8f0;
    border-radius: 30px;
    background: white;
    color: #64748b;
    font-weight: 600;
    font-size: 0.95rem;
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

/* Grille produits */
.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 60px;
}

/* Carte produit */
.product-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.4s ease;
    cursor: pointer;
    position: relative;
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Badges */
.product-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
}

.badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.badge.copieur {
    background: #1a1a1a;
    color: white;
}

.badge.imprimante {
    background: #3b82f6;
    color: white;
}

.badge.couleur {
    background: linear-gradient(135deg, #f472b6 0%, #c084fc 100%);
    color: white;
}

.badge.monochrome {
    background: #64748b;
    color: white;
}

/* Image produit */
.product-image {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: #f8f9fa;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 10px;
    transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.1);
}

.product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(220, 38, 38, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
    opacity: 1;
}

.view-btn {
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 12px 24px;
    border: 2px solid white;
    border-radius: 30px;
}

/* Infos produit */
.product-info {
    padding: 25px;
}

.product-brand {
    font-size: 0.85rem;
    color: #DC2626;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.product-name {
    font-size: 1.3rem;
    color: #1a1a1a;
    font-weight: 700;
    margin: 8px 0 15px;
}

.product-specs {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
}

.spec {
    font-size: 0.85rem;
    color: #64748b;
    background: #f1f5f9;
    padding: 5px 12px;
    border-radius: 20px;
}

.spec strong {
    color: #1a1a1a;
}

/* Prix */
.product-price {
    margin-bottom: 15px;
}

.price-ttc {
    font-size: 1.4rem;
    font-weight: 700;
    color: #DC2626;
    display: block;
}

.price-ht {
    font-size: 0.9rem;
    color: #64748b;
}

/* Bouton devis */
.btn-devis {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-devis:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
}

/* CTA section */
.section-cta {
    text-align: center;
    padding: 40px;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border-radius: 20px;
    color: white;
}

.section-cta p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    opacity: 0.9;
}

.cta-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
}

.btn-whatsapp {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: #25d366;
    color: white;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.3s ease;
}

.btn-whatsapp:hover {
    background: #128c7e;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
}

.btn-download {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 32px;
    background: #DC2626;
    color: white;
    border-radius: 30px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.3s ease;
}

.btn-download:hover {
    background: #b91c1c;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
    }
}

@media (max-width: 768px) {
    .products-section {
        padding: 60px 0;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .filters {
        gap: 8px;
        margin-bottom: 35px;
    }
    
    .filter-btn {
        padding: 10px 18px;
        font-size: 0.85rem;
    }
    
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .product-image {
        height: 180px;
    }
    
    .product-info {
        padding: 20px;
    }
    
    .product-name {
        font-size: 1.1rem;
    }
    
    .product-specs {
        flex-direction: column;
        gap: 8px;
    }
    
    .price-ttc {
        font-size: 1.2rem;
    }
}

@media (max-width: 600px) {
    .products-section {
        padding: 50px 0;
    }
    
    .container {
        padding: 0 15px;
    }
    
    .section-title {
        font-size: 1.6rem;
    }
    
    .section-subtitle {
        font-size: 1rem;
    }
    
    .filters {
        justify-content: flex-start;
        overflow-x: auto;
        padding-bottom: 10px;
        margin-bottom: 30px;
        -webkit-overflow-scrolling: touch;
    }
    
    .filter-btn {
        flex-shrink: 0;
        padding: 8px 16px;
        font-size: 0.8rem;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .product-card {
        border-radius: 15px;
    }
    
    .product-badges {
        top: 10px;
        left: 10px;
    }
    
    .badge {
        padding: 4px 10px;
        font-size: 0.7rem;
    }
    
    .product-image {
        height: 200px;
    }
    
    .product-info {
        padding: 18px;
    }
    
    .product-brand {
        font-size: 0.8rem;
    }
    
    .product-name {
        font-size: 1.15rem;
        margin: 6px 0 12px;
    }
    
    .product-specs {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .spec {
        font-size: 0.8rem;
        padding: 4px 10px;
    }
    
    .price-ttc {
        font-size: 1.25rem;
    }
    
    .price-ht {
        font-size: 0.85rem;
    }
    
    .btn-devis {
        padding: 12px;
        font-size: 0.95rem;
    }
    
    .section-cta {
        padding: 30px 20px;
        border-radius: 15px;
    }
    
    .section-cta p {
        font-size: 1rem;
    }
    
    .btn-whatsapp {
        padding: 14px 24px;
        font-size: 1rem;
    }
}

@media (max-width: 380px) {
    .section-title {
        font-size: 1.4rem;
    }
    
    .product-image {
        height: 180px;
    }
    
    .product-info {
        padding: 15px;
    }
    
    .product-name {
        font-size: 1.05rem;
    }
    
    .price-ttc {
        font-size: 1.15rem;
    }
}
</style>
