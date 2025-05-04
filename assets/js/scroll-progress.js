// scroll-progress.js - Ferrum Insignia Quantum Scroll Progress System - OPTIMIERT

/**
 * ScrollProgressController
 * Reduzierte Version mit vollständiger Deaktivierung aller vertikalen Scrollindikatoren
 * Nur Header-Progressbar wird beibehalten
 * @class
 */
class ScrollProgressController {
    /**
     * Initialize the controller with optimized configuration parameters
     */
    constructor() {
        // Core DOM references
        this.headerProgressBar = null;       // Header container reference
        this.headerProgressIndicator = null; // Header progress indicator
        
        // State tracking
        this.sections = [];                  // Section elements
        this.isInitialized = false;          // Initialization state flag
        this.scrollThrottleDelay = 16;       // ~60fps optimal frame time
        this.lastScrollTime = 0;             // Last scroll timestamp
        this.rafId = null;                   // requestAnimationFrame ID
        this.resizeObserver = null;          // ResizeObserver reference
        
        // Cached dimensions
        this.viewportHeight = window.innerHeight;
        this.documentHeight = this.getDocumentHeight();
        this.visibilityState = true;         // Document visibility
        
        // Kill-Switch für Slidebars
        this.killSlidebarIntervalId = null;
        
        // Singleton pattern implementation
        if (window.scrollProgressControllerInstance) {
            console.info('[ScrollProgressController] Instance already exists, returning existing instance');
            return window.scrollProgressControllerInstance;
        }
        
        window.scrollProgressControllerInstance = this;
        
        // Initialize the system (header progress only)
        this.init();
    }
    
    /**
     * Initialize the scroll progress controller
     * @private
     */
    init() {
        // Get reference to header progress bar only
        this.headerProgressBar = document.getElementById('headerProgressBar');
        
        if (this.headerProgressBar) {
            this.headerProgressIndicator = this.headerProgressBar.querySelector('.progress-indicator');
        }
        
        // Get all sections
        this.sections = Array.from(document.querySelectorAll('section[data-section]'));
        
        // KRITISCHE BEREINIGUNG: Entferne initial und wiederholt alle ScrollIndicator-Elemente
        this.removeAllScrollIndicators();
        
        // KRITISCHER KILL-SWITCH: Kontinuierliche Überwachung und Entfernung von Slidebars
        this.startSlidebarKillSwitch();
        
        // Wait for DOM to be fully loaded
        this.waitForDOMReady(() => {
            // Bind events für Header-Progressbar
            this.bindEvents();
            
            // Initial update
            this.updateProgress();
            
            this.isInitialized = true;
            
            // Nach vollständiger Initialisierung erneute Entfernung
            setTimeout(() => {
                this.removeAllScrollIndicators();
            }, 500);
        });
    }
    
