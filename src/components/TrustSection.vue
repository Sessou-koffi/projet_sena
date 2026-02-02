<template>
    <!-- 
        Section Clients de Confiance + Témoignages
        Objectif: Rassurer avant la prise de contact
    -->
    <section id="temoignages" class="trust-section">
        <div class="container">
            <!-- Section logos clients -->
            <div class="clients-logos">
                <h2 class="section-title">Ils nous font confiance</h2>
                
                <div class="logos-grid" v-if="clients.length > 0">
                    <div 
                        class="logo-item" 
                        v-for="client in clients" 
                        :key="client.id"
                    >
                        <div class="logo-placeholder">
                            {{ getInitials(client.nom) }}
                        </div>
                        <span class="client-name">{{ client.nom }}</span>
                    </div>
                </div>

                <!-- Fallback si pas de clients -->
                <div class="logos-grid" v-else>
                    <div class="logo-item" v-for="n in 8" :key="n">
                        <div class="logo-placeholder">C{{ n }}</div>
                    </div>
                </div>
            </div>

            <!-- Section témoignages -->
            <div class="testimonials" v-if="temoignages.length > 0">
                <h3 class="testimonials-title">Ce que disent nos clients</h3>
                
                <div class="testimonials-slider">
                    <button 
                        class="slider-btn prev" 
                        @click="prevTestimonial"
                        :disabled="currentIndex === 0"
                    >
                        ←
                    </button>

                    <div class="testimonials-container">
                        <transition name="fade" mode="out-in">
                            <div 
                                class="testimonial-card" 
                                :key="currentTestimonial.id"
                            >
                                <div class="testimonial-rating">
                                    <span v-for="star in 5" :key="star" class="star">
                                        {{ star <= currentTestimonial.note ? '★' : '☆' }}
                                    </span>
                                </div>
                                
                                <p class="testimonial-content">
                                    "{{ currentTestimonial.contenu }}"
                                </p>
                                
                                <div class="testimonial-author">
                                    <div class="author-avatar">
                                        {{ getInitials(currentTestimonial.nom_client) }}
                                    </div>
                                    <div class="author-info">
                                        <strong>{{ currentTestimonial.nom_client }}</strong>
                                        <span v-if="currentTestimonial.poste">
                                            {{ currentTestimonial.poste }}
                                        </span>
                                        <span class="author-company">
                                            {{ currentTestimonial.entreprise }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>

                    <button 
                        class="slider-btn next" 
                        @click="nextTestimonial"
                        :disabled="currentIndex === temoignages.length - 1"
                    >
                        →
                    </button>
                </div>

                <!-- Indicateurs -->
                <div class="testimonial-dots">
                    <button 
                        v-for="(_, index) in temoignages" 
                        :key="index"
                        :class="['dot', { active: currentIndex === index }]"
                        @click="goToTestimonial(index)"
                    ></button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { temoignageService, clientReferenceService } from '../services/api';

/**
 * État des données
 */
const clients = ref([]);
const temoignages = ref([]);
const currentIndex = ref(0);

/**
 * Témoignage actuel
 */
const currentTestimonial = computed(() => {
    return temoignages.value[currentIndex.value] || {};
});

/**
 * Navigation des témoignages
 */
const nextTestimonial = () => {
    if (currentIndex.value < temoignages.value.length - 1) {
        currentIndex.value++;
    }
};

const prevTestimonial = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const goToTestimonial = (index) => {
    currentIndex.value = index;
};

/**
 * Extraire les initiales d'un nom
 */
const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
};

/**
 * Charger les données depuis l'API
 */
const loadData = async () => {
    try {
        // Charger les clients de référence
        const clientsResponse = await clientReferenceService.getAll();
        if (clientsResponse.success) {
            clients.value = clientsResponse.data;
        }

        // Charger les témoignages
        const temoignagesResponse = await temoignageService.getAll();
        if (temoignagesResponse.success) {
            temoignages.value = temoignagesResponse.data;
        }
    } catch (error) {
        console.error('Erreur chargement données trust section:', error);
    }
};

// Charger les données au montage
onMounted(() => {
    loadData();
});
</script>

