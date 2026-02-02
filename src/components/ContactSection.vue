<template>
    <!-- 
        Formulaire de Contact - Demande de devis
        Objectif: Collecter les leads qualifiés (Nom, Entreprise, Téléphone, Besoin)
    -->
    <section id="contact" class="contact-section">
        <div class="container">
            <div class="contact-content">
                <!-- Texte d'introduction -->
                <div class="contact-intro">
                    <h2 class="section-title">
                        🎯 Vous cherchez une solution d'impression fiable ?
                    </h2>
                    <p class="section-subtitle">
                        Contactez-nous dès maintenant pour un diagnostic gratuit
                    </p>

                    <!-- Bouton WhatsApp principal -->
                    <a 
                        :href="whatsappUrl" 
                        target="_blank" 
                        class="btn btn-whatsapp btn-large"
                        @click="trackWhatsAppClick"
                    >
                        <span class="btn-icon">📱</span>
                        Parler à un conseiller sur WhatsApp
                    </a>

                    <p class="or-divider">
                        <span>ou remplissez le formulaire</span>
                    </p>
                </div>

                <!-- Formulaire -->
                <div class="contact-form-wrapper">
                    <form @submit.prevent="submitForm" class="contact-form">
                        <!-- Nom -->
                        <div class="form-group">
                            <label for="nom">Nom complet *</label>
                            <input 
                                type="text" 
                                id="nom" 
                                v-model="form.nom" 
                                placeholder="Votre nom"
                                required
                                :class="{ 'error': errors.nom }"
                            />
                            <span class="error-message" v-if="errors.nom">{{ errors.nom }}</span>
                        </div>

                        <!-- Entreprise -->
                        <div class="form-group">
                            <label for="entreprise">Entreprise *</label>
                            <input 
                                type="text" 
                                id="entreprise" 
                                v-model="form.entreprise" 
                                placeholder="Nom de votre entreprise"
                                required
                                :class="{ 'error': errors.entreprise }"
                            />
                            <span class="error-message" v-if="errors.entreprise">{{ errors.entreprise }}</span>
                        </div>

                        <!-- Téléphone -->
                        <div class="form-group">
                            <label for="telephone">Téléphone *</label>
                            <input 
                                type="tel" 
                                id="telephone" 
                                v-model="form.telephone" 
                                placeholder="Ex: +229 90 00 00 00"
                                required
                                :class="{ 'error': errors.telephone }"
                            />
                            <span class="error-message" v-if="errors.telephone">{{ errors.telephone }}</span>
                        </div>

                        <!-- Email (optionnel) -->
                        <div class="form-group">
                            <label for="email">Email (optionnel)</label>
                            <input 
                                type="email" 
                                id="email" 
                                v-model="form.email" 
                                placeholder="votremail@email.com"
                                :class="{ 'error': errors.email }"
                            />
                            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
                        </div>

                        <!-- Besoin -->
                        <div class="form-group">
                            <label for="besoin">Votre besoin *</label>
                            <select 
                                id="besoin" 
                                v-model="form.besoin" 
                                required
                                :class="{ 'error': errors.besoin }"
                            >
                                <option value="">Sélectionnez votre besoin</option>
                                <option value="imprimante">Imprimante professionnelle</option>
                                <option value="copieur">Copieur multifonction</option>
                                <option value="maintenance">Maintenance / Réparation</option>
                                <option value="fournitures">Fournitures / Encres</option>
                                <option value="autre">Autre demande</option>
                            </select>
                            <span class="error-message" v-if="errors.besoin">{{ errors.besoin }}</span>
                        </div>

                        <!-- Message (optionnel) -->
                        <div class="form-group full-width">
                            <label for="message">Message (optionnel)</label>
                            <textarea 
                                id="message" 
                                v-model="form.message" 
                                rows="4"
                                placeholder="Décrivez brièvement votre besoin..."
                            ></textarea>
                        </div>

                        <!-- Bouton de soumission -->
                        <div class="form-group full-width">
                            <button 
                                type="submit" 
                                class="btn btn-primary btn-submit"
                                :disabled="isSubmitting"
                            >
                                <span v-if="isSubmitting">Envoi en cours...</span>
                                <span v-else>📨 Envoyer ma demande</span>
                            </button>
                        </div>
                    </form>

                    <!-- Message de succès -->
                    <transition name="fade">
                        <div v-if="submitSuccess" class="success-message">
                            <div class="success-icon">✅</div>
                            <h3>Demande envoyée avec succès !</h3>
                            <p>Nous vous contacterons très bientôt.</p>
                        </div>
                    </transition>
                </div>

                <!-- Informations de contact -->
                <div class="contact-info">
                    <div class="info-card">
                        <div class="info-icon">📞</div>
                        <div class="info-content">
                            <strong>Téléphone</strong>
                            <a href="tel:+22997559059">+229 97 55 90 59</a>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-icon">📍</div>
                        <div class="info-content">
                            <strong>Adresse</strong>
                            <span>Akpakpa, Bénin</span>
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="info-icon">🕐</div>
                        <div class="info-content">
                            <strong>Horaires</strong>
                            <span>Lun - Ven: 8h - 17h30</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { leadService, analyticsService } from '../services/api';

/**
 * État du formulaire
 */
const form = reactive({
    nom: '',
    entreprise: '',
    telephone: '',
    email: '',
    besoin: '',
    message: '',
    source: 'website'
});

const errors = reactive({});
const isSubmitting = ref(false);
const submitSuccess = ref(false);

/**
 * Configuration WhatsApp
 */
