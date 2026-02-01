<template>
    <!-- 
        Section Problèmes - Identification des douleurs clients
        Objectif: Montrer que nous comprenons la réalité terrain
    -->
    <section class="problems-section">
        <div class="container">
            <div class="problems-content">
                <!-- Liste des problèmes -->
                <div class="problems-list">
                    <div class="problem-item" v-for="(problem, index) in problems" :key="index">
                        <span class="problem-icon">❌</span>
                        <p class="problem-text">{{ problem }}</p>
                    </div>
                </div>

                <!-- Transition vers la solution -->
                <div class="transition-text">
                    <div class="arrow-down">➡️</div>
                    <h3>Nous avons la solution.</h3>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

/**
 * Liste des problèmes fréquents des clients B2B
 * Identifiés dans le cahier de charges
 */
const problems = ref([
    'Vos imprimantes tombent souvent en panne ?',
    'Votre copieur n\'est pas adapté à votre volume réel ?',
    'Vous manquez d\'un prestataire fiable pour la maintenance ?',
    'Les coûts d\'impression pèsent sur votre budget ?',
    'Vous utilisez des encres de mauvaise qualité ?'
]);
</script>

<style scoped>
.problems-section {
    background: linear-gradient(135deg, #e3e3ee 0%, #c0c0c4 100%);
    padding: 80px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.problems-content {
    text-align: center;
}

.problems-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 50px;
}

.problem-item {
    display: flex;
    align-items: center;
    gap: 15px;
    background: white;
    padding: 20px 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.problem-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.problem-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.problem-text {
    font-size: 1.1rem;
    color: #374151;
    margin: 0;
    font-weight: 500;
}

.transition-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.arrow-down {
    font-size: 2rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}

.transition-text h3 {
    font-size: 1.75rem;
    color: #1a365d;
    font-weight: 700;
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .problems-section {
        padding: 60px 0;
    }
    
    .problems-list {
        grid-template-columns: 1fr;
    }
    
    .problem-text {
        font-size: 1rem;
    }
    
    .transition-text h3 {
        font-size: 1.5rem;
    }
}
</style>
