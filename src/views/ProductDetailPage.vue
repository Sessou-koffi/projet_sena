<template>
    <!-- 
        Page Détail Produit - Affichage complet d'un produit
    -->
    <div class="product-detail-page">
        <!-- Hero produit -->
        <section class="product-hero">
            <div class="container">
                <!-- Bouton retour -->
                <button class="back-button" @click="goBack">
                    ← Retour au catalogue
                </button>
                
                <div class="breadcrumb">
                    <router-link to="/">Accueil</router-link>
                    <span>/</span>
                    <router-link to="/#catalogue">Catalogue</router-link>
                    <span>/</span>
                    <span class="current">{{ product?.name }}</span>
                </div>

                <div class="product-main" v-if="product">
                    <!-- Galerie image -->
                    <div class="product-gallery">
                        <div class="main-image">
                            <img :src="product.image" :alt="product.name" />
                        </div>
                    </div>

                    <!-- Infos principales -->
                    <div class="product-info">
                        <!-- Badges catégorie -->
                        <div class="product-badges">
                            <span :class="['badge', product.type]">
                                {{ product.type === 'copieur' ? 'Copieur' : 'Imprimante' }}
                            </span>
                            <span :class="['badge', product.color]">
                                {{ product.color === 'couleur' ? 'Couleur' : 'N&B' }}
                            </span>
                        </div>
                        
                        <span class="brand">{{ product.brand }}</span>
                        <h1 class="name">{{ product.name }}</h1>
                        
                        <p class="description">{{ product.description }}</p>

                        <div class="quick-specs">
                            <div class="spec-item">
                                <span class="spec-icon">Vitesse</span>
                                <div class="spec-text">
                                    <strong>{{ product.speed }} ppm</strong>
                                </div>
                            </div>
                            <div class="spec-item">
                                <span class="spec-icon">Format</span>
                                <div class="spec-text">
                                    <strong>{{ product.format }}</strong>
                                </div>
                            </div>
                            <div class="spec-item">
                                <span class="spec-icon">Type</span>
                                <div class="spec-text">
                                    <strong>{{ product.color === 'couleur' ? 'Couleur' : 'Monochrome' }}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="price-box">
                            <div class="price-main">
                                <span class="price-label">Prix TTC</span>
                                <span class="price-value">{{ formatPrice(product.priceTTC) }}</span>
                            </div>
                            <div class="price-ht" v-if="product.priceHT">
                                <span class="price-label">Prix HT</span>
                                <span class="price-value-ht">{{ formatPrice(product.priceHT) }}</span>
                            </div>
                        </div>

                        <div class="cta-buttons">
                            <a :href="whatsappUrl" target="_blank" class="btn btn-whatsapp">
                                 Demander un devis sur WhatsApp
                            </a>
                            <a href="#contact" class="btn btn-secondary">
                              Remplir le formulaire
                            </a>
                        </div>

                        <div class="guarantees">
                            <div class="guarantee">
                                <span></span> Livraison & installation incluses
                            </div>
                            <div class="guarantee">
                                <span></span> Garantie constructeur
                            </div>
                            <div class="guarantee">
                                <span></span> Support technique disponible
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Caractéristiques détaillées -->
        <section class="product-features" v-if="product">
            <div class="container">
                <h2 class="section-title">Caractéristiques principales</h2>
                
                <div class="features-grid">
                    <div 
                        class="feature-item" 
                        v-for="(feature, index) in product.features" 
                        :key="index"
                    >
                        <span class="feature-icon">•</span>
                        <span class="feature-text">{{ feature }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA final -->
        <section class="product-cta">
            <div class="container">
                <div class="cta-content">
                    <h2>Intéressé par ce produit ?</h2>
                    <p>Nos conseillers sont disponibles pour vous accompagner dans votre choix</p>
                    <div class="cta-buttons">
                        <a :href="whatsappUrl" target="_blank" class="btn btn-whatsapp-large">
                          Contacter sur WhatsApp
                        </a>
                        <a href="tel:+22901918938" class="btn btn-call">
                            Appeler: +229 01 91 89 89 38
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Produits similaires -->
        <section class="similar-products" v-if="similarProducts.length > 0">
            <div class="container">
                <h2 class="section-title">Produits similaires</h2>
                
                <div class="similar-grid">
                    <div 
                        class="similar-card"
                        v-for="similar in similarProducts"
                        :key="similar.id"
                        @click="goToProduct(similar.slug)"
                    >
                        <div class="similar-image">
                            <img :src="similar.image" :alt="similar.name" />
                        </div>
                        <div class="similar-info">
                            <span class="similar-brand">{{ similar.brand }}</span>
                            <h4 class="similar-name">{{ similar.name }}</h4>
                            <span class="similar-price">{{ formatPrice(similar.priceTTC) }} TTC</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Message si produit non trouvé -->
        <section class="not-found" v-if="!product && !loading">
            <div class="container">
                <div class="not-found-content">
                    <span class="not-found-icon"></span>
                    <h2>Produit non trouvé</h2>
                    <p>Le produit que vous recherchez n'existe pas ou n'est plus disponible.</p>
                    <router-link to="/#catalogue" class="btn btn-primary">
                        ← Retour au catalogue
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Import des images locales (format carré)
import img2525AC from '../assets/TOSHIBA_STUDIO_2525_couleur.png';
import img2528A from '../assets/TOSHIBA_STUDIO_2528_A.png';
import img2508A from '../assets/TOSHIBA_STUDIO_2508_A.png';
import img2518A from '../assets/TOSHIBA_STUDIO_2518_A.png';
import imgB235 from '../assets/XEROW_B_235.png';
import imgB400 from '../assets/XEROX_B400.png';
import img409AS from '../assets/Toshiba_E_STUDIO_409AS.png';
import img409CS from '../assets/Toshiba_E_STUDIO_409CS.png';
import img339CS from '../assets/Toshiba_E_STUDIO_339CS.png';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const product = ref(null);

/**
 * Retour au catalogue
 */
const goBack = () => {
    router.push('/').then(() => {
        // Attendre que la navigation soit complète puis scroller vers le catalogue
        setTimeout(() => {
            const catalogueSection = document.getElementById('catalogue');
            if (catalogueSection) {
                catalogueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    });
};

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappUrl = computed(() => {
    if (!product.value) return '';
    const message = encodeURIComponent(`Bonjour, je suis intéressé par le ${product.value.brand} ${product.value.name} (${formatPrice(product.value.priceTTC)} TTC). Pouvez-vous me donner plus d'informations ?`);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
});

/**
 * Liste complète des produits
 */
const allProducts = [
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
        description: 'Système multifonction couleur A3/A4 conçu pour les environnements de bureau, offrant des fonctionnalités complètes d\'impression, de copie, de numérisation et, en option, de télécopie.',
        features: [
            'Multifonction couleur (impression, copie, numérisation, télécopie en option)',
            'Vitesse: 25 pages par minute en couleur et monochrome',
            'Écran tactile couleur 10.1 pouces personnalisable',
            'Formats supportés: Du A5R jusqu\'au A3 (Ledger)',
            'Capacité 1 200 feuilles, extensible jusqu\'à 5 200 feuilles',
            '4 Go de RAM + SSD 128 Go à chiffrement automatique',
            'Numérisation recto-verso: 240 images par minute',
            'Détection de double alimentation',
            'Connectivité: USB 2.0, Ethernet, Wi-Fi (option)',
            'Recto-verso automatique standard'
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
        description: 'Système multifonction monochrome A3 performant, conçu pour les besoins d\'impression et de gestion de documents professionnels, offrant vitesse, sécurité et polyvalence.',
        features: [
            'Impressions, copies, numérisations (télécopie en option)',
            'Vitesse: 25 ppm (A4) / 16 ppm (A3)',
            'Résolution: 2400 dpi x 600 dpi avec lissage',
            'Numérisation: 600 dpi',
            'Écran tactile couleur intuitif 10.1 pouces type tablette',
            '4 Go RAM + HDD 320 Go sécurisé ou SSD 128 Go',
            'Capacité extensible jusqu\'à 5 200 feuilles',
            'USB 2.0, Ethernet (10/100/1000Base-T)',
            'Bluetooth et Wi-Fi Direct en options',
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
        description: 'Système multifonction monochrome A3/A4 conçu pour optimiser les flux de travail bureautiques avec une excellente productivité.',
        features: [
            'Impressions, copies, numérisations (télécopie en option)',
            'Vitesse: 25 pages par minute (A4)',
            'Résolution copie: 2400 dpi x 1200 dpi avec lissage',
            'Résolution numérisation: 600 dpi',
            'Écran tactile couleur 9 pouces personnalisable',
            'Capacité 1 200 feuilles, extensible jusqu\'à 3 200 feuilles',
            'Formats jusqu\'au A3 (Ledger)',
            'Recto-verso automatique standard',
            'Ethernet (10/100/1000Base-T), USB 2.0, Wi-Fi et Bluetooth (option)',
            'Sécurité FIPS 140-2, authentification utilisateur, cryptage HDD',
            'Cycle max: 100 000 - 150 000 pages/mois'
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
        description: 'Photocopieur multifonction laser A3 monochrome avec scan couleur, conçu pour les entreprises avec des flux de travail complexes.',
        features: [
            'Impression, copie, numérisation couleur, fax (option)',
            'Vitesse: 25 ppm (A4) / 16 ppm (A3)',
            'Résolution impression: 1200 x 1200 dpi',
            'Résolution copie: jusqu\'à 2400 dpi',
            'Écran tactile couleur 10.1 pouces',
            'Formats A5R à A3, grammage 60-256 g/m²',
            'Capacité: 2x550 feuilles + 100 feuilles bac manuel, extensible',
            'USB 2.0, Ethernet, Wi-Fi Direct, Bluetooth',
            'Cryptage des données, impression privée, authentification',
            'Contrôleur e-BRIDGE Next pour personnalisation',
            'Dimensions: 585 x 586 x 787 mm, poids ~58 kg'
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
        description: 'Imprimante multifonction laser monochrome A4 compacte, idéale pour les petites entreprises ou le télétravail avec une excellente connectivité.',
        features: [
            'Impression, copie, numérisation, télécopie',
            'Vitesse: jusqu\'à 34-36 pages par minute',
            'Recto-verso automatique standard',
            'Résolution: 600 x 600 dpi',
            'Wi-Fi 802.11b/g/n natif',
            'Ethernet 10/100BaseT, USB 2.0',
            'Apple AirPrint, Mopria, Wi-Fi Direct, Chromebook',
            'Chargeur automatique de documents (ADF) 50 feuilles',
            'Bac papier 250 feuilles',
            'Écran tactile couleur 2.4 pouces',
            'Volume mensuel recommandé: 2 500 pages',
            'Installation Plug and Play facile'
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
        description: 'Imprimante monochrome A4 haute performance avec excellente prise en charge de l\'impression mobile et connectivité Cloud native.',
        features: [
            'Impression monochrome haute vitesse',
            'Vitesse: 40 pages par minute (A4)',
            'Résolution exceptionnelle: 1700 x 1700 dpi',
            'Volume mensuel: 80 000 pages/mois',
            'Recto-verso automatique',
            'Écran tactile couleur intuitif',
            'USB 2.0, Ethernet (10/100/1000Base-TX), Wi-Fi',
            'Impression mobile et Cloud native',
            'Idéale pour équipes de 3 à 15 utilisateurs',
            'Qualité d\'impression remarquable'
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
        description: 'Multifonction monochrome compact A4 offrant haute productivité avec faible consommation d\'énergie.',
        features: [
            'Impression, copie, scan, fax monochrome',
            'Vitesse: 40-42 pages par minute',
            'Numérisation: jusqu\'à 46 ipm avec ADF',
            'Écran tactile couleur 4.3 pouces (10.9 cm)',
            'Résolution: 1200 x 1200 dpi',
            'Capacité papier: 900 feuilles maximum',
            'Recto-verso automatique (impression et scan)',
            'USB, Réseau (Ethernet), Wi-Fi (selon config)',
            'Impression mobile: AirPrint, Mopria',
            'Trusted Platform Module (TPM) intégré pour la sécurité',
            'Conception compacte, faible consommation'
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
        description: 'Multifonction laser couleur A4 compacte et performante, idéale pour les petits groupes de travail avec de nombreuses fonctionnalités.',
        features: [
            'Impression, copie, scan et fax couleur',
            'Vitesse: 40-42 ppm en couleur et noir & blanc',
            'Numérisation ultra-rapide: 104 ipm (double balayage)',
            'Écran tactile couleur 7 pouces personnalisable',
            'Résolution: 1200 x 1200 dpi',
            'Capacité: 251 feuilles, extensible à 2 001 feuilles',
            'Réseau, USB et Wi-Fi',
            'Module TPM et cryptage pour la sécurité',
            'Économe en énergie',
            'Interface intuitive et facile d\'utilisation',
            'Dimensions: 47.6 x 47.9 x 49.2 cm, poids 27.1 kg'
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
        description: 'Multifonction laser couleur A4 compacte et robuste, idéale pour les PME avec un châssis en acier durable.',
        features: [
            'Impression, copie, scan et fax couleur',
            'Vitesse: 33 pages par minute couleur et N&B',
            'Première page en 7.2-7.5 secondes',
            'Résolution impression: 1200 x 1200 dpi',
            'Résolution scan: 600 x 600 dpi',
            'Écran tactile couleur 4.3 pouces',
            'Capacité: 250 feuilles + 1 bypass, extensible à 2 001',
            'Grammage: 60-176 g/m² (cassette), 216 g/m² (bypass)',
            'USB, Gigabit Ethernet, Wi-Fi, impression mobile',
            'TPM (Trusted Platform Module) pour la sécurité',
            'Châssis en acier robuste et durable',
            'Scanner recto-verso performant',
            'Faible consommation d\'énergie',
            'Dimensions: 479 x 475 x 491 mm, poids 27 kg'
        ]
    }
];

/**
 * Produits similaires (même type ou même couleur)
 */
const similarProducts = computed(() => {
    if (!product.value) return [];
    return allProducts
        .filter(p => p.id !== product.value.id && (p.type === product.value.type || p.color === product.value.color))
        .slice(0, 3);
});

/**
 * Formater le prix en FCFA
 */
const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('fr-FR').format(price) + ' F CFA';
};

/**
 * Charger le produit selon le slug
 */
const loadProduct = () => {
    loading.value = true;
    const slug = route.params.slug;
    product.value = allProducts.find(p => p.slug === slug) || null;
    loading.value = false;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
};

/**
 * Naviguer vers un autre produit
 */
const goToProduct = (slug) => {
    router.push({ name: 'ProduitDetail', params: { slug } });
};

// Charger le produit au montage et quand le slug change
onMounted(loadProduct);
watch(() => route.params.slug, (newSlug) => {
    if (newSlug) {
        loadProduct();
    }
}, { immediate: true });
</script>

<style scoped>
.product-detail-page {
    padding-top: 80px;
    background: #f8fafc;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Bouton retour */
.back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    padding: 10px 20px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #1a1a1a;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.back-button:hover {
    background: #DC2626;
    color: white;
    border-color: #DC2626;
}

/* Breadcrumb */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 0;
    font-size: 0.9rem;
    color: #64748b;
}

.breadcrumb a {
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb a:hover {
    color: #DC2626;
}

.breadcrumb .current {
    color: #1a1a1a;
    font-weight: 500;
}

/* Hero produit */
.product-hero {
    background: white;
    padding-bottom: 60px;
}

.product-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
}

/* Galerie - Optimisé pour images carrées */
.product-gallery {
    position: sticky;
    top: 100px;
}

.main-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    background: #ffffff;
    aspect-ratio: 1 / 1;
}

.main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 25px;
    background: #ffffff;
}

/* Badges dans product-info */
.product-badges {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
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

/* Infos produit */
.product-info {
    padding: 20px 0;
}

.brand {
    display: block;
    font-size: 0.9rem;
    color: #DC2626;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.name {
    font-size: 2.5rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 20px;
    line-height: 1.2;
}

.description {
    font-size: 1.1rem;
    color: #64748b;
    line-height: 1.7;
    margin-bottom: 30px;
}

/* Quick specs */
.quick-specs {
    display: flex;
    gap: 25px;
    margin-bottom: 30px;
    padding: 25px;
    background: #f8fafc;
    border-radius: 15px;
}

.spec-item {
    display: flex;
    align-items: center;
    gap: 12px;
}

.spec-icon {
    font-size: 1.5rem;
}

.spec-text {
    display: flex;
    flex-direction: column;
}

.spec-text strong {
    font-size: 1.1rem;
    color: #1a1a1a;
}

.spec-text span {
    font-size: 0.85rem;
    color: #64748b;
}

/* Prix */
.price-box {
    display: flex;
    align-items: flex-end;
    gap: 30px;
    margin-bottom: 30px;
    padding: 25px;
    background: linear-gradient(135deg, #fef2f2 0%, #fce7f3 100%);
    border-radius: 15px;
    border: 2px solid #fecaca;
}

.price-label {
    display: block;
    font-size: 0.85rem;
    color: #64748b;
    margin-bottom: 5px;
}

.price-value {
    font-size: 2rem;
    font-weight: 700;
    color: #DC2626;
}

.price-value-ht {
    font-size: 1.2rem;
    color: #64748b;
}

/* CTA buttons */
.cta-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-whatsapp {
    background: #ac2e2e;
    color: white;
    flex: 1;
}

.btn-whatsapp:hover {
    background: #e45e46;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #f1f5f9;
    color: #1a1a1a;
    border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
    background: #e2e8f0;
}

/* Garanties */
.guarantees {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.guarantee {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.95rem;
    color: #374151;
}

.guarantee span {
    font-size: 1.1rem;
}

/* Section caractéristiques */
.product-features {
    padding: 80px 0;
    background: white;
}

.section-title {
    font-size: 2rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 40px;
    text-align: center;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    max-width: 900px;
    margin: 0 auto;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.feature-item:hover {
    background: #f1f5f9;
    transform: translateX(5px);
}

.feature-icon {
    color: #102417;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.feature-text {
    font-size: 0.95rem;
    color: #374151;
    line-height: 1.5;
}

/* CTA final */
.product-cta {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.cta-content {
    text-align: center;
    color: white;
}

.cta-content h2 {
    font-size: 2rem;
    margin-bottom: 15px;
}

.cta-content p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 30px;
}

.cta-content .cta-buttons {
    justify-content: center;
}

.btn-whatsapp-large {
    background: 
    #883429;
    color: white;
    padding: 18px 35px;
    font-size: 1.1rem;
}

.btn-whatsapp-large:hover {
    background: #b93d38;
    transform: translateY(-3px);
}

.btn-call {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-call:hover {
    background: white;
    color: #1a1a1a;
}

/* Produits similaires */
.similar-products {
    padding: 80px 0;
    background: #f8fafc;
}

.similar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}

.similar-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: all 0.3s ease;
}

.similar-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.similar-image {
    height: 180px;
    overflow: hidden;
}

.similar-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.similar-card:hover .similar-image img {
    transform: scale(1.1);
}

.similar-info {
    padding: 20px;
}

.similar-brand {
    font-size: 0.8rem;
    color: #DC2626;
    font-weight: 600;
    text-transform: uppercase;
}

.similar-name {
    font-size: 1.1rem;
    color: #1a1a1a;
    font-weight: 600;
    margin: 8px 0;
}

.similar-price {
    font-size: 1rem;
    color: #DC2626;
    font-weight: 700;
}

/* Not found */
.not-found {
    padding: 100px 0;
    text-align: center;
}

.not-found-content {
    max-width: 400px;
    margin: 0 auto;
}

.not-found-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.not-found h2 {
    font-size: 1.5rem;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.not-found p {
    color: #64748b;
    margin-bottom: 30px;
}

.btn-primary {
    background: #DC2626;
    color: white;
}

.btn-primary:hover {
    background: #B91C1C;
}

/* Responsive */
@media (max-width: 968px) {
    .product-main {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .product-gallery {
        position: static;
    }
    
    .main-image img {
        height: 350px;
    }
    
    .name {
        font-size: 2rem;
    }
    
    .quick-specs {
        flex-wrap: wrap;
    }
    
    .cta-buttons {
        flex-direction: column;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .similar-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .product-detail-page {
        padding-top: 60px;
    }
    
    .breadcrumb {
        font-size: 0.8rem;
        flex-wrap: wrap;
    }
    
    .main-image img {
        height: 280px;
    }
    
    .badges {
        top: 12px;
        left: 12px;
        gap: 6px;
    }
    
    .badge {
        padding: 5px 10px;
        font-size: 0.7rem;
    }
    
    .name {
        font-size: 1.6rem;
    }
    
    .description {
        font-size: 1rem;
    }
    
    .quick-specs {
        padding: 20px;
        gap: 15px;
    }
    
    .spec-text strong {
        font-size: 1rem;
    }
    
    .price-box {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
        padding: 20px;
    }
    
    .price-value {
        font-size: 1.6rem;
    }
    
    .btn {
        padding: 14px 20px;
        font-size: 0.95rem;
    }
    
    .product-features,
    .product-cta,
    .similar-products {
        padding: 50px 0;
    }
    
    .section-title {
        font-size: 1.5rem;
        margin-bottom: 30px;
    }
    
    .feature-item {
        padding: 15px;
    }
    
    .cta-content h2 {
        font-size: 1.5rem;
    }
    
    .cta-content .cta-buttons {
        flex-direction: column;
        gap: 12px;
    }
    
    .similar-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .similar-image {
        height: 200px;
    }
}
</style>