const whatsappNumber = '22997559059';
const whatsappMessage = encodeURIComponent('Bonjour, je souhaite obtenir un devis pour des solutions d\'impression. Pouvez-vous me rappeler ?');
const whatsappUrl = computed(() => `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);

/**
 * Validation du formulaire
 */
const validateForm = () => {
    // Réinitialiser les erreurs
    Object.keys(errors).forEach(key => delete errors[key]);
    
    let isValid = true;
    
    if (!form.nom.trim()) {
        errors.nom = 'Le nom est obligatoire';
        isValid = false;
    }
    
    if (!form.entreprise.trim()) {
        errors.entreprise = 'Le nom de l\'entreprise est obligatoire';
        isValid = false;
    }
    
    if (!form.telephone.trim()) {
        errors.telephone = 'Le numéro de téléphone est obligatoire';
        isValid = false;
    } else if (!/^[\d\s+()-]{8,20}$/.test(form.telephone)) {
        errors.telephone = 'Numéro de téléphone invalide';
        isValid = false;
    }
    
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Adresse email invalide';
        isValid = false;
    }
    
    if (!form.besoin) {
        errors.besoin = 'Veuillez sélectionner votre besoin';
        isValid = false;
    }
    
    return isValid;
};

/**
 * URL du Google Apps Script pour enregistrer les leads
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtxkB9SGWNyo8TdIHgD8bknXAevomNeWC28D-j2TMjC6TNQBh2PLnKDMsqj6rFU0VDxA/exec';

/**
 * Soumission du formulaire
 */
const submitForm = async () => {
    // Valider le formulaire
    if (!validateForm()) {
        return;
    }
    
    isSubmitting.value = true;
    
    try {
        // Préparer les données pour Google Sheets
        const formData = {
            nom: form.nom,
            email: form.email || 'Non renseigné',
            telephone: form.telephone,
            entreprise: form.entreprise,
            message: `Besoin: ${form.besoin}${form.message ? ' - ' + form.message : ''}`
        };
        
        // Envoyer vers Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Nécessaire pour Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Avec mode: 'no-cors', on ne peut pas lire la réponse
        // mais si pas d'erreur, on considère que c'est réussi
        
        // Tracker le formulaire soumis
        analyticsService.track('formulaire_soumis', {
            page: 'contact',
            metadata: { besoin: form.besoin }
        });
        
        // Afficher le message de succès
        submitSuccess.value = true;
        
        // Réinitialiser le formulaire
        Object.assign(form, {
            nom: '',
            entreprise: '',
            telephone: '',
            email: '',
            besoin: '',
            message: '',
            source: 'website'
        });
        
        // Masquer le message de succès après 5 secondes
        setTimeout(() => {
            submitSuccess.value = false;
        }, 5000);
        
    } catch (error) {
        console.error('Erreur soumission formulaire:', error);
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter sur WhatsApp.');
    } finally {
        isSubmitting.value = false;
    }
};

/**
 * Tracker le clic WhatsApp
 */
const trackWhatsAppClick = () => {
    analyticsService.trackWhatsAppClick('contact');
};
</script>

<style scoped>
.contact-section {
    padding: 100px 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
}

.contact-content {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

/* Introduction */
.contact-intro {
    text-align: center;
    color: white;
}

.section-title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.section-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
    margin-bottom: 30px;
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

.btn-large {
    padding: 18px 40px;
    font-size: 1.15rem;
}

.btn-whatsapp {
    background: #e276ac;
    color: white;
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
}

.btn-whatsapp:hover {
    background: #128c7e;
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
}

.btn-icon {
    font-size: 1.4rem;
}

.or-divider {
    margin-top: 30px;
    position: relative;
}

.or-divider span {
    background: transparent;
    padding: 0 20px;
    color: rgba(255, 255, 255, 0.7);
    position: relative;
}

.or-divider::before,
.or-divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 100px);
    height: 1px;
    background: rgba(255, 255, 255, 0.3);
}

.or-divider::before {
    left: 0;
}

.or-divider::after {
    right: 0;
}

/* Formulaire */
.contact-form-wrapper {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    position: relative;
}

.contact-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group.full-width {
    grid-column: span 2;
}

.form-group label {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 14px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f8fafc;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #DC2626;
    background: white;
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
}

.form-group input.error,
.form-group select.error {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.85rem;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.btn-submit {
    width: 100%;
    padding: 16px;
    background: #DC2626;
    color: white;
}

.btn-submit:hover:not(:disabled) {
    background: #B91C1C;
    transform: translateY(-2px);
}

.btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Message de succès */
.success-message {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
}

.success-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.success-message h3 {
    font-size: 1.5rem;
    color: #22c55e;
    margin-bottom: 10px;
}

.success-message p {
    color: #64748b;
}

/* Informations de contact */
.contact-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.info-card {
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 12px;
    color: white;
}

.info-icon {
    font-size: 2rem;
}

.info-content {
    display: flex;
    flex-direction: column;
}

.info-content strong {
    font-size: 0.9rem;
    opacity: 0.8;
}

.info-content a,
.info-content span {
    color: white;
    text-decoration: none;
    font-size: 1rem;
}

.info-content a:hover {
    text-decoration: underline;
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
    .contact-section {
        padding: 60px 0;
    }
    
    .section-title {
        font-size: 1.75rem;
    }
    
    .contact-form {
        grid-template-columns: 1fr;
    }
    
    .form-group.full-width {
        grid-column: span 1;
    }
    
    .contact-form-wrapper {
        padding: 30px 20px;
    }
    
    .contact-info {
        grid-template-columns: 1fr;
    }
    
    .btn-large {
        width: 100%;
        padding: 16px 24px;
    }
    
    .or-divider::before,
    .or-divider::after {
        width: calc(50% - 80px);
    }
}

@media (max-width: 480px) {
    .section-title {
        font-size: 1.5rem;
    }
    
    .info-card {
        padding: 15px;
    }
}
</style>
