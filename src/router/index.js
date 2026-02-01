import { createRouter, createWebHashHistory } from 'vue-router';
import { analyticsService } from '../services/api';

/**
 * Configuration du routeur Vue.js
 * 
 * Pour cette application landing page, nous utilisons une seule route principale
 * mais la structure permet d'ajouter facilement d'autres pages
 */

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
        meta: {
            title: 'Copieurs & Imprimantes Professionnels - Bénin',
            description: 'Solutions d\'impression professionnelles pour entreprises et institutions au Bénin'
        }
    },
    {
        path: '/showroom',
        name: 'Showroom',
        component: () => import('../views/ShowroomPage.vue'),
        meta: {
            title: 'Showroom - Produits disponibles',
            description: 'Découvrez nos copieurs et imprimantes disponibles en showroom'
        }
    },
    {
        path: '/produit/:slug',
        name: 'ProduitDetail',
        component: () => import('../views/ProduitDetailPage.vue'),
        meta: {
            title: 'Détail produit',
            description: 'Caractéristiques détaillées du produit'
        }
    },
    // Route 404
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    // Scroll to top on navigation
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            // Scroll vers l'ancre si présente
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 80 // Offset pour le header fixe
            };
        }
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
});

// Hook de navigation pour le tracking et les meta tags
router.beforeEach((to, from, next) => {
    // Mise à jour du titre de la page
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    
    // Récupérer la source depuis les query params (utile pour Facebook Ads, QR codes, etc.)
    const source = to.query.utm_source || to.query.source || null;
    
    // Tracker la visite de page
    analyticsService.trackPageView(to.name, source);
    
    next();
});

export default router;
