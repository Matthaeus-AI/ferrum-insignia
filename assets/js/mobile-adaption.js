/**
 * mobile-adaptation.js - Ferrum Insignia Mobile Adaptation Layer
 * 
 * Ein hochperformantes Adaptionsmodul zur dynamischen Korrektur von responsiven
 * Darstellungsfehlern ohne Modifikation der Kerncodebasis.
 * 
 * Der Mobile Adaptation Layer (MAL) verwendet einen dreistufigen Ansatz:
 * 1. Runtime Feature-Detektion und Viewport-Klassifikation
 * 2. CSS-Injektion von präzisen Korrekturregeln mit hoher Spezifität
 * 3. DOM/Rendering-Pipeline-Optimierung für ressourcenkonstrained Geräte
 */

class MobileAdaptationLayer {
    /**
     * Initialisiert den Mobile Adaptation Layer mit optimalen Konfigurationsparametern
     */
    constructor(options = {}) {
        // Core-Konfiguration
        this.config = {
            // Schaltpunkte für Gerätetypen
            breakpoints: {
                mobileSmall: 576,
                mobileLarge: 768,
                tablet: 992,
                desktop: 1200,
                desktopLarge: 1600
            },
            // Feature-Toggles für optimale Ressourcennutzung
            optimizations: {
                disableParticlesOnMobile: true,         // Deaktiviert Canvas-Particles auf Mobilgeräten
                reduceAnimationComplexity: true,        // Reduziert Animation-Komplexität
                optimizeGPUAcceleration: true,          // Optimiert GPU-Beschleunigung
                applyLayoutNormalization: true,         // Korrigiert Layout-Shifts
                fixProductCardFlexLayout: true,         // Spezifische Korrektur für Produktkarten
                optimizeCanvasRendering: true,          // Optimiert Canvas-Rendering
                fixNavigationRendering: true,           // Korrigiert Navigations-Rendering
                useRenderingThrottling: true            // Implementiert Renderings-Drosselung
            },
            // Performance-Tuning
            performance: {
                renderingThrottleMs: 100,               // Rendering-Drosselung in ms
                domBatchSize: 5,                        // DOM-Update-Batchgröße
                animationFPS: 30,                       // Ziel-FPS für Animationen auf Mobilgeräten
                intersectionThreshold: 0.1              // IntersectionObserver-Schwellwert
            },
            // DOM-Selektoren für Zielkomponenten
            selectors: {
                productCard: '.product-card',
                productInfo: '.product-info',
                productContainer: '.product-container', 
                heroParticles: '#heroParticleSystem',
                canvasRenderings: '.hero-canvas',
                navigationLinks: '.nav-link',
                logoElements: '.logo-ferrum, .logo-insignia',
                sections: 'section[data-section]'
            },
            // Debug-Konfiguration
            debug: false
        };
        
        // Überschreiben der Standardkonfiguration mit bereitgestellten Optionen
        this.config = this._mergeDeep(this.config, options);
        
        // Runtime-Status
        this.state = {
            isMobile: false,
            isTablet: false,
            deviceType: null,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            isHighDensityDisplay: (window.devicePixelRatio || 1) > 1.5,
            hasReducedMotion: this._hasReducedMotion(),
            hasTouchCapability: this._hasTouchCapability(),
            isLowEndDevice: this._isLowEndDevice(),
            hasAppliedFixes: false,
            mutationObserver: null,
            resizeObserverActive: false,
            throttleTimer: null,
            isInitialized: false
        };
    }
    
    /**
     * Initialisiert den Mobile Adaptation Layer und führt Geräteerkennung durch
     * @public
     */
    initialize() {
        if (this.state.isInitialized) return;
        
        // 1. Erfasse aktuelle Viewport-Informationen
        this._updateViewportInformation();
        
        // 2. Klassifiziere Gerätetyp
        this._classifyDeviceType();
        
        // 3. Debug-Informationen ausgeben
        this._debugLog('Mobile Adaptation Layer initialisiert');
        this._debugLog('Geräteinformationen:', {
            deviceType: this.state.deviceType,
            viewportSize: `${this.state.viewportWidth}x${this.state.viewportHeight}`,
            pixelRatio: this.state.pixelRatio,
            isHighDensity: this.state.isHighDensityDisplay,
            hasReducedMotion: this.state.hasReducedMotion,
            hasTouchCapability: this.state.hasTouchCapability,
            isLowEndDevice: this.state.isLowEndDevice
        });
        
        // 4. Ereignishandler registrieren
        this._bindEvents();
        
        // 5. Führe Adaption durch, wenn mobiles Gerät erkannt wurde
        if (this.state.isMobile || this.state.isTablet || this.state.isLowEndDevice) {
            this.applyMobileAdaptation();
        }
        
        this.state.isInitialized = true;
        
        // 6. Broadcast Event für andere Komponenten
        document.dispatchEvent(new CustomEvent('mobileAdaptationInitialized', {
            detail: {
                deviceType: this.state.deviceType,
                isMobile: this.state.isMobile,
                isTablet: this.state.isTablet
            }
        }));
    }
    
