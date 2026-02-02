<template>
    <!-- 
        Section Solution - Présentation de l'entreprise comme solution complète
        Objectif: Positionner l'entreprise comme LA solution
    -->
    <section id="solutions" class="solution-section">
        <div class="container">
            <div class="solution-content">
                <!-- Texte de la solution -->
                <div class="solution-text">
                    <h2 class="section-title">
                        Nous accompagnons les entreprises et institutions avec :
                    </h2>

                    <div class="solution-list">
                        <div class="solution-item" v-for="(solution, index) in solutions" :key="index">
                            <span class="solution-check">✔</span>
                            <span class="solution-label">{{ solution }}</span>
                        </div>
                    </div>

                    <p class="solution-tagline">
                         Une solution complète, sans interruption de votre activité.
                    </p>

                    <!-- Bouton CTA -->
                    <a 
                        :href="whatsappUrl" 
                        target="_blank" 
                        class="btn btn-primary"
                        @click="trackCtaClick"
                    >
                        <span class="btn-icon">💬</span>
                        Demander un devis
                    </a>
                </div>

                <!-- Images des produits -->
                <div class="solution-images">
                    <div class="image-grid">
                        <div class="image-card">
                            <img 
                                src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400" 
                                alt="Copieur professionnel"
                            />
                            <span class="image-label">Copieurs robustes</span>
                        </div>
                        <!-- <div class="image-card">
                            <img 
                                src="https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=400" 
                                alt="Imprimante professionnelle"
                            />
                            <span class="image-label">Imprimantes performantes</span>
                        </div> -->
                        <div class="image-card large">
                            <img 
                                src="https://images.unsplash.com/photo-1562408590-e32931084e23?w=400" 
                                alt="Service maintenance"
                            />
                            <span class="image-label">Maintenance suivie</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { analyticsService } from '../services/api';

/**
 * Liste des solutions proposées
 */
const solutions = ref([
    'Copieurs professionnels robustes (petit, moyen et grand volume)',
    'Imprimantes professionnelles performantes',
    'Maintenance rapide et suivie',
    'Fourniture et encres disponibles localement'
]);

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappMessage = encodeURIComponent('Bonjour, je souhaite un devis pour des solutions d\'impression professionnelles.');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Tracker le clic sur le CTA
 */
const trackCtaClick = () => {
    analyticsService.trackWhatsAppClick('solutions');
    analyticsService.trackCtaClick('solutions_whatsapp', 'solutions');
};
</script>

<style scoped>
.solution-section {
    background: linear-gradient(135deg, #dd6565 0%, #f5f5f5 100%);
    padding: 100px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.solution-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.section-title {
    font-size: 2rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 30px;
    line-height: 1.3;
}

.solution-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.solution-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 1.1rem;
    color: #374151;
}

.solution-check {
    color: #DC2626;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.solution-label {
    line-height: 1.5;
}

.solution-tagline {
    font-size: 1.15rem;
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 30px;
    padding: 15px 20px;
    background: rgba(220, 38, 38, 0.08);
    border-radius: 10px;
    border-left: 4px solid #DC2626;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px 32px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
}

.btn-primary {
    background: #DC2626;
    color: white;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
}

.btn-primary:hover {
    background: #B91C1C;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
}

.btn-icon {
    font-size: 1.3rem;
}

/* Grille d'images */
.image-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.image-card {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.image-card:hover {
    transform: translateY(-5px);
}

.image-card.large {
    grid-column: span 2;
}

.image-card img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.image-card.large img {
    height: 200px;
}

.image-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 15px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 968px) {
    .solution-content {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    
    .solution-text {
        text-align: center;
    }
    
    .solution-item {
        justify-content: center;
    }
    
    .solution-images {
        max-width: 500px;
        margin: 0 auto;
    }
}

@media (max-width: 480px) {
    .solution-section {
        padding: 60px 0;
    }
    
    .section-title {
        font-size: 1.5rem;
    }
    
    .solution-item {
        font-size: 1rem;
    }
    
    .image-grid {
        grid-template-columns: 1fr;
    }
    
    .image-card.large {
        grid-column: span 1;
    }
    
    .btn {
        width: 100%;
    }
}
</style>
