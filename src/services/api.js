import axios from 'axios';

/**
 * Configuration d'Axios pour les appels API
 * 
 * Ce service gère toutes les communications avec le backend Laravel
 */

// Créer une instance Axios avec la configuration de base
const api = axios.create({
    // URL de base de l'API Laravel
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    
    // Headers par défaut
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    // Timeout de 30 secondes
    timeout: 30000,
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
    (config) => {
        // Log en mode développement
        if (import.meta.env.DEV) {
            console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Gestion des erreurs globales
        if (error.response) {
            // Erreur de réponse du serveur
            console.error(`[API Error] ${error.response.status}: ${error.response.data?.message || 'Erreur serveur'}`);
        } else if (error.request) {
            // Pas de réponse reçue
            console.error('[API Error] Pas de réponse du serveur');
        } else {
            // Erreur de configuration
            console.error('[API Error] Erreur de configuration:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;

/**
 * Services API spécifiques
 */

// Service pour les leads (formulaire de contact)
export const leadService = {
    /**
     * Envoyer une demande de devis
     * @param {Object} data - Données du formulaire
     * @returns {Promise}
     */
    async create(data) {
        const response = await api.post('/leads', data);
        return response.data;
    }
};

// Service pour les produits
export const produitService = {
    /**
     * Récupérer tous les produits
     * @param {Object} params - Paramètres de filtrage
     * @returns {Promise}
     */
    async getAll(params = {}) {
        const response = await api.get('/produits', { params });
        return response.data;
    },
    
    /**
     * Récupérer les imprimantes uniquement
     * @returns {Promise}
     */
    async getImprimantes() {
        const response = await api.get('/produits/imprimantes');
        return response.data;
    },
    
    /**
     * Récupérer les copieurs uniquement
     * @returns {Promise}
     */
    async getCopieurs() {
        const response = await api.get('/produits/copieurs');
        return response.data;
    },
    
    /**
     * Récupérer les produits du showroom
     * @returns {Promise}
     */
    async getShowroom() {
        const response = await api.get('/produits/showroom');
        return response.data;
    },
    
    /**
     * Récupérer un produit par son slug
     * @param {string} slug - Slug du produit
     * @returns {Promise}
     */
    async getBySlug(slug) {
        const response = await api.get(`/produits/${slug}`);
        return response.data;
    }
};

// Service pour les témoignages
export const temoignageService = {
    /**
     * Récupérer tous les témoignages
     * @returns {Promise}
     */
    async getAll() {
        const response = await api.get('/temoignages');
        return response.data;
    }
};

// Service pour les clients de référence
export const clientReferenceService = {
    /**
     * Récupérer tous les clients de référence
     * @returns {Promise}
     */
    async getAll() {
        const response = await api.get('/clients-reference');
        return response.data;
    }
};

// Service pour le tracking analytics
export const analyticsService = {
    /**
     * Enregistrer un événement
     * @param {string} typeEvenement - Type d'événement
     * @param {Object} data - Données additionnelles
     * @returns {Promise}
     */
    async track(typeEvenement, data = {}) {
        try {
            const response = await api.post('/analytics/track', {
                type_evenement: typeEvenement,
                ...data
            });
            return response.data;
        } catch (error) {
            // Ne pas bloquer l'expérience utilisateur en cas d'erreur de tracking
            console.warn('[Analytics] Erreur de tracking:', error.message);
            return null;
        }
    },
    
    /**
     * Tracker une visite de page
     * @param {string} page - Nom de la page
     * @param {string} source - Source du trafic
     */
    async trackPageView(page, source = null) {
        return this.track('visite_page', { page, source });
    },
    
    /**
     * Tracker un clic WhatsApp
     * @param {string} page - Page d'origine
     */
    async trackWhatsAppClick(page) {
        return this.track('clic_whatsapp', { page });
    },
    
    /**
     * Tracker un téléchargement de fiche technique
     * @param {string} produitId - ID du produit
     */
    async trackFicheDownload(produitId) {
        return this.track('telechargement_fiche', { produit_id: produitId });
    },
    
    /**
     * Tracker un clic sur un CTA
     * @param {string} ctaName - Nom du CTA
     * @param {string} page - Page d'origine
     */
    async trackCtaClick(ctaName, page) {
        return this.track('clic_cta', { 
            page,
            metadata: { cta: ctaName }
        });
    }
};

/**
 * Configuration globale de l'application
 */
export const config = {
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '22990000000',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
};

/**
 * Générer un lien WhatsApp
 * @param {string} message - Message pré-rempli
 * @returns {string} URL WhatsApp
 */
export const getWhatsAppLink = (message = '') => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`;
};
