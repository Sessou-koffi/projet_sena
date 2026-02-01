<template>
    <!-- 
        Application principale Vue.js
        Layout global avec Header et Footer
    -->
    <div id="app">
        <!-- Header global -->
        <AppHeader />
        
        <!-- Contenu des pages (via router-view) -->
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
        
        <!-- Footer global -->
        <AppFooter />
    </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<style>
/* 
 * Styles globaux de l'application
 * Reset CSS et typographie de base
 */

/* Reset CSS */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* Variables CSS globales */
:root {
    --color-primary: #2563eb;
    --color-primary-dark: #1d4ed8;
    --color-secondary: #1a365d;
    --color-success: #22c55e;
    --color-whatsapp: #25d366;
    --color-danger: #ef4444;
    --color-warning: #fbbf24;
    
    --color-text: #1a365d;
    --color-text-light: #64748b;
    --color-text-muted: #94a3b8;
    
    --color-bg: #f8fafc;
    --color-bg-white: #ffffff;
    --color-border: #e2e8f0;
    
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 15px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.1);
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 20px;
    
    --transition: all 0.3s ease;
}

/* Base HTML */
html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-family);
    color: var(--color-text);
    background-color: var(--color-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Liens */
a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition);
}

a:hover {
    color: var(--color-primary-dark);
}

/* Images */
img {
    max-width: 100%;
    height: auto;
    display: block;
}

/* Listes */
ul, ol {
    list-style: none;
}

/* Boutons */
button {
    font-family: inherit;
    cursor: pointer;
}

/* Inputs */
input,
textarea,
select {
    font-family: inherit;
    font-size: inherit;
}

/* Focus visible pour l'accessibilité */
:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
}

/* Sélection de texte */
::selection {
    background-color: var(--color-primary);
    color: white;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--color-border);
}

::-webkit-scrollbar-thumb {
    background: var(--color-text-light);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--color-text);
}

/* Utilitaires */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Animation fade pour les transitions de page */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Main content */
.main-content {
    min-height: 100vh;
}

/* Classe pour le texte visually hidden (accessibilité) */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

/* Responsive font sizing */
@media (max-width: 768px) {
    html {
        font-size: 15px;
    }
}

@media (max-width: 480px) {
    html {
        font-size: 14px;
    }
}
</style>