    /**
     * Führt die Mobile-Adaption mit präzisen Korrekturmaßnahmen durch
     * @public
     */
    applyMobileAdaptation() {
        if (this.state.hasAppliedFixes) return;
        
        this._debugLog(`Mobile Adaptation wird angewendet für: ${this.state.deviceType}`);
        
        // 1. CSS-Korrekturen für Layoutnormalisierung anwenden
        if (this.config.optimizations.applyLayoutNormalization) {
            this._injectMobileOptimizedStyles();
        }
        
        // 2. DOM-Struktur optimieren und normalisieren
        if (this.config.optimizations.fixProductCardFlexLayout) {
            this._normalizeProductCardLayout();
        }
        
        // 3. Canvas-Renderingoptimierungen für Partikelsysteme
        if (this.config.optimizations.optimizeCanvasRendering) {
            this._optimizeCanvasRendering();
        }
        
        // 4. GPU-Beschleunigungsoptimierungen
        if (this.config.optimizations.optimizeGPUAcceleration) {
            this._optimizeGPUAcceleration();
        }
        
        // 5. Animationskomplexität reduzieren
        if (this.config.optimizations.reduceAnimationComplexity) {
            this._reduceAnimationComplexity();
        }
        
        // 6. Korrektur des Navigation-Renderings
        if (this.config.optimizations.fixNavigationRendering) {
            this._fixNavigationRendering();
        }
        
        // 7. Rendering-Pipeline-Optimierungen anwenden
        if (this.config.optimizations.useRenderingThrottling) {
            this._applyRenderingOptimizations();
        }
        
        this.state.hasAppliedFixes = true;
        this._debugLog('Mobile Adaptation vollständig angewendet');
        
        // 8. Empfehlungen für zukünftige Verbesserungen anzeigen
        this._logMobileOptimizationRecommendations();
    }
    
    /**
     * Aktualisiert die Viewport-Informationen mit aktuellen Werten
     * @private
     */
    _updateViewportInformation() {
        this.state.viewportWidth = window.innerWidth;
        this.state.viewportHeight = window.innerHeight;
        this.state.pixelRatio = window.devicePixelRatio || 1;
        this.state.isHighDensityDisplay = this.state.pixelRatio > 1.5;
    }
    
    /**
     * Klassifiziert den Gerätetyp basierend auf Viewport und Eigenschaften
     * @private
     */
    _classifyDeviceType() {
        const { viewportWidth } = this.state;
        const { breakpoints } = this.config;
        
        // Klassifikation basierend auf Viewport-Breite
        if (viewportWidth < breakpoints.mobileSmall) {
            this.state.deviceType = 'mobile-small';
            this.state.isMobile = true;
        } else if (viewportWidth < breakpoints.mobileLarge) {
            this.state.deviceType = 'mobile-large';
            this.state.isMobile = true;
        } else if (viewportWidth < breakpoints.tablet) {
            this.state.deviceType = 'tablet';
            this.state.isTablet = true;
        } else if (viewportWidth < breakpoints.desktop) {
            this.state.deviceType = 'desktop-small';
        } else if (viewportWidth < breakpoints.desktopLarge) {
            this.state.deviceType = 'desktop';
        } else {
            this.state.deviceType = 'desktop-large';
        }
    }
    
