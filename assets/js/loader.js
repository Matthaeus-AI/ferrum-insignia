// loader.js - Ferrum Insignia Quantum Loader System

/**
 * QuantumLoader
 * Premium page transition and loading system with metallic animations
 */
class QuantumLoader {
    constructor() {
        this.loaderTemplate = `
            <div class="quantum-loader">
                <div class="loader-metallic-overlay"></div>
                <div class="loader-particles"></div>
                <div class="loader-logo-container">
                    <div class="loader-logo">
                        <div class="loader-ferrum" data-text="FERRUM">FERRUM</div>
                        <div class="loader-divider"></div>
                        <div class="loader-insignia" data-text="INSIGNIA">INSIGNIA</div>
                    </div>
                </div>
                <div class="loader-progress-container">
                    <div class="loader-progress-bar"></div>
                </div>
                <div class="loader-status">Initializing...</div>
            </div>
            <div class="loader-transition-overlay"></div>
        `;
        
        this.loader = null;
        this.progressBar = null;
        this.statusText = null;
        this.transitionOverlay = null;
        this.particles = [];
        this.particleCount = 30;
        this.isLoading = false;
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.progressAnimationId = null;
        
        this.initialize();
    }
    
    initialize() {
        // Insert loader into DOM
        document.body.insertAdjacentHTML('beforeend', this.loaderTemplate);
        
        // Get DOM references
        this.loader = document.querySelector('.quantum-loader');
        this.progressBar = this.loader.querySelector('.loader-progress-bar');
        this.statusText = this.loader.querySelector('.loader-status');
        this.transitionOverlay = document.querySelector('.loader-transition-overlay');
        
        // Initialize particles
        this.createParticles();
        
        // Bind navigation events
        this.bindNavigationEvents();
        
        // Show loader on initial page load
        if (document.readyState === 'loading') {
            this.showLoader();
            document.addEventListener('DOMContentLoaded', () => {
                this.simulateProgress();
                
                // Hide loader when page is loaded
                window.addEventListener('load', () => {
                    this.setProgress(100, 'Bereit');
                    setTimeout(() => this.hideLoader(), 500);
                });
            });
        }
    }
    
    createParticles() {
        const particlesContainer = this.loader.querySelector('.loader-particles');
        
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'loader-particle';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random opacity
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            // Animation
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            particle.style.animation = `particleFloat ${duration}s ${delay}s infinite ease-in-out`;
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    bindNavigationEvents() {
        // Intercept link clicks to internal pages
        document.addEventListener('click', (e) => {
            // Find closest anchor element
            const anchor = e.target.closest('a');
            
            if (anchor && this.shouldIntercept(anchor)) {
                e.preventDefault();
                
                const href = anchor.getAttribute('href');
                this.navigateTo(href);
            }
        });
        
        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            this.showTransitionOverlay();
            
            setTimeout(() => {
                window.location.reload();
            }, 500);
        });
    }
    
    shouldIntercept(anchor) {
        if (!anchor.hasAttribute('href')) return false;
        
        const href = anchor.getAttribute('href');
        const isExternal = href.includes('://') || href.startsWith('//');
        const isAnchor = href.startsWith('#');
        const isMailto = href.startsWith('mailto:');
        const isTel = href.startsWith('tel:');
        const hasDownload = anchor.hasAttribute('download');
        const hasTarget = anchor.hasAttribute('target');
        
        // Don't intercept external links, anchors, mailto, tel, download, or links with target
        return !(isExternal || isAnchor || isMailto || isTel || hasDownload || hasTarget);
    }
    
    /**
     * Navigate to a new page with transition
     * @param {string} url - Target URL
     */
    navigateTo(url) {
        if (this.isLoading) return;
        
        this.showTransitionOverlay();
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
    
    /**
     * Show the loader
     */
    showLoader() {
        this.isLoading = true;
        this.currentProgress = 0;
        this.updateProgressBar();
        
        this.loader.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate particles
        this.animateParticles();
    }
    
    /**
     * Hide the loader
     */
    hideLoader() {
        if (!this.isLoading) return;
        
        this.loader.classList.remove('active');
        document.body.style.overflow = '';
        this.isLoading = false;
        
        // Stop progress animation
        if (this.progressAnimationId) {
            cancelAnimationFrame(this.progressAnimationId);
            this.progressAnimationId = null;
        }
    }
    
    /**
     * Show transition overlay
     */
    showTransitionOverlay() {
        this.transitionOverlay.classList.add('active');
    }
    
    /**
     * Hide transition overlay
     */
    hideTransitionOverlay() {
        this.transitionOverlay.classList.remove('active');
    }
    
    /**
     * Set progress value
     * @param {number} progress - Progress value (0-100)
     * @param {string} status - Status text (optional)
     */
    setProgress(progress, status = null) {
        this.targetProgress = Math.min(Math.max(progress, 0), 100);
        
        if (status) {
            this.setStatus(status);
        }
        
        // Start progress animation if not already running
        if (!this.progressAnimationId) {
            this.animateProgress();
        }
    }
    
    /**
     * Set status text
     * @param {string} text - Status text
     */
    setStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    }
    
    /**
     * Update progress bar width
     */
    updateProgressBar() {
        if (this.progressBar) {
            this.progressBar.style.width = `${this.currentProgress}%`;
        }
    }
    
    /**
     * Animate progress bar to target value
     */
    animateProgress() {
        const animate = () => {
            // Calculate increment (smoother as progress gets higher)
            const increment = (this.targetProgress - this.currentProgress) * 0.1;
            
            if (Math.abs(increment) > 0.1) {
                this.currentProgress += increment;
                this.updateProgressBar();
                this.progressAnimationId = requestAnimationFrame(animate);
            } else {
                this.currentProgress = this.targetProgress;
                this.updateProgressBar();
                this.progressAnimationId = null;
            }
        };
        
        this.progressAnimationId = requestAnimationFrame(animate);
    }
    
    /**
     * Simulate loading progress for initial page load
     */
    simulateProgress() {
        // Simulate 0-80% progress during page load
        setTimeout(() => this.setProgress(20, 'Laden...'), 200);
        setTimeout(() => this.setProgress(40, 'Ressourcen laden...'), 400);
        setTimeout(() => this.setProgress(60, 'Rendering...'), 800);
        setTimeout(() => this.setProgress(80, 'Optimieren...'), 1200);
        
        // Complete progress when page is fully loaded
        window.addEventListener('load', () => {
            this.setProgress(100, 'Bereit');
        });
    }
    
    /**
     * Animate particles
     */
    animateParticles() {
        this.particles.forEach(particle => {
            // Reset position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Animate to random position
            const targetX = Math.random() * 100;
            const targetY = Math.random() * 100;
            const duration = Math.random() * 15 + 5;
            
            particle.animate([
                { left: `${particle.style.left}`, top: `${particle.style.top}` },
                { left: `${targetX}%`, top: `${targetY}%` }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                fill: 'forwards'
            });
        });
    }
}

// Initialize the QuantumLoader when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quantumLoader = new QuantumLoader();
});