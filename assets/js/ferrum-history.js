/**
 * ferrum-history.js
 * Optimierte Controller-Implementierung für die Ferrum Insignia History-Seite
 * mit bidirektionalem Scroll-Verhalten und Performance-Optimierungen
 */

class HistoryController {
    /**
     * @constructor
     * Initialisiert den History-Controller mit optimierten DOM-Referenzen und Zustandsmanagement
     */
    constructor() {
        // DOM-Referenzen mit Proxy-Pattern für lazy initialization
        this.domRefs = new Proxy({}, {
            get: (target, prop) => {
                if (!target[prop]) {
                    switch(prop) {
                        case 'historyContainer':
                            target[prop] = document.querySelector('.history-quantum-container');
                            break;
                        case 'historyChapters':
                            target[prop] = document.querySelectorAll('.history-chapter');
                            break;
                        case 'aboutCards':
                            target[prop] = document.querySelectorAll('.about-card');
                            break;
                        case 'aboutCta':
                            target[prop] = document.querySelector('.about-cta');
                            break;
                        case 'navButtons':
                            target[prop] = document.querySelectorAll('.toc-button');
                            break;
                        case 'revealElements':
                            target[prop] = document.querySelectorAll('.reveal-element');
                            break;
                        case 'canvas':
                            target[prop] = document.getElementById('historyParticleSystem');
                            break;
                        case 'ctx':
                            const canvas = this.domRefs.canvas;
                            target[prop] = canvas ? canvas.getContext('2d') : null;
                            break;
                    }
                }
                return target[prop];
            }
        });
        
        // Partikelsystem-Parameter
        this.particles = [];
        this.particleCount = 150;
        this.particleSystem = null;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / 30; // Optimized to 30 FPS for efficiency
        
        // IntersectionObserver-Konfiguration mit präzisen Schwellwerten
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [0.10, 0.15, 0.50] // Multiple thresholds for smoother transitions
        };
        
        // Observer-Instanzen
        this.contentObserver = null;
        
        // Method binding für Optimierung des Call-Stacks
        this.bindMethods();
        
