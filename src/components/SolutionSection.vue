<template>
    <!-- 
        Section Solution - Présentation de l'entreprise comme solution complète
        Objectif: Positionner l'entreprise comme LA solution
    -->
    <section id="solutions" class="solution-section">
        <div class="container">
            <div class="solution-content">
                <!-- Texte de la solution - Centré -->
                <div class="solution-text">
                    <h2 class="section-title">
                        Nous accompagnons les entreprises et institutions avec :
                    </h2>

                    <div class="solution-list">
                        <div class="solution-item" v-for="(solution, index) in solutions" :key="index">
                            <span class="solution-check">•</span>
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
                        <span class="btn-icon"></span>
                        Demander un devis
                    </a>
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
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    padding: 100px 0;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
}

.solution-content {
    text-align: center;
}

.section-title {
    font-size: 2rem;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 35px;
    line-height: 1.3;
}

.solution-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 30px;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
}

.solution-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    font-size: 1.15rem;
    color: #374151;
    text-align: left;
    background: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.solution-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.solution-check {
    color: #DC2626;
    font-size: 1.3rem;
    flex-shrink: 0;
    font-weight: bold;
}

.solution-label {
    line-height: 1.5;
}

.solution-tagline {
    font-size: 1.2rem;
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 35px;
    padding: 18px 25px;
    background: rgba(220, 38, 38, 0.08);
    border-radius: 12px;
    border-left: 4px solid #DC2626;
    max-width: 550px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 40px;
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

/* Responsive */
@media (max-width: 768px) {
    .solution-section {
        padding: 70px 0;
    }
    
    .section-title {
        font-size: 1.7rem;
    }
    
    .solution-item {
        font-size: 1.05rem;
        padding: 14px 18px;
    }
}

@media (max-width: 600px) {
    .solution-section {
        padding: 50px 0;
    }
    
    .container {
        padding: 0 15px;
    }
    
    .section-title {
        font-size: 1.4rem;
        line-height: 1.35;
        margin-bottom: 28px;
    }
    
    .solution-list {
        gap: 12px;
    }
    
    .solution-item {
        font-size: 0.95rem;
        gap: 12px;
        padding: 14px 16px;
    }
    
    .solution-check {
        font-size: 1.1rem;
    }
    
    .solution-tagline {
        font-size: 1rem;
        padding: 14px 18px;
        margin-bottom: 28px;
    }
    
    .btn {
        width: 100%;
        padding: 16px 24px;
        font-size: 1rem;
    }
}

@media (max-width: 380px) {
    .solution-section {
        padding: 40px 0;
    }
    
    .container {
        padding: 0 12px;
    }
    
    .section-title {
        font-size: 1.25rem;
    }
    
    .solution-item {
        font-size: 0.9rem;
        padding: 12px 14px;
    }
    
    .solution-tagline {
        font-size: 0.95rem;
        padding: 12px 15px;
    }
}
</style>
