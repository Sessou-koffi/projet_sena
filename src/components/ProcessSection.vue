<template>
    <!-- 
        Section Processus - Comment ça marche
        Objectif: Montrer la simplicité du parcours client
    -->
    <section id="processus" class="process-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Comment ça marche ?</h2>
                <p class="section-subtitle">Un processus simple et efficace</p>
            </div>

            <!-- Étapes du processus -->
            <div class="process-steps">
                <div 
                    class="step" 
                    v-for="(step, index) in steps" 
                    :key="index"
                >
                    <div class="step-number">{{ index + 1 }}</div>
                    <div class="step-content">
                        <div class="step-icon">{{ step.icon }}</div>
                        <h3 class="step-title">{{ step.title }}</h3>
                        <p class="step-description">{{ step.description }}</p>
                    </div>
                    
                    <!-- Connecteur entre étapes -->
                    <div class="step-connector" v-if="index < steps.length - 1">
                        <div class="connector-line"></div>
                        <div class="connector-arrow">→</div>
                    </div>
                </div>
            </div>

            <!-- Bonus / Avantage -->
            <div class="process-bonus">
                <div class="bonus-icon">🎁</div>
                <div class="bonus-content">
                    <strong>Bonus inclus :</strong>
                    <span>Maintenance préventive bimensuelle gratuite pendant 1 an</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

/**
 * Étapes du processus de vente
 */
const steps = ref([
    {
        icon: '📝',
        title: 'Vous demandez un devis',
        description: 'Contactez-nous via WhatsApp, téléphone ou formulaire'
    },
    {
        icon: '🔍',
        title: 'Nous analysons vos besoins',
        description: 'Un expert évalue votre volume et vos contraintes'
    },
    {
        icon: '💡',
        title: 'Nous proposons la machine adaptée',
        description: 'Recommandation personnalisée selon votre budget'
    },
    {
        icon: '🚚',
        title: 'Installation & suivi assuré',
        description: 'Livraison, installation et formation de vos équipes'
    },
    {
        icon: '🔧',
        title: 'Maintenance préventive',
        description: 'Suivi régulier pour éviter les pannes'
    }
]);
</script>

<style scoped>
.process-section {
    padding: 100px 0;
    background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
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

/* Étapes du processus */
.process-steps {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 50px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    min-width: 180px;
    max-width: 220px;
}

.step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #DC2626;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 20px;
    z-index: 2;
}

.step-content {
    background: white;
    border-radius: 15px;
    padding: 30px 20px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    height: 100%;
}

.step:hover .step-content {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.step-icon {
    font-size: 2.5rem;
    margin-bottom: 15px;
}

.step-title {
    font-size: 1.1rem;
    color: #1a1a1a;
    font-weight: 600;
    margin-bottom: 10px;
}

.step-description {
    font-size: 0.9rem;
    color: #737373;
    line-height: 1.5;
    margin: 0;
}

/* Connecteur entre étapes */
.step-connector {
    position: absolute;
    top: 20px;
    right: -30px;
    display: flex;
    align-items: center;
    z-index: 1;
}

.connector-line {
    width: 40px;
    height: 2px;
    background: #DC2626;
}

.connector-arrow {
    color: #DC2626;
    font-size: 1.2rem;
    margin-left: -5px;
}

/* Bonus */
.process-bonus {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    padding: 25px 40px;
    border-radius: 15px;
    max-width: 700px;
    margin: 0 auto;
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.bonus-icon {
    font-size: 2.5rem;
}

.bonus-content {
    font-size: 1.1rem;
}

.bonus-content strong {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 5px;
}

/* Responsive */
@media (max-width: 1024px) {
    .step-connector {
        display: none;
    }
    
    .process-steps {
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .process-section {
        padding: 60px 0;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .process-steps {
        flex-direction: column;
        align-items: center;
    }
    
    .step {
        max-width: 100%;
        width: 100%;
    }
    
    .step-content {
        padding: 25px 20px;
    }
    
    .process-bonus {
        flex-direction: column;
        text-align: center;
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .section-title {
        font-size: 1.75rem;
    }
    
    .bonus-content {
        font-size: 1rem;
    }
    
    .bonus-content strong {
        font-size: 1.1rem;
    }
}
</style>