<style scoped>
.trust-section {
    padding: 100px 0;
    background: white;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Section logos clients */
.clients-logos {
    text-align: center;
    margin-bottom: 80px;
}

.section-title {
    font-size: 2rem;
    color: #1a365d;
    font-weight: 700;
    margin-bottom: 40px;
}

.logos-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
    max-width: 900px;
    margin: 0 auto;
}

.logo-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.logo-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
    color: #64748b;
    transition: all 0.3s ease;
}

.logo-item:hover .logo-placeholder {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    transform: scale(1.1);
}

.client-name {
    font-size: 0.85rem;
    color: #64748b;
    text-align: center;
    max-width: 150px;
}

/* Section témoignages */
.testimonials {
    max-width: 800px;
    margin: 0 auto;
}

.testimonials-title {
    text-align: center;
    font-size: 1.75rem;
    color: #1a365d;
    margin-bottom: 40px;
}

.testimonials-slider {
    display: flex;
    align-items: center;
    gap: 20px;
}

.slider-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: white;
    color: #64748b;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.slider-btn:hover:not(:disabled) {
    border-color: #2563eb;
    color: #2563eb;
    background: #f0f9ff;
}

.slider-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.testimonials-container {
    flex: 1;
    overflow: hidden;
}

.testimonial-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 20px;
    padding: 40px;
    text-align: center;
}

.testimonial-rating {
    margin-bottom: 20px;
}

.star {
    font-size: 1.5rem;
    color: #fbbf24;
}

.testimonial-content {
    font-size: 1.15rem;
    color: #374151;
    line-height: 1.8;
    font-style: italic;
    margin-bottom: 30px;
}

.testimonial-author {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.author-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
}

.author-info {
    text-align: left;
}

.author-info strong {
    display: block;
    color: #1a365d;
    font-size: 1.1rem;
}

.author-info span {
    display: block;
    color: #64748b;
    font-size: 0.9rem;
}

.author-company {
    color: #2563eb !important;
    font-weight: 500;
}

/* Indicateurs */
.testimonial-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 30px;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e2e8f0;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.dot.active {
    background: #2563eb;
    transform: scale(1.2);
}

/* Animation fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .trust-section {
        padding: 60px 0;
    }
    
    .logos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .testimonials-slider {
        flex-direction: column;
    }
    
    .slider-btn {
        display: none;
    }
    
    .testimonial-card {
        padding: 30px 20px;
    }
    
    .testimonial-content {
        font-size: 1rem;
    }
    
    .section-title {
        font-size: 1.75rem;
    }
}

@media (max-width: 600px) {
    .trust-section {
        padding: 50px 0;
    }
    
    .container {
        padding: 0 15px;
    }
    
    .clients-logos {
        margin-bottom: 50px;
    }
    
    .section-title {
        font-size: 1.4rem;
        margin-bottom: 30px;
    }
    
    .logos-grid {
        gap: 15px;
        max-width: 100%;
    }
    
    .logo-placeholder {
        width: 55px;
        height: 55px;
        font-size: 0.9rem;
    }
    
    .client-name {
        font-size: 0.75rem;
        max-width: 100px;
    }
    
    .testimonials-title {
        font-size: 1.3rem;
        margin-bottom: 25px;
    }
    
    .testimonial-card {
        padding: 25px 15px;
        border-radius: 15px;
    }
    
    .star {
        font-size: 1.2rem;
    }
    
    .testimonial-content {
        font-size: 0.95rem;
        line-height: 1.6;
        margin-bottom: 20px;
    }
    
    .author-avatar {
        width: 50px;
        height: 50px;
        font-size: 1rem;
    }
    
    .author-info strong {
        font-size: 1rem;
    }
    
    .author-info span {
        font-size: 0.85rem;
    }
    
    .testimonial-dots {
        margin-top: 20px;
        gap: 8px;
    }
    
    .dot {
        width: 10px;
        height: 10px;
    }
}

@media (max-width: 380px) {
    .section-title {
        font-size: 1.25rem;
    }
    
    .logos-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
    
    .logo-placeholder {
        width: 50px;
        height: 50px;
        font-size: 0.85rem;
    }
    
    .testimonial-author {
        flex-direction: column;
        text-align: center;
    }
    
    .author-info {
        text-align: center;
    }
}
</style>