    /**
     * Erkennt, ob das System für reduzierte Animation konfiguriert ist
     * @returns {boolean} true wenn reduzierte Animation aktiviert ist
     * @private
     */
    _hasReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    /**
     * Erkennt, ob das Gerät Touch-Unterstützung hat
     * @returns {boolean} true wenn Touch-Unterstützung vorhanden ist
     * @private
     */
    _hasTouchCapability() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }
    
    /**
     * Heuristik zur Identifikation von leistungsschwachen Geräten
     * @returns {boolean} true wenn Gerät als leistungsschwach erkannt wird
     * @private
     */
    _isLowEndDevice() {
        // Heuristische Anzeichen für leistungsschwache Geräte
        const hasSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
        const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
        const isLowEndVirtualDevice = window.navigator.userAgent.indexOf('Intel(R) Xeon(R)') !== -1;
        
        return hasSlowCPU || hasLimitedMemory || isLowEndVirtualDevice || this.state.pixelRatio < 1.5;
    }
    
    /**
     * Registriert Ereignishandler für Viewport-Änderungen
     * @private
     */
    _bindEvents() {
        // Optimierter Resize-Handler mit Throttling
        const resizeHandler = this._throttle(() => {
            this._updateViewportInformation();
            this._classifyDeviceType();
            
            // Überprüfen, ob Anpassungen angewendet werden müssen (bei Rotation)
            if ((this.state.isMobile || this.state.isTablet) && !this.state.hasAppliedFixes) {
                this.applyMobileAdaptation();
            }
            
            // Event für andere Komponenten aussenden
            document.dispatchEvent(new CustomEvent('viewportChanged', {
                detail: {
                    deviceType: this.state.deviceType,
                    viewportSize: {
                        width: this.state.viewportWidth,
                        height: this.state.viewportHeight
                    }
                }
            }));
        }, 150);
        
        window.addEventListener('resize', resizeHandler, { passive: true });
        
        // Orientierungswechsel-Ereignis für zusätzliche Präzision
        if ('onorientationchange' in window) {
            window.addEventListener('orientationchange', resizeHandler, { passive: true });
        }
        
        // Erkennung von DOM-Änderungen für dynamisch geladene Inhalte
        this._observeDOMChanges();
    }
    
    /**
     * Injiziert optimierte CSS-Regeln für mobile Displays
     * @private
     */
    _injectMobileOptimizedStyles() {
        // Erstelle Style-Element mit höchster Spezifität
        const styleElement = document.createElement('style');
        styleElement.id = 'mobile-adaptation-layer';
        
        // Build CSS mit Device-Type-spezifischen Regeln
        let cssRules = '';
        
        // Basis Mobile-Optimierungen
        if (this.state.isMobile) {
            cssRules += `
                /* Mobile Basisoptimierungen mit maximaler Spezifität */
                .product-viewport[data-layout] .product-container {
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: calc(var(--spacing-molecular) * 1.5) !important;
                    width: 100% !important;
                    padding: 0 var(--spacing-molecular) !important;
                }
                
                .product-card {
                    transform: none !important;
                    opacity: 1 !important;
                    max-width: 100% !important;
                    width: 100% !important;
                    height: auto !important;
                    min-height: 260px !important;
                }
                
                .product-info {
                    transform: none !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                .product-title {
                    margin-top: var(--spacing-molecular) !important;
                    font-size: calc(1.8rem) !important;
                }
                
                .card-front, .card-back {
                    transform-style: flat !important;
                }
                
                .hero-quantum {
                    height: auto !important;
                    min-height: 480px !important;
                }
                
                .hero-title {
                    flex-direction: column !important;
                    gap: var(--spacing-atomic) !important;
                }
                
                .title-ferrum, .title-insignia {
                    font-size: 2.5rem !important;
                }
                
                .title-divider {
                    width: 80px !important;
                    height: 2px !important;
                }
                
                .hero-subtitle {
                    font-size: 1.2rem !important;
                    padding: 0 var(--spacing-cellular) !important;
                }
                
                /* Scroll-Optimierungen */
                html, body {
                    scroll-behavior: auto !important;
                }
                
                /* Reduzierte Übergänge */
                *, *::before, *::after {
                    transition-duration: 300ms !important;
                }
                
                /* Verhindere Overflow-Probleme */
                .quantum-scroll-container,
                section[data-section] {
                    width: 100% !important;
                    overflow-x: hidden !important;
                }
                
                /* Optimiere Story-Panels */
                .story-panels {
                    grid-template-columns: 1fr !important;
                    gap: var(--spacing-molecular) !important;
                }
                
                .story-panel {
                    width: 100% !important;
                }
                
                /* Korrigiere Feature-Sektion */
                .tech-grid {
                    grid-template-columns: 1fr !important;
                    gap: var(--spacing-cellular) !important;
                }
                
                /* Kontaktformular-Layout */
                .contact-grid {
                    grid-template-columns: 1fr !important;
                    gap: var(--spacing-cellular) !important;
                }
                
                .contact-info {
                    text-align: center !important;
                }
            `;
            
            // Mobile-Small spezifische Anpassungen
            if (this.state.deviceType === 'mobile-small') {
                cssRules += `
                    /* Mobile-Small (< 576px) spezifische Optimierungen */
                    .title-ferrum, .title-insignia {
                        font-size: 2rem !important;
                    }
                    
                    .product-card {
                        min-height: 220px !important;
                    }
                    
                    .card-logo {
                        font-size: 1.8rem !important;
                    }
                    
                    .configurator-button,
                    .mehr-erfahren-button {
                        padding: var(--spacing-atomic) var(--spacing-molecular) !important;
                        font-size: 0.8rem !important;
                        width: 100% !important;
                        max-width: 300px !important;
                    }
                    
                    .card-details .name {
                        font-size: 1.1rem !important;
                    }
                    
                    .section-title {
                        font-size: 1.8rem !important;
                    }
                `;
            }
        }
        
        // Tablet-Optimierungen
        if (this.state.isTablet) {
            cssRules += `
                /* Tablet (768px-991px) Optimierungen */
                .product-viewport[data-layout] .product-container {
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: var(--spacing-cellular) !important;
                }
                
                .product-card {
                    transform: none !important;
                    opacity: 1 !important;
                    max-width: 450px !important;
                    width: 100% !important;
                }
                
                .product-info {
                    transform: none !important;
                    opacity: 1 !important;
                    text-align: center !important;
                    width: 100% !important;
                    max-width: 450px !important;
                }
                
                /* Optimierte Grid-Layouts für Tablet */
                .story-panels {
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
                    gap: var(--spacing-molecular) !important;
                }
                
                .tech-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: var(--spacing-cellular) !important;
                }
            `;
        }
        
        // Allgemeine Leistungsoptimierungen für alle mobilen Geräte
        if (this.state.isMobile || this.state.isTablet || this.state.isLowEndDevice) {
            cssRules += `
                /* Performance-Optimierungen */
                .card-shine,
                .metallic-shine-overlay,
                .chromatic-layer,
                .login-shimmer,
                .button-shimmer,
                .cta-reflection {
                    display: none !important;
                }
                
                /* Deaktiviere GPU-intensive Animationen */
                @keyframes disableAnimations {
                    0%, 100% { transform: none !important; }
                }
                
                .card-front .card-metallic,
                .title-ferrum::after,
                .title-insignia::after,
                .logo-ferrum::after,
                .logo-insignia::after,
                .section-divider::after {
                    animation: disableAnimations 0.01s forwards !important;
                }
                
                /* Reduziere will-change-Eigenschaften */
                .nav-link,
                .nav-indicator,
                .trigger-line,
                .product-card,
                .section-title,
                .card-inner {
                    will-change: auto !important;
                }
                
                /* Korrigiere Sektionshöhen */
                section[data-section] {
                    height: auto !important;
                    min-height: 0 !important;
                    padding: var(--spacing-organic) 0 !important;
                }
                
                .hero-quantum {
                    min-height: 480px !important;
                }
            `;
        }
        
        // CSS für Geräte mit reduzierter Bewegung
        if (this.state.hasReducedMotion) {
            cssRules += `
                /* Reduzierte Bewegungsoptimierungen */
                * {
                    animation-duration: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                }
            `;
        }
        
        // CSS für Low-End-Geräte
        if (this.state.isLowEndDevice) {
            cssRules += `
                /* Low-End-Geräteoptimierungen */
                canvas {
                    display: none !important;
                }
                
                .section-title::after,
                .chapter-title::after,
                .divider-line {
                    opacity: 0.5 !important;
                    height: 1px !important;
                }
                
                /* Einfachere Farbverläufe */
                .card-metallic,
                .silver-metallic,
                .black-metallic,
                .gold-imperial {
                    background: #c0c0c0 !important;
                }
                
                .black-metallic,
                .black-satin {
                    background: #1a1a1a !important;
                }
                
                .gold-imperial {
                    background: #d4af37 !important;
                }
            `;
        }
        
        // CSS hinzufügen und in Document einfügen
        styleElement.textContent = cssRules;
        document.head.appendChild(styleElement);
        
        this._debugLog('Mobile-optimierte Stile eingefügt');
    }
    
    /**
     * Normalisiert Produktkarten-Layout für Konsistenz
     * @private
     */
    _normalizeProductCardLayout() {
        // Selektieren der Produktcontainer-Elemente
        const productContainers = document.querySelectorAll(this.config.selectors.productContainer);
        
        if (!productContainers.length) {
            this._debugLog('Keine Produktcontainer gefunden, Normalisierung übersprungen');
            return;
        }
        
        productContainers.forEach(container => {
            // Erzwinge Column-Layout für alle Produktcontainer
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            
            // Standardisiere gap
            container.style.gap = 'var(--spacing-molecular)';
            
            // Korrigiere Product-Card
            const productCard = container.querySelector(this.config.selectors.productCard);
            if (productCard) {
                productCard.style.transform = 'none';
                productCard.style.opacity = '1';
                productCard.style.width = '100%';
                productCard.style.maxWidth = this.state.isMobile ? '320px' : '450px';
                
                // Sicherstellen, dass 3D-Transforms auf Mobilgeräten korrekt funktionieren
                const cardInner = productCard.querySelector('.card-inner');
                if (cardInner) {
                    cardInner.style.transformStyle = 'preserve-3d';
                    cardInner.style.webkitTransformStyle = 'preserve-3d';
                }
            }
            
            // Korrigiere Product-Info
            const productInfo = container.querySelector(this.config.selectors.productInfo);
            if (productInfo) {
                productInfo.style.transform = 'none';
                productInfo.style.opacity = '1';
                productInfo.style.textAlign = 'center';
                productInfo.style.width = '100%';
                productInfo.style.maxWidth = this.state.isMobile ? '320px' : '450px';
            }
        });
        
        this._debugLog(`${productContainers.length} Produktcontainer normalisiert`);
    }
    
    /**
     * Optimiert Canvas-Rendering für verbesserte Leistung auf Mobilgeräten
     * @private
     */
    _optimizeCanvasRendering() {
        // Deaktiviere komplexe Partikelsysteme auf Mobilgeräten
        if (this.config.optimizations.disableParticlesOnMobile && (this.state.isMobile || this.state.isLowEndDevice)) {
            const canvasElements = document.querySelectorAll(this.config.selectors.canvasRenderings);
            
            canvasElements.forEach(canvas => {
                // Verstecke Canvas-Element
                canvas.style.display = 'none';
                canvas.style.opacity = '0';
                canvas.style.visibility = 'hidden';
                
                // Versuche, zugehörige Animationen zu beenden
                const canvasId = canvas.id;
                
                // Spezifisches Handling für bekannte Particle-Systeme
                if (canvasId === 'heroParticleSystem' && window.particleSystem) {
                    // Versuche, Partikelsystem zu beenden
                    try {
                        window.particleSystem.destroy();
                        this._debugLog('HeroParticleSystem beendet');
                    } catch (e) {
                        this._debugLog('Fehler beim Beenden des HeroParticleSystem:', e);
                    }
                }
            });
            
            this._debugLog(`${canvasElements.length} Canvas-Elemente deaktiviert`);
        } else if (this.state.isTablet) {
            // Reduziere Qualität/Komplexität auf Tablets
            const heroCanvas = document.querySelector(this.config.selectors.heroParticles);
            
            if (heroCanvas && window.particleSystem) {
                try {
                    // Setze Partikelanzahl auf die Hälfte
                    window.particleSystem.particleCount = Math.floor(window.particleSystem.particleCount / 2);
                    
                    // Reduziere Framerate
                    window.particleSystem.targetFPS = this.config.performance.animationFPS;
                    
                    this._debugLog('Canvas-Rendering für Tablet optimiert');
                } catch (e) {
                    this._debugLog('Fehler bei der Canvas-Optimierung für Tablet:', e);
                }
            }
        }
    }
    
    /**
     * Optimiert GPU-Beschleunigung durch selektive Reduktion von GPU-intensiven Eigenschaften
     * @private
     */
    _optimizeGPUAcceleration() {
        // Entferne übermäßige will-change-Eigenschaften
        const elementsWithWillChange = document.querySelectorAll('[style*="will-change"]');
        
        elementsWithWillChange.forEach(element => {
            element.style.willChange = 'auto';
        });
        
        this._debugLog(`${elementsWithWillChange.length} Elemente mit will-change optimiert`);
        
        // Reduziere transform: translateZ(0) für bessere Leistung
        const elementsWithTranslateZ = document.querySelectorAll('[style*="translateZ"]');
        
        elementsWithTranslateZ.forEach(element => {
            const style = element.getAttribute('style');
            if (style && style.includes('translateZ')) {
                element.setAttribute('style', style.replace(/translateZ\([^)]+\)/g, ''));
            }
        });
        
        this._debugLog(`${elementsWithTranslateZ.length} Elemente mit translateZ optimiert`);
        
        // Anpassung der Logo-Element-Animation für Leistungsoptimierung
        const logoElements = document.querySelectorAll(this.config.selectors.logoElements);
        
        logoElements.forEach(logo => {
            const afterElement = window.getComputedStyle(logo, '::after');
            
            if (afterElement && afterElement.animation !== 'none') {
                // Füge Animation-Override ein
                const styleTag = document.createElement('style');
                styleTag.textContent = `
                    ${this.config.selectors.logoElements}::after {
                        animation: none !important;
                        opacity: 0 !important;
                    }
                `;
                document.head.appendChild(styleTag);
                
                this._debugLog('Logo-Pseudoelementanimationen deaktiviert');
                break;
            }
        });
    }
    
    /**
     * Reduziert Animationskomplexität für verbesserte Leistung
     * @private
     */
    _reduceAnimationComplexity() {
        // Konfiguriere globalen CSS-Eintrag für vereinfachte Animationen
        const animationStyle = document.createElement('style');
        animationStyle.id = 'reduced-animation-complexity';
        
        // Gerätespezifische Optimierungen
        const reducedAnimations = this.state.isLowEndDevice || this.state.isMobile;
        const simplifiedAnimations = this.state.isTablet || this.state.hasReducedMotion;
        
        let cssRules = '';
        
        // Drastische Reduzierung für Low-End oder Mobile
        if (reducedAnimations) {
            cssRules += `
                /* Drastische Animationsreduzierung */
                @keyframes disabledAnimation {
                    0%, 100% { transform: none; }
                }
                
                .card-shine, 
                .button-shimmer,
                .cta-reflection,
                .section-divider::after,
                .logo-reflection,
                .metallic-shine-overlay,
                .logo-ferrum::after,
                .logo-insignia::after,
                .title-ferrum::after,
                .title-insignia::after {
                    display: none !important;
                    animation: none !important;
                }
                
                .title-ferrum, 
                .title-insignia,
                .logo-ferrum, 
                .logo-insignia {
                    animation: none !important;
                    background: var(--text-primary) !important;
                    -webkit-text-fill-color: var(--text-primary) !important;
                    color: var(--text-primary) !important;
                }
                
                .card-front .card-metallic:hover {
                    transform: none !important;
                }
                
                .card-inner {
                    transition-duration: 1000ms !important;
                }
            `;
        } 
        // Gemäßigte Reduzierung für Tablets
        else if (simplifiedAnimations) {
            cssRules += `
                /* Gemäßigte Animationsreduzierung */
                .card-shine, 
                .section-divider::after,
                .logo-reflection {
                    animation-duration: 8s !important;
                    animation-delay: 1s !important;
                }
                
                .title-ferrum::after,
                .title-insignia::after,
                .logo-ferrum::after,
                .logo-insignia::after {
                    animation-duration: 12s !important;
                }
                
                .card-inner {
                    transition-duration: 800ms !important;
                }
            `;
        }
        
        // Inkonsistente Animationen normalisieren
        cssRules += `
            /* Animation-Basis-Normalisierung */
            .product-card, 
            .product-info,
            .section-title,
            .story-content,
            .tech-feature,
            .about-content,
            .contact-info,
            .contact-form {
                transition: opacity 0.8s var(--ease-gravitational),
                            transform 0.8s var(--ease-gravitational) !important;
            }
            
            /* Stellen Sie sicher, dass Produktkarten sichtbar sind */
            .product-card.visible, 
            .product-info.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            /* Stellen Sie sicher, dass Sektionsüberschriften sichtbar sind */
            .section-title.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        
        // Stilregeln anwenden
        animationStyle.textContent = cssRules;
        document.head.appendChild(animationStyle);
        
        this._debugLog('Animationskomplexität reduziert');
    }
    
    /**
     * Korrigiert Rendering-Probleme mit der Navigation
     * @private
     */
    _fixNavigationRendering() {
        // Setzt alle Navigationsvariablen zurück
        const navLinks = document.querySelectorAll(this.config.selectors.navigationLinks);
        
        navLinks.forEach(link => {
            // Setze explizite Sichtbarkeit
            link.style.opacity = '1';
            link.style.visibility = 'visible';
            
            // Lösche Transformationen
            link.style.transform = 'none';
        });
        
        // Korrigiere Navigation-Container für mobile Ansicht
        const navContainer = document.querySelector('.quantum-navigation');
        if (navContainer) {
            navContainer.style.opacity = '1';
            navContainer.style.visibility = 'visible';
        }
        
        // Optimiere mobile Navigation
        const mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
        if (mobileNavTrigger) {
            // Verbessere Touch-Ziel
            mobileNavTrigger.style.padding = '10px';
        }
        
        this._debugLog('Navigation-Rendering korrigiert');
    }
    
    /**
     * Wendet Rendering-Pipeline-Optimierungen für gleichmäßigeres Rendering an
     * @private
     */
    _applyRenderingOptimizations() {
        // 1. IntersectionObserver mit reduzierter Threshold und Callback-Rate
        const lowerIntersectionThreshold = this.config.performance.intersectionThreshold;
        
        // Override des globalen IntersectionObserver-Konstruktors
        const originalIntersectionObserver = window.IntersectionObserver;
        
        window.IntersectionObserver = function(callback, options = {}) {
            // Überschreibe threshold für bessere Mobile-Performance
            if (options && !options.threshold) {
                options.threshold = lowerIntersectionThreshold;
            }
            
            // Erstelle optimierten Observer
            return new originalIntersectionObserver(
                // Throttle Callback für bessere Performance
                throttledCallback(callback, 100),
                options
            );
        };
        
        // Hilfsfunktion für Callback-Throttling
        function throttledCallback(callback, delay) {
            let previousTime = 0;
            
            return function(...args) {
                const now = Date.now();
                if (now - previousTime >= delay) {
                    previousTime = now;
                    callback(...args);
                }
            };
        }
        
        // 2. Optimiere RequestAnimationFrame für Mobile-Geräte
        const targetFPS = this.config.performance.animationFPS;
        const frameInterval = 1000 / targetFPS;
        
        // FPS-Limiter einrichten
        let lastFrameTime = 0;
        const originalRAF = window.requestAnimationFrame;
        
        window.requestAnimationFrame = function(callback) {
            return originalRAF(function(timestamp) {
                const elapsed = timestamp - lastFrameTime;
                
                if (elapsed > frameInterval) {
                    lastFrameTime = timestamp;
                    callback(timestamp);
                } else {
                    // Verzögere das Frame für FPS-Begrenzung
                    setTimeout(function() {
                        originalRAF(callback);
                    }, frameInterval - elapsed);
                }
            });
        };
        
        this._debugLog(`Rendering-Pipeline für ${targetFPS} FPS optimiert`);
    }
    
    /**
     * Beobachtet DOM-Änderungen und wendet Anpassungen automatisch an
     * @private
     */
    _observeDOMChanges() {
        if (!window.MutationObserver || this.state.mutationObserver) return;
        
        // Konfiguriere Observer für DOM-Änderungen
        this.state.mutationObserver = new MutationObserver(mutations => {
            let shouldReapply = false;
            
            // Prüfe auf relevante Änderungen
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Prüfe auf neu hinzugefügte Produktcontainer
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element-Knoten
                            if (node.matches?.(this.config.selectors.productContainer) || 
                                node.querySelector?.(this.config.selectors.productContainer)) {
                                shouldReapply = true;
                                break;
                            }
                        }
                    }
                }
                
                if (shouldReapply) break;
            }
            
            // Wende Anpassungen bei Bedarf erneut an
            if (shouldReapply && (this.state.isMobile || this.state.isTablet)) {
                this._debugLog('DOM-Änderungen erkannt, wende Anpassungen erneut an');
                
                // Normalisiere neue Produktkarten
                if (this.config.optimizations.fixProductCardFlexLayout) {
                    this._normalizeProductCardLayout();
                }
            }
        });
        
        // Beobachte das gesamte Dokument auf Änderungen
        this.state.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        this._debugLog('DOM-Beobachtung aktiviert');
    }
    
    /**
     * Optimierungsstrategie-Empfehlungen für zukünftige Implementierungen
     * @private
     */
    _logMobileOptimizationRecommendations() {
        // Nur im Debug-Modus anzeigen
        if (!this.config.debug) return;
        
        console.info('=== Mobile Optimization Recommendations ===');
        console.info('1. Implementiere einen Mobile-First-Ansatz mit progressiven Verbesserungen für Desktop');
        console.info('2. Verwende CSS-Grid und Flexbox mit intrinsischen Größen statt absoluter Maßeinheiten');
        console.info('3. Trenne Canvas-basierte Animationen in qualitätsoptimierte Versionen für verschiedene Geräte');
        console.info('4. Implementiere lazy-loading für Nicht-Viewport-Sektionen');
        console.info('5. Optimiere 3D-Transformationen mit Akkumulationspuffern für Mobilgeräte');
        console.info('6. Verwende passive Event-Listener konsequent für Touch-Events');
        console.info('7. Bündle async/defer für nicht-kritische JavaScript-Ressourcen');
    }
    
    /**
     * Tiefes Objekt-Zusammenführen mit Übernahme von Unterobjekten
     * @param {Object} target - Zielobjekt
     * @param {Object} source - Quellobjekt für Merge
     * @returns {Object} - Zusammengeführtes Objekt
     * @private
     */
    _mergeDeep(target, source) {
        const output = Object.assign({}, target);
        
        if (this._isObject(target) && this._isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this._isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this._mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        
        return output;
    }
    
    /**
     * Überprüft, ob ein Wert ein Objekt ist
     * @param {*} item - Zu prüfender Wert
     * @returns {boolean} - true, wenn Wert ein Objekt ist
     * @private
     */
    _isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    
    /**
     * Implementiert eine Throttle-Funktion für Ereignishandler
     * @param {Function} func - Zu drosselnde Funktion
     * @param {number} wait - Wartezeit in Millisekunden
     * @returns {Function} - Gedrosselte Funktion
     * @private
     */
    _throttle(func, wait = 100) {
        let timeout = null;
        let previous = 0;
        
        return function(...args) {
            const now = Date.now();
            const remaining = wait - (now - previous);
            
            const context = this;
            
            if (remaining <= 0) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                
                previous = now;
                func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(() => {
                    previous = Date.now();
                    timeout = null;
                    func.apply(context, args);
                }, remaining);
            }
        };
    }
    
    /**
     * Debug-Logging mit zusätzlichen Informationen
     * @param {string} message - Nachrichtentext
     * @param {*} [data] - Optionale Daten zum Loggen
     * @private
     */
    _debugLog(message, data) {
        if (!this.config.debug) return;
        
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        const prefix = `[MAL ${timestamp}]`;
        
        if (data) {
            console.debug(prefix, message, data);
        } else {
            console.debug(prefix, message);
        }
    }
}

// Auto-Initialisierung nach DOM-Ladung
document.addEventListener('DOMContentLoaded', () => {
    // Erstelle Mobile Adaptation Layer mit Debug-Modus
    window.mobileAdaptationLayer = new MobileAdaptationLayer({
        debug: false, // In Produktion auf false setzen
        // Erlaubt individuelle Anpassung von Optimierungen
        optimizations: {
            disableParticlesOnMobile: true,
            reduceAnimationComplexity: true,
            optimizeGPUAcceleration: true,
            applyLayoutNormalization: true,
            fixProductCardFlexLayout: true,
            optimizeCanvasRendering: true,
            fixNavigationRendering: true,
            useRenderingThrottling: true
        }
    });
    
    // Initialisiere Mobile Adaptation Layer
    window.mobileAdaptationLayer.initialize();
});

// Exportiere für modulare Umgebungen
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileAdaptationLayer };
}