    /**
     * KILL-SWITCH: Kontinuierliche Überwachung und Entfernung von Slidebars
     * @private
     */
    startSlidebarKillSwitch() {
        // Sofortige erste Entfernung
        this.removeAllScrollIndicators();
        
        // Stoppe vorherigen Interval falls vorhanden
        if (this.killSlidebarIntervalId) {
            clearInterval(this.killSlidebarIntervalId);
        }
        
        // Starte aggressiven Interval zur wiederholten Entfernung
        this.killSlidebarIntervalId = setInterval(() => {
            this.removeAllScrollIndicators();
        }, 1000); // Alle Sekunde prüfen und entfernen
        
        // Observer für DOM-Mutationen, um neu hinzugefügte Slidebars sofort zu entfernen
        if (window.MutationObserver) {
            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        // Wenn neue DOM-Elemente hinzugefügt wurden, Slidebars entfernen
                        this.removeAllScrollIndicators();
                    }
                }
            });
            
            // Beobachte den gesamten Body nach Änderungen
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Speichere Referenz für Cleanup
            this.mutationObserver = observer;
        }
    }
    
    /**
     * Wartet auf DOM-Ready mit Fallback
     * @param {Function} callback - Auszuführende Callback-Funktion
     * @private
     */
    waitForDOMReady(callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(callback, 0);
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }
    
    /**
     * Entfernt systematisch alle Scrollindikatoren aus dem DOM
     * @private
     */
    removeAllScrollIndicators() {
        // Umfassende Liste von Selektoren für Scrollindikatoren
        const selectors = [
            // Standard Scroll-Indikatoren
            '.scroll-indicator-quantum',
            '.scroll-line',
            '.scroll-beam',
            '.scroll-indicator',
            '.scroll-quantum-indicator',
            '.quantum-scroll-progress',
            '.scroll-progress-track',
            '.scroll-progress-bar',
            '.scroll-section-marker',
            '.scroll-section-label',
            '.scroll-progress-top',
            '.scroll-progress-bottom',
            '.scroll-indicator-container',
            '.scroll-progress-marker',
            '.scroll-progress-track-vertical',
            '.scroll-progress-indicator',
            '.scroll-indicator-wrapper',
            '.scroll-visual-indicator',
            '.scroll-markers',
            
            // Zusätzliche Slidebar-spezifische Selektoren
            '.scroll-thumb',
            '.slide-indicator',
            '.slide-bar',
            '.slide-marker',
            '.sidebar-progress',
            '.vertical-progress',
            '.vertical-indicator',
            '.vertical-markers',
            '.vertical-navigation',
            '.side-navigation',
            '.nav-progress-indicator',
            
            // Spezifische Hero-Bereich Slidebars
            '.hero-quantum .scroll-indicator-quantum',
            '.hero-quantum .scroll-line',
            
            // Home.js ScrollAnimationController Selektoren
            '.scroll-indicator-container',
            '.section-indicator'
        ];
        
        // Muster-basierte Selektoren für dynamisch generierte Elemente
        const patternSelectors = [
            '[class*="scroll-indicator"]',
            '[class*="scroll-progress"]',
            '[class*="slide-bar"]',
            '[class*="vertical-progress"]',
            '[class*="side-indicator"]',
            '[id*="scroll-indicator"]',
            '[id*="scroll-progress"]',
            '[id*="vertical-indicator"]',
            '[id*="slide-indicator"]'
        ];
        
        // Attribute selectors
        const attributeSelectors = [
            '[data-scroll-indicator]',
            '[data-scroll-progress]',
            '[data-scroll="indicator"]',
            '[data-slide-indicator]',
            '[data-vertical-indicator]',
            '[data-section-indicator]'
        ];

        // Entferne alle Elemente basierend auf Klassen-Selektoren
        const removeElementsBySelectors = (selectorList) => {
            selectorList.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (el && el.parentNode) {
                            el.parentNode.removeChild(el);
                        }
                    });
                } catch (error) {
                    // Ignoriere Fehler, falls Selektor nicht valide
                }
            });
        };
        
        // Entferne alle Elemente nacheinander
        removeElementsBySelectors(selectors);
        removeElementsBySelectors(patternSelectors);
        removeElementsBySelectors(attributeSelectors);

        // Spezifisches Targeting von Slidebars in der Nähe des Hero-Bereichs
        const heroSection = document.querySelector('.hero-quantum');
        if (heroSection) {
            // Durchsuche alle direkten Kinder und Kinder von Kindern
            this.removeScrollElementsRecursively(heroSection, 3);
        }
        
        // Globale DOM-Traversierung, um versteckte Slidebars zu finden
        this.detectAndRemoveHiddenSlidebars();
    }
    
    /**
     * Rekursives Durchsuchen und Entfernen von Scroll-Elementen bis zu einer bestimmten Tiefe
     * @param {Element} element - Startelement
     * @param {number} maxDepth - Maximale Rekursionstiefe
     * @param {number} currentDepth - Aktuelle Rekursionstiefe
     * @private
     */
    removeScrollElementsRecursively(element, maxDepth, currentDepth = 0) {
        if (!element || currentDepth > maxDepth) return;
        
        // Prüfe Klassen, IDs und Attribute des aktuellen Elements
        const classNameLower = (element.className && typeof element.className === 'string') ? 
            element.className.toLowerCase() : '';
        const idLower = element.id ? element.id.toLowerCase() : '';
        
        // Entferne Element, wenn es ein Scrollindikator sein könnte
        if (
            classNameLower.includes('scroll') || 
            classNameLower.includes('indicator') || 
            classNameLower.includes('slide') ||
            classNameLower.includes('progress') ||
            idLower.includes('scroll') ||
            idLower.includes('indicator') ||
            idLower.includes('slide') ||
            idLower.includes('progress') ||
            element.hasAttribute('data-scroll') ||
            element.hasAttribute('data-indicator')
        ) {
            // Verstecke das Element, wenn es ein Scroll-Indikator sein könnte
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            
            // Versuche, das Element zu entfernen, wenn es kein kritisches UI-Element ist
            if (
                !element.classList.contains('quantum-header') &&
                !element.classList.contains('header-progress-bar') &&
                !element.id === 'headerProgressBar' &&
                element.parentNode
            ) {
                try {
                    element.parentNode.removeChild(element);
                    return; // Element entfernt, keine weitere Traversierung nötig
                } catch (error) {
                    // Ignoriere Fehler beim Entfernen
                }
            }
        }
        
        // Rekursiv Kinder durchsuchen
        Array.from(element.children).forEach(child => {
            this.removeScrollElementsRecursively(child, maxDepth, currentDepth + 1);
        });
    }
    
    /**
     * Erweiterte Heuristik zur Erkennung versteckter Slidebars im gesamten DOM
     * @private
     */
    detectAndRemoveHiddenSlidebars() {
        // Suche nach vertikalen Elementen an den Seitenrändern
        const allElements = document.querySelectorAll('*');
        
        for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            
            try {
                // Überspringe Text-Nodes und Kommentare
                if (!(el instanceof HTMLElement)) continue;
                
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                
                // Prüfe auf Eigenschaften, die auf eine Slidebar hindeuten könnten
                const potentialSlidebar = (
                    // Vertikale schmale Elemente an den Seitenrändern
                    ((rect.width < 30 && rect.height > 100) || 
                     (style.width && parseInt(style.width) < 30 && rect.height > 100)) &&
                    (rect.left < 30 || rect.right > window.innerWidth - 30) &&
                    
                    // Position fixed oder absolute
                    (style.position === 'fixed' || style.position === 'absolute') &&
                    
                    // Nicht Teil des Headers
                    !el.closest('.quantum-header') &&
                    !el.closest('#headerProgressBar')
                );
                
                if (potentialSlidebar) {
                    // Entferne potenziellen Slidebar
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.style.pointerEvents = 'none';
                    
                    // Versuche, das Element zu entfernen
                    if (el.parentNode) {
                        try {
                            el.parentNode.removeChild(el);
                        } catch (error) {
                            // Ignoriere Fehler beim Entfernen
                        }
                    }
                }
            } catch (error) {
                // Ignoriere Fehler bei der Analyse
                continue;
            }
        }
    }
    
    /**
     * Get the actual document height considering all content
     * @returns {number} Document height in pixels
     */
    getDocumentHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
    }
    
    /**
     * Bind scroll and resize events with performance optimization
     * @private
     */
    bindEvents() {
        // Update progress on scroll with throttling
        this.bindScrollEvent();
        
        // Use ResizeObserver for efficient size updates
        this.bindResizeEvent();
        
        // Handle visibility changes to save resources when page is not visible
        this.bindVisibilityEvent();
        
        // Handle template loaded event for dynamic content
        this.bindTemplateEvent();
    }
    
    /**
     * Bindet das Scroll-Event mit optimaler Performance
     * @private
     */
    bindScrollEvent() {
        window.addEventListener('scroll', () => {
            const now = Date.now();
            
            // Throttle scroll events for optimal performance
            if (now - this.lastScrollTime >= this.scrollThrottleDelay) {
                this.lastScrollTime = now;
                
                // Use requestAnimationFrame for smoother updates
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                }
                
                this.rafId = requestAnimationFrame(() => {
                    if (this.isInitialized && this.visibilityState) {
                        this.updateProgress();
                        this.updateActiveSection();
                    }
                });
            }
        }, { passive: true });
    }
    
    /**
     * Bindet das Resize-Event
     * @private
     */
    bindResizeEvent() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
            this.resizeObserver.observe(document.body);
        } else {
            // Fallback for browsers without ResizeObserver
            let resizeTimeout;
            
            window.addEventListener('resize', () => {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
                
                resizeTimeout = setTimeout(() => {
                    this.handleResize();
                }, 100); // Debounce for performance
            }, { passive: true });
        }
    }
    
    /**
     * Bindet das Visibility-Event
     * @private
     */
    bindVisibilityEvent() {
        document.addEventListener('visibilitychange', () => {
            this.visibilityState = document.visibilityState === 'visible';
            
            // Bei Änderung der Visibility Slidebars erneut entfernen
            if (this.visibilityState) {
                this.removeAllScrollIndicators();
            }
        });
    }
    
    /**
     * Bindet das Template-Event
     * @private
     */
    bindTemplateEvent() {
        document.addEventListener('templateLoaded', () => {
            if (this.isInitialized) {
                // Recalculate document height when templates load
                setTimeout(() => {
                    this.documentHeight = this.getDocumentHeight();
                    this.updateProgress();
                    
                    // KRITISCHE BEREINIGUNG: Nach Template-Loading alle Slidebars entfernen
                    this.removeAllScrollIndicators();
                }, 100);
            }
        });
    }
    
    /**
     * Handle resize with debouncing
     * @private
     */
    handleResize() {
        if (!this.isInitialized) return;
        
        // Update cached dimensions
        this.viewportHeight = window.innerHeight;
        this.documentHeight = this.getDocumentHeight();
        
        // Update progress immediately after resize
        this.updateProgress();
        
        // Nach Resize Slidebars entfernen
        this.removeAllScrollIndicators();
    }
    
    /**
     * Update progress bar position with high performance
     * @private
     */
    updateProgress() {
        // Skip if header indicator not found
        if (!this.headerProgressIndicator) return;
        
        // Calculate scroll progress (0-100%)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = this.documentHeight - this.viewportHeight;
        const scrollProgress = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
        
        // Update header progress bar
        this.headerProgressIndicator.style.width = `${scrollProgress}%`;
    }
    
    /**
     * Update active section marker with binary search for efficiency
     * @private
     */
    updateActiveSection() {
        // Find the current active section with efficient algorithm
        let activeSection = null;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.quantum-header')?.offsetHeight || 80;
        const threshold = this.viewportHeight * 0.3; // 30% from top
        
        // Iterate sections in reverse order (bottom to top) for efficient detection
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            const rect = section.getBoundingClientRect();
            
            if (rect.top <= threshold + headerHeight) {
                activeSection = section.getAttribute('data-section');
                break;
            }
        }
        
        // Special case for hero section
        if (scrollTop < 50) {
            activeSection = 'hero';
        }
        
        // Update navigation active state for Navigationslinks
        this.updateNavigationActiveState(activeSection);
    }
    
    /**
     * Update navigation active state
     * @param {string} activeSectionId - Active section ID
     * @private
     */
    updateNavigationActiveState(activeSectionId) {
        // Update desktop navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const linkSectionId = href.replace('#', '');
            
            if (linkSectionId === activeSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Special handling for home-nav-link
        const homeNavLink = document.getElementById('home-nav-link');
        if (homeNavLink && activeSectionId === 'hero') {
            homeNavLink.classList.add('active');
        }
        
        // Update mobile navigation links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const linkSectionId = href.replace('#', '');
            
            if (linkSectionId === activeSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Public method to force progress update
     * @public
     */
    forceUpdate() {
        if (this.isInitialized) {
            this.documentHeight = this.getDocumentHeight();
            this.updateProgress();
            this.removeAllScrollIndicators(); // Nach Update Slidebars entfernen
        }
    }
    
    /**
     * Reinitialize the scroll progress system
     * Useful after dynamic content changes
     * @public
     */
    reinitialize() {
        if (this.isInitialized) {
            // Update cached dimensions
            this.viewportHeight = window.innerHeight;
            this.documentHeight = this.getDocumentHeight();
            
            // Reset section cache
            this.sections = Array.from(document.querySelectorAll('section[data-section]'));
            
            // Update progress
            this.updateProgress();
            
            // KRITISCHE BEREINIGUNG: Alle Slidebars entfernen
            this.removeAllScrollIndicators();
            
            // Kill-Switch neu starten
            this.startSlidebarKillSwitch();
        }
    }
    
    /**
     * Cleanup resources when controller is no longer needed
     * @public
     */
    destroy() {
        // Stop kill-switch interval
        if (this.killSlidebarIntervalId) {
            clearInterval(this.killSlidebarIntervalId);
        }
        
        // Disconnect mutation observer
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        
        // Disconnect resize observer
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        // Cancel any pending animation frames
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Eine letzte Bereinigung vor der Zerstörung
        this.removeAllScrollIndicators();
    }
}

// Initialize ScrollProgressController with deferred execution and debugging
document.addEventListener('DOMContentLoaded', () => {
    // Sofortige erste Bereinigung vor Controller-Initialisierung
    const emergencyCleanup = () => {
        const slidebars = document.querySelectorAll('.scroll-indicator-quantum, .scroll-line, .scroll-indicator, .scroll-quantum-indicator');
        slidebars.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    };
    
    // Führe Notfall-Bereinigung aus
    emergencyCleanup();
    
    // Initialisiere Controller
    window.scrollProgressController = new ScrollProgressController();
    
    // Zusätzlicher MutationObserver auf Dokumentebene für maximale Abdeckung
    if (window.MutationObserver) {
        const globalObserver = new MutationObserver((mutations) => {
            // Bei DOM-Änderungen Notfall-Bereinigung ausführen
            emergencyCleanup();
            
            // Falls Controller existiert, auch dort Bereinigung auslösen
            if (window.scrollProgressController) {
                window.scrollProgressController.removeAllScrollIndicators();
            }
        });
        
        // Beobachte gesamtes Dokument
        globalObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Für den Fall, dass Slidebars nach dem vollständigen Laden hinzugefügt werden
    window.addEventListener('load', () => {
        // Erste Bereinigung
        emergencyCleanup();
        
        if (window.scrollProgressController) {
            // Controller-Bereinigung
            window.scrollProgressController.removeAllScrollIndicators();
            
            // Erzwinge Aktualisierung
            window.scrollProgressController.forceUpdate();
        }
        
        // Verzögerte zweite Bereinigung für dynamisch nachgeladene Inhalte
        setTimeout(() => {
            emergencyCleanup();
            if (window.scrollProgressController) {
                window.scrollProgressController.removeAllScrollIndicators();
            }
        }, 1000);
    });
});