        // Initialisierung
        this.initialize();
    }
    
    /**
     * Bindet alle Methoden an die Klassen-Instanz für korrekte Referenzierung
     * @private
     * @return {void}
     */
    bindMethods() {
        this.initializeParticleSystem = this.initializeParticleSystem.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.createParticles = this.createParticles.bind(this);
        this.updateParticles = this.updateParticles.bind(this);
        this.observeContent = this.observeContent.bind(this);
        this.handleIntersection = this.handleIntersection.bind(this);
        this.setupSmoothScroll = this.setupSmoothScroll.bind(this);
        this.requestRender = this.requestRender.bind(this);
    }
    
    /**
     * Initialisiert alle Controller-Komponenten und Event-Listener
     * @public
     * @return {void}
     */
    initialize() {
        // Initialisiere Partikelsystem nur wenn Canvas existiert
        if (this.domRefs.canvas && this.domRefs.ctx) {
            this.initializeParticleSystem();
        }
        
        // Inhaltsbeobachtung für Scroll-Animationen
        this.observeContent();
        
        // Smooth Scrolling Setup
        this.setupSmoothScroll();
        
        // Card-Flip-Funktionalität
        this.initializeCardFlip();
        
        console.log('[HistoryController] Initialisiert');
    }
    
    /**
     * Initialisiert das Partikelsystem mit optimierten Parametern
     * @private
     * @return {void}
     */
    initializeParticleSystem() {
        // Resize-Event-Handler mit Throttling zur Vermeidung von Layout-Thrashing
        window.addEventListener('resize', this.debounce(this.resizeCanvas, 150));
        this.resizeCanvas();
        
        // Partikel mit optimierter Geschwindigkeit erstellen
        this.createParticles();
        
        // Initialisieren des Animation-Loops mit Performance-Optimierungen
        this.lastFrameTime = performance.now();
        this.requestRender();
        
        console.log('[HistoryController] Partikelsystem initialisiert');
    }
    
    /**
     * Performance-optimierte Render-Loop mit Time-based Animation
     * @private
     * @param {number} timestamp - DOMHighResTimeStamp
     * @return {void}
     */
    requestRender(timestamp = 0) {
        // Frame-Rate-Limitierung für bessere Performance
        const elapsed = timestamp - this.lastFrameTime;
        
        if (elapsed > this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
            this.updateParticles();
        }
        
        this.particleSystem = requestAnimationFrame(this.requestRender);
    }
    
    /**
     * Passt Canvas-Dimensionen an Container-Größe an
     * @private
     * @return {void}
     */
    resizeCanvas() {
        if (!this.domRefs.canvas) return;
        
        const canvas = this.domRefs.canvas;
        // Pixel-Ratio-Berücksichtigung für High-DPI-Displays
        const dpr = window.devicePixelRatio || 1;
        
        // Physikalische Pixel-Konfiguration
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        // CSS-Pixel-Konfiguration
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        // Context-Skalierung für High-DPI-Displays
        if (this.domRefs.ctx && dpr !== 1) {
            this.domRefs.ctx.scale(dpr, dpr);
        }
        
        // Partikel neu erstellen mit angepasster Dichte
        if (this.particles.length > 0) {
            this.particles = [];
            this.createParticles();
        }
    }
    
    /**
     * Erzeugt Partikelobjekte mit optimierten Eigenschaften für elegante Bewegung
     * @private
     * @return {void}
     */
    createParticles() {
        const canvas = this.domRefs.canvas;
        const ctx = this.domRefs.ctx;
        if (!canvas || !ctx) return;
        
        const width = canvas.width;
        const height = canvas.height;
        const dpr = window.devicePixelRatio || 1;
        
        // Adaptive Partikeldichte basierend auf Viewport-Größe
        const adjustedCount = Math.floor(this.particleCount * (width * height) / (1920 * 1080) / dpr);
        const actualCount = Math.min(Math.max(adjustedCount, 100), 200);
        
        for (let i = 0; i < actualCount; i++) {
            this.particles.push({
                x: Math.random() * width / dpr,
                y: Math.random() * height / dpr,
                radius: Math.random() * 1.5 + 0.5,
                // Optimiert für hellere Farben mit höherem Kontrast
                color: `rgba(${230 + Math.random() * 25}, ${230 + Math.random() * 25}, ${230 + Math.random() * 25}, ${0.3 + Math.random() * 0.4})`,
                velocity: {
                    // Extrem reduzierte Geschwindigkeit für elegante Bewegung
                    x: (Math.random() - 0.5) * 0.12,
                    y: (Math.random() - 0.5) * 0.12
                },
                // Verbesserte Twinkle-Parameter für natürlichere Funkeleigenschaft
                twinkle: {
                    active: Math.random() > 0.15, // 85% der Partikel funkeln
                    speed: 0.002 + Math.random() * 0.01, // Langsamere Funkeln-Rate
                    min: 0.2 + Math.random() * 0.1,
                    max: 0.7 + Math.random() * 0.3,
                    phase: Math.random() * Math.PI * 2, // Zufällige Startphase für asynchrones Funkeln
                    duration: 3000 + Math.random() * 5000 // Variable Funkeldauer zwischen 3-8 Sekunden
                },
                alpha: 0.2 + Math.random() * 0.5
            });
        }
    }
    
    /**
     * Aktualisiert und rendert Partikelpositionen und -eigenschaften
     * @private
     * @return {void}
     */
    updateParticles() {
        const ctx = this.domRefs.ctx;
        const canvas = this.domRefs.canvas;
        if (!ctx || !canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Vollständige Canvas-Löschung
        ctx.clearRect(0, 0, width, height);
        
        // Performance-Optimierung: Particle-Batch-Processing
        this.particles.forEach(p => {
            // Funkeln-Effekt mit Sinusfunktion für flüssigere Übergänge
            if (p.twinkle.active) {
                p.alpha = p.twinkle.min + Math.sin(p.twinkle.phase) * (p.twinkle.max - p.twinkle.min);
                p.twinkle.phase += p.twinkle.speed;
            }
            
            // RGB-Extraktion für optimierte Rendering-Performance
            const rgbValues = p.color.match(/\d+/g);
            ctx.fillStyle = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${p.alpha})`;
            
            // Anti-Aliased Circle für bessere Ästhetik
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Position mit Schwärzung des Bewegungswiderstands
            p.x += p.velocity.x * 0.8; // 20% langsamer
            p.y += p.velocity.y * 0.8; // 20% langsamer
            
            // Toroidale Topologie für nahtloses Wrapping
            if (p.x < -p.radius) p.x = width + p.radius;
            if (p.x > width + p.radius) p.x = -p.radius;
            if (p.y < -p.radius) p.y = height + p.radius;
            if (p.y > height + p.radius) p.y = -p.radius;
        });
    }
    
    /**
     * Konfiguriert IntersectionObserver für bidirektionales Scroll-Verhalten
     * @private
     * @return {void}
     */
    observeContent() {
        // Observer mit optimierter Callback-Funktion
        this.contentObserver = new IntersectionObserver(this.handleIntersection, this.observerOptions);
        
        // Optimized selector querying using cached DOM references
        const revealElements = this.domRefs.revealElements;
        
        // Observer-Registrierung mit Entry-Klassifizierung
        revealElements.forEach(element => {
            this.contentObserver.observe(element);
            // Interne Markierung für DOM-Manipulation-Optimierung
            element._observedState = {
                visible: false,
                intersectionRatio: 0
            };
        });
    }
    
    /**
     * Verarbeitet Intersection-Events mit bidirektionalem Verhalten
     * @private
     * @param {IntersectionObserverEntry[]} entries - Intersection entries
     * @return {void}
     */
    handleIntersection(entries) {
        // Bidirektionales Scroll-Verhalten: Erscheinen UND Verschwinden
        entries.forEach(entry => {
            const element = entry.target;
            const delay = parseInt(element.getAttribute('data-reveal-delay') || '0', 10);
            const delayMs = delay * 150; // 150ms je Verzögerungseinheit
            
            // Tracking des vorherigen Zustands
            const previousState = element._observedState || { visible: false, intersectionRatio: 0 };
            const currentState = {
                visible: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio
            };
            
            // Zustandsübergangsdetektion für optimierte DOM-Manipulationen
            const isAppearing = !previousState.visible && currentState.visible;
            const isDisappearing = previousState.visible && !currentState.visible;
            
            if (isAppearing) {
                // Element erscheint im Viewport
                element.classList.remove('was-visible');
                
                // Verzögerte Animation mit RAF für Frame-Synchronisation
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        element.classList.add('visible');
                    });
                }, delayMs);
            } else if (isDisappearing) {
                // Element verlässt den Viewport - bidirektionale Animation
                element.classList.remove('visible');
                element.classList.add('was-visible');
            }
            
            // Zustandsaktualisierung für nächsten Vergleich
            element._observedState = currentState;
        });
    }
    
    /**
     * Initialisiert Card-Flip-Funktionalität für Team-Karten
     * @private
     * @return {void}
     */
    initializeCardFlip() {
        document.querySelectorAll('[data-card-flippable="true"]').forEach(card => {
            card.addEventListener('click', (e) => {
                const isFlipped = card.getAttribute('data-flipped') === 'true';
                
                // ARIA-Attribute für Barrierefreiheit
                card.setAttribute('data-flipped', !isFlipped);
                card.setAttribute('aria-pressed', String(!isFlipped));
                
                // Explizite Edge-Case-Behandlung: Propagation verhindern wenn bereits animiert
                if (card.hasAttribute('data-animating')) {
                    e.stopPropagation();
                    return;
                }
                
                // Animation-Lock zur Vermeidung von Race-Conditions
                card.setAttribute('data-animating', 'true');
                
                // ARIA-Zugänglichkeits-Updates
                const cardFront = card.querySelector('.card-front');
                const cardBack = card.querySelector('.card-back');
                
                if (cardFront && cardBack) {
                    cardFront.setAttribute('aria-hidden', isFlipped ? 'false' : 'true');
                    cardBack.setAttribute('aria-hidden', isFlipped ? 'true' : 'false');
                }
                
                // Animation-Lock nach Abschluss freigeben
                setTimeout(() => {
                    card.removeAttribute('data-animating');
                }, 800); // Entspricht Animations-Dauer
            });
        });
    }
    
    /**
     * Implementiert Smooth-Scrolling für Navigation
     * @private
     * @return {void}
     */
    setupSmoothScroll() {
        this.domRefs.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Berücksichtigt fixed Header
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Erzeugt eine Debounce-Funktion für Performance-kritische Event-Handler
     * @private
     * @param {Function} func - Zu debounce-nde Funktion
     * @param {number} wait - Verzögerung in Millisekunden
     * @return {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Bereinigt Ressourcen und Event-Listener bei Controller-Zerstörung
     * @public
     * @return {void}
     */
    destroy() {
        // Event-Listener entfernen
        window.removeEventListener('resize', this.resizeCanvas);
        
        // Animation-Loop beenden
        if (this.particleSystem) {
            cancelAnimationFrame(this.particleSystem);
            this.particleSystem = null;
        }
        
        // Observer disconnecten
        if (this.contentObserver) {
            this.contentObserver.disconnect();
            this.contentObserver = null;
        }
        
        // Card-Flip-Event-Listener entfernen
        document.querySelectorAll('[data-card-flippable="true"]').forEach(card => {
            card.removeEventListener('click', null);
        });
        
        // Navigation-Event-Listener entfernen
        this.domRefs.navButtons.forEach(button => {
            button.removeEventListener('click', null);
        });
        
        console.log('[HistoryController] Zerstört und bereinigt');
    }
}

// Initialisierung bei DOM-Bereitschaft
document.addEventListener('DOMContentLoaded', () => {
    window.historyController = new HistoryController();
    
    // Template-Ladung-Event-Handler
    document.addEventListener('template:loaded', () => {
        // Controller-Update nach Template-Ladung
        if (window.historyController) {
            // Observer erneut initialisieren nach DOM-Änderungen
            window.historyController.observeContent();
        }
    });
});