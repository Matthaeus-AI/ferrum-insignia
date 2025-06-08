/**
 * Ferrum Insignia Core Application Framework
 * Mathematisch optimierte JavaScript-Architektur mit präzisen Ausführungsmatrizen
 * 
 * @version 2.0.0
 * @module FerrumInsignia/Core
 */

(function() {
    'use strict';

    /**
     * Domänenkonstanten mit berechneten Optimierungsparametern
     * @const
     */
    const CONSTANTS = {
        PERFORMANCE: {
            SCROLL_THROTTLE_INTERVAL: 16.67,    // 60fps äquivalente Millisekunden
            RESIZE_DEBOUNCE_DELAY: 100,         // Optimales Debounce-Delay für Resize-Events
            MUTATION_THROTTLE_INTERVAL: 50,     // DOM-Mutations-Detektionsintervall
            ANIMATION_FRAME_BUDGET: 8.33,       // 120fps-orientierte Frame-Budget-Zuweisung
            INTERSECTION_THRESHOLDS: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        },
        DOM: {
            HEADER_SELECTOR: '.quantum-header',
            NAVIGATION_SELECTOR: '.quantum-navigation',
            THEME_TOGGLE_SELECTOR: '[data-theme-toggle="true"]',
            LANGUAGE_TOGGLE_SELECTOR: '[data-language]',
            SCROLL_LINK_SELECTOR: 'a[href^="#"]',
            SECTION_SELECTOR: 'section[data-section]',
            ACTIVE_SECTION_CLASS: 'active-section',
            ACTIVE_LINK_CLASS: 'active',
            VISIBLE_CLASS: 'visible',
            SCROLL_OFFSET_DEFAULT: 80,          // Default Header-Offset-Kompensation
            SCROLL_ANIMATION_DURATION: 800      // Optimale Scroll-Animations-Dauer
        },
        STORAGE: {
            THEME_KEY: 'ferrum-theme',
            LANGUAGE_KEY: 'ferrum-language',
            SCROLL_POSITION_KEY: 'ferrum-scroll-position'
        },
        THEMES: {
            DARK: 'dark',
            LIGHT: 'light'
        },
        EVENTS: {
            APP_INITIALIZED: 'app:initialized',
            THEME_CHANGED: 'theme:changed',
            LANGUAGE_CHANGED: 'language:changed',
            SCROLL_COMPLETED: 'scroll:completed',
            SECTION_VISIBLE: 'section:visible',
            CONTENT_LOADED: 'content:loaded',
            WINDOW_RESIZED: 'window:resized'
        }
    };

    /**
     * PerformanceOptimizer - Mathematisch präzises Performance-Management
     * Optimiert CPU/GPU-Ressourcenverwendung und Execution-Timing
     */
    class PerformanceOptimizer {
        constructor() {
            this.throttledFunctions = new Map();
            this.debouncedFunctions = new Map();
            this.rafCallbacks = new Map();
            this.raiCallbacks = new Map(); // requestAnimationIdleCallback Äquivalent
            this.performanceMetrics = {
                lastFrameTime: 0,
                frameDeltas: [],
                scrollEvents: 0,
                resizeEvents: 0,
                domMutations: 0
            };
        }

        /**
         * Statistische Throttling-Funktion mit adaptiver Anpassung
         * @param {Function} fn - Zu throttelnde Funktion
         * @param {number} limit - Minimales Intervall in ms
         * @param {Object} [options] - Konfigurationsoptionen
         * @returns {Function} Throttled Funktion mit garantierten Ausführungsgrenzen
         */
        throttle(fn, limit, options = {}) {
            const functionId = fn.toString();
            
            // Wiederverwendung existierender throttled Instanzen für Ressourcenoptimierung
            if (this.throttledFunctions.has(functionId)) {
                return this.throttledFunctions.get(functionId);
            }
            
            let lastRun = 0;
            let throttling = false;
            
            // Garantiert Präzisionsausführung mit High-Resolution Timer
            const throttledFn = function(...args) {
                const now = performance.now();
                const context = this;
                
                // Adaptive Intervallberechnung basierend auf Frame-Budget
                const currentLimit = options.adaptive ? 
                    Math.max(limit, CONSTANTS.PERFORMANCE.ANIMATION_FRAME_BUDGET) : limit;
                
                if (now - lastRun >= currentLimit) {
                    lastRun = now;
                    throttling = false;
                    return fn.apply(context, args);
                } else if (!throttling && options.leading !== false) {
                    throttling = true;
                    lastRun = now;
                    return fn.apply(context, args);
                } else if (options.trailing !== false) {
                    clearTimeout(throttling);
                    throttling = setTimeout(() => {
                        lastRun = performance.now();
                        throttling = false;
                        fn.apply(context, args);
                    }, currentLimit - (now - lastRun));
                }
            };
            
            this.throttledFunctions.set(functionId, throttledFn);
            return throttledFn;
        }

        /**
         * Hochpräzises Debouncing mit garantierter Ausführung
         * @param {Function} fn - Zu debouncende Funktion
         * @param {number} wait - Wartezeit in ms
         * @param {Object} [options] - Konfigurationsoptionen
         * @returns {Function} Debounced Funktion
         */
        debounce(fn, wait, options = {}) {
            const functionId = fn.toString();
            
            // Wiederverwendung existierender debounced Instanzen für Ressourcenoptimierung
            if (this.debouncedFunctions.has(functionId)) {
                return this.debouncedFunctions.get(functionId);
            }
            
            let timeout;
            
            const debouncedFn = function(...args) {
                const context = this;
                const later = function() {
                    timeout = null;
                    if (!options.leading) {
                        fn.apply(context, args);
                    }
                };
                
                const callNow = options.leading && !timeout;
                
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                
                if (callNow) {
                    fn.apply(context, args);
                }
            };
            
            this.debouncedFunctions.set(functionId, debouncedFn);
            return debouncedFn;
        }

        /**
         * RAF-Synchronisierte Ausführung mit Frame-Budget-Kontrolle
         * @param {Function} callback - Auszuführender Callback
         * @param {Object} [options] - Konfigurationsoptionen
         * @returns {number} RAF-ID zur Kontrolle
         */
        scheduleRender(callback, options = {}) {
            const { priority = 'normal', id = Math.random().toString(36) } = options;
            
            // Priorisierte Ausführungsplanung basierend auf Callback-Gewichtung
            const execute = () => {
                const start = performance.now();
                const result = callback(start);
                const end = performance.now();
                
                // Performance-Metrik-Erfassung für diagnostische Optimierung
                this.performanceMetrics.frameDeltas.push(end - start);
                if (this.performanceMetrics.frameDeltas.length > 60) {
                    this.performanceMetrics.frameDeltas.shift();
                }
                
                return result;
            };
            
            // Strategische Ausführungsplanung basierend auf Prioritätsniveau
            if (priority === 'high') {
                // Direkte RAF-Zykluseinplanung für kritische Operationen
                const rafId = requestAnimationFrame(execute);
                this.rafCallbacks.set(id, rafId);
                return rafId;
            } else if (priority === 'low' && window.requestIdleCallback) {
                // Optimierte Ausführung während Idle-Perioden für nicht-kritische Operationen
                const idleId = requestIdleCallback(execute);
                this.raiCallbacks.set(id, idleId);
                return idleId;
            } else {
                // Standard-RAF-Ausführung mit potentieller Debouncing für normale Operationen
                const rafId = requestAnimationFrame(execute);
                this.rafCallbacks.set(id, rafId);
                return rafId;
            }
        }

        /**
         * Berechnet das optimale Scroll-Throttle-Intervall basierend auf Geräteleistung
         * @returns {number} Optimales Throttle-Intervall in ms
         */
        calculateOptimalScrollThrottle() {
            // Adaptive Berechnung basierend auf bisheriger Frame-Performance
            if (this.performanceMetrics.frameDeltas.length > 10) {
                const averageFrameTime = this.performanceMetrics.frameDeltas.reduce((a, b) => a + b, 0) / 
                                        this.performanceMetrics.frameDeltas.length;
                
                // Sicherheitskoeffizient: 1.5x durchschnittliche Frame-Zeit
                return Math.max(CONSTANTS.PERFORMANCE.SCROLL_THROTTLE_INTERVAL, averageFrameTime * 1.5);
            }
            
            return CONSTANTS.PERFORMANCE.SCROLL_THROTTLE_INTERVAL;
        }

        /**
         * Bereinigt nicht mehr benötigte RAF-Callbacks
         * @param {string|number} id - Callback-ID oder RAF-ID
         * @returns {boolean} Erfolgsstatus
         */
        cancelScheduledRender(id) {
            if (this.rafCallbacks.has(id)) {
                cancelAnimationFrame(this.rafCallbacks.get(id));
                this.rafCallbacks.delete(id);
                return true;
            } else if (this.raiCallbacks.has(id) && window.cancelIdleCallback) {
                cancelIdleCallback(this.raiCallbacks.get(id));
                this.raiCallbacks.delete(id);
                return true;
            }
            return false;
        }
    }

    /**
     * EventBus - Zentralisiertes Event-Management mit Delegationspattern
     * Implementiert ein optimiertes Publish-Subscribe-System für modulübergreifende Kommunikation
     */
    class EventBus {
        constructor() {
            this.events = new Map();
            this.domDelegatedEvents = new Map();
            this.globalEventHandlers = new Map();
        }

        /**
         * Registriert einen Event-Listener
         * @param {string} event - Event-Bezeichner
         * @param {Function} callback - Event-Handler
         * @param {Object} [options] - Konfigurationsoptionen
         * @returns {Object} Subscriber-Referenz
         */
        on(event, callback, options = {}) {
            if (!this.events.has(event)) {
                this.events.set(event, new Map());
            }
            
            const id = options.id || Symbol();
            const callbackData = {
                callback,
                options,
                active: true
            };
            
            this.events.get(event).set(id, callbackData);
            
            return {
                id,
                event,
                unsubscribe: () => this.off(event, id)
            };
        }

        /**
         * Entfernt einen Event-Listener
         * @param {string} event - Event-Bezeichner
         * @param {symbol|string} id - Listener-ID
         * @returns {boolean} Erfolgsstatus
         */
        off(event, id) {
            if (!this.events.has(event)) return false;
            return this.events.get(event).delete(id);
        }

        /**
         * Sendet ein Event an alle registrierten Listener
         * @param {string} event - Event-Bezeichner
         * @param {*} data - Event-Daten
         * @returns {boolean} Erfolgsstatus
         */
        emit(event, data) {
            if (!this.events.has(event)) return false;
            
            const handlers = this.events.get(event);
            for (const [id, handlerData] of handlers) {
                if (handlerData.active) {
                    try {
                        handlerData.callback(data);
                    } catch (error) {
                        console.error(`Error in event handler for ${event}:`, error);
                        // Automatische Deaktivierung fehlerhafter Handler in Produktionsumgebung
                        if (handlerData.options.autoDisable !== false && process.env.NODE_ENV === 'production') {
                            handlerData.active = false;
                        }
                    }
                }
            }
            
            return true;
        }

        /**
         * Implementiert Event-Delegation für DOM-Events
         * @param {string} selector - CSS-Selektor
         * @param {string} eventType - DOM-Event-Typ
         * @param {Function} handler - Event-Handler
         * @param {Object} [options] - Event-Optionen
         * @returns {Object} Referenz zum Entfernen des Handlers
         */
        delegate(selector, eventType, handler, options = {}) {
            const key = `${eventType}:${selector}`;
            
            if (!this.domDelegatedEvents.has(key)) {
                this.domDelegatedEvents.set(key, new Set());
                
                // Erstelle den Delegations-Handler
                const delegationHandler = (event) => {
                    const targets = document.querySelectorAll(selector);
                    const target = event.target.closest(selector);
                    
                    if (target && [...targets].includes(target)) {
                        // Array von Handler-Ausführungskontexten
                        const handlerContexts = this.domDelegatedEvents.get(key);
                        
                        for (const ctx of handlerContexts) {
                            try {
                                // Rufe den Handler mit korrektem Event-Target auf
                                ctx.handler.call(ctx.context || target, event, target);
                            } catch (error) {
                                console.error(`Error in delegated event handler (${selector}, ${eventType}):`, error);
                            }
                        }
                    }
                };
                
                // Speichere die Referenz auf den globalen Handler
                this.globalEventHandlers.set(key, {
                    handler: delegationHandler,
                    options: { ...options, capture: true }  // Capture-Phase für korrekte Bubbling-Kontrolle
                });
                
                // Registriere den globalen Delegations-Handler
                document.addEventListener(
                    eventType,
                    delegationHandler,
                    { ...options, capture: true }
                );
            }
            
            // Füge den Handler-Kontext zur Delegations-Map hinzu
            const handlerContext = {
                handler,
                context: options.context,
                options
            };
            
            this.domDelegatedEvents.get(key).add(handlerContext);
            
            // Rückgabe zum Entfernen des Handlers
            return {
                remove: () => {
                    const handlers = this.domDelegatedEvents.get(key);
                    if (handlers) {
                        handlers.delete(handlerContext);
                        
                        // Cleanup, wenn keine Handler mehr für dieses Selector/Event-Paar registriert sind
                        if (handlers.size === 0) {
                            const globalHandler = this.globalEventHandlers.get(key);
                            document.removeEventListener(
                                eventType,
                                globalHandler.handler,
                                globalHandler.options
                            );
                            
                            this.domDelegatedEvents.delete(key);
                            this.globalEventHandlers.delete(key);
                        }
                    }
                }
            };
        }
    }

    /**
     * DOMManager - Optimierte DOM-Manipulationseinheit
     * Batch-orientierte DOM-Operationen zur Minimierung von Layout-Thrashing
     */
    class DOMManager {
        constructor() {
            this.pendingReads = new Map();
            this.pendingWrites = new Map();
            this.mutationCache = new WeakMap();
            this.elementCache = new Map();
            this.processedQueries = new Map();
            
            // Optimierte selektive Rektalkulation
            this.rafScheduled = false;
        }

        /**
         * Hochperformante Elementselektierung mit Caching
         * @param {string} selector - CSS-Selektor
         * @param {Element} [context=document] - Suchkontext
         * @param {Object} [options] - Selektionsoptionen
         * @returns {Element|null} Gefundenes Element oder null
         */
        querySelector(selector, context = document, options = {}) {
            const cacheKey = `${context === document ? 'document' : context.id || context.className}:${selector}`;
            
            // Cache-Optimierung für wiederholte Selektionen
            if (this.processedQueries.has(cacheKey) && !options.bypassCache) {
                return this.processedQueries.get(cacheKey);
            }
            
            const element = context.querySelector(selector);
            
            // Cache-Invalidierung bei NULL-Resultaten vermeiden
            if (element && options.cache !== false) {
                this.processedQueries.set(cacheKey, element);
            }
            
            return element;
        }

        /**
         * Präzises Element-Selektieren mit adaptiver Caching-Strategie
         * @param {string} selector - CSS-Selektor
         * @param {Element} [context=document] - Suchkontext
         * @param {Object} [options] - Selektionsoptionen
         * @returns {Element[]|NodeList} Gefundene Elemente
         */
        querySelectorAll(selector, context = document, options = {}) {
            const cacheKey = `${context === document ? 'document' : context.id || context.className}:${selector}:all`;
            
            // Cache-Optimierung für wiederholte Selektionen
            if (this.processedQueries.has(cacheKey) && !options.bypassCache) {
                return this.processedQueries.get(cacheKey);
            }
            
            const elements = Array.from(context.querySelectorAll(selector));
            
            // Cache-Persistenz für spätere Lookups
            if (options.cache !== false) {
                this.processedQueries.set(cacheKey, elements);
            }
            
            return elements;
        }

        /**
         * Optimierte attributbasierte Elementselektierung
         * @param {string} attribute - Attributname
         * @param {string} value - Attributwert
         * @param {Element} [context=document] - Suchkontext
         * @returns {Element[]} Gefundene Elemente
         */
        findElementsByAttribute(attribute, value, context = document) {
            const selector = value ? `[${attribute}="${value}"]` : `[${attribute}]`;
            return this.querySelectorAll(selector, context);
        }

        /**
         * Batched DOM-Lese-Operation mit Layout-Thrashing-Prävention
         * @param {Function} readFn - Lesefunktion
         * @param {string} [key] - Eindeutiger Schlüssel
         * @returns {*} Ergebnis der Leseoperation
         */
        read(readFn, key = readFn.toString()) {
            if (!this.pendingReads.has(key)) {
                this.pendingReads.set(key, readFn);
                
                if (!this.rafScheduled) {
                    this.rafScheduled = true;
                    
                    requestAnimationFrame(() => {
                        this.flushReads();
                        this.flushWrites();
                        this.rafScheduled = false;
                    });
                }
            }
            
            return this.pendingReads.get(key);
        }

        /**
         * Batched DOM-Schreib-Operation mit Layout-Thrashing-Prävention
         * @param {Function} writeFn - Schreibfunktion
         * @param {string} [key] - Eindeutiger Schlüssel
         */
        write(writeFn, key = writeFn.toString()) {
            this.pendingWrites.set(key, writeFn);
            
            if (!this.rafScheduled) {
                this.rafScheduled = true;
                
                requestAnimationFrame(() => {
                    this.flushReads();
                    this.flushWrites();
                    this.rafScheduled = false;
                });
            }
        }

        /**
         * Führt alle ausstehenden Leseoperationen aus
         * @private
         */
        flushReads() {
            if (!this.pendingReads.size) return;
            
            // Alle Leseoperationen ausführen und cachen
            for (const [key, readFn] of this.pendingReads) {
                try {
                    // Führe alle Lesezugriffe vor den Schreibzugriffen aus
                    // um Layout-Thrashing zu vermeiden
                    readFn();
                } catch (error) {
                    console.error('Error in DOMManager.read:', error);
                }
            }
            
            this.pendingReads.clear();
        }

        /**
         * Führt alle ausstehenden Schreiboperationen aus
         * @private
         */
        flushWrites() {
            if (!this.pendingWrites.size) return;
            
            // Alle Schreiboperationen ausführen
            for (const [key, writeFn] of this.pendingWrites) {
                try {
                    writeFn();
                } catch (error) {
                    console.error('Error in DOMManager.write:', error);
                }
            }
            
            this.pendingWrites.clear();
        }

        /**
         * Performanzoptimierte Klassen-Manipulation
         * @param {Element} element - Zielelement
         * @param {string} className - Klassenname oder -namen
         * @param {boolean} force - Erzwungener Zustand
         */
        toggleClass(element, className, force) {
            if (!element) return;
            
            // Batch-Operation zur Minimierung von Reflow-Zyklen
            this.write(() => {
                if (className.includes(' ')) {
                    // Multi-Klassen-Toggling
                    const classNames = className.split(' ').filter(Boolean);
                    classNames.forEach(name => {
                        element.classList.toggle(name, force);
                    });
                } else {
                    // Einzelne Klasse
                    element.classList.toggle(className, force);
                }
            });
        }

        /**
         * Performanzoptimierte Attribut-Manipulation
         * @param {Element} element - Zielelement
         * @param {string} attribute - Attributname
         * @param {*} value - Attributwert
         */
        setAttribute(element, attribute, value) {
            if (!element) return;
            
            // Cache aktuellen Wert
            const oldValue = element.getAttribute(attribute);
            
            // Skip redundante Operationen
            if (oldValue === String(value)) return;
            
            // Batch-Operation zur Minimierung von Reflow-Zyklen
            this.write(() => {
                element.setAttribute(attribute, value);
            });
        }

        /**
         * Fügt eine Stil-Eigenschaft zu einem Element mit Batching hinzu
         * @param {Element} element - Zielelement
         * @param {string} property - CSS-Eigenschaft
         * @param {string} value - CSS-Wert
         * @param {boolean} [important=false] - !important Flag
         */
        setStyle(element, property, value, important = false) {
            if (!element) return;
            
            // Formatiere CSS-Property in camelCase für DOM-Manipulation
            const cssProp = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            
            // Optimierter Inline-Stil-Transfer
            this.write(() => {
                element.style.setProperty(
                    property,
                    value,
                    important ? 'important' : ''
                );
            });
        }

        /**
         * Fügt mehrere Stile zu einem Element mit Batching hinzu
         * @param {Element} element - Zielelement
         * @param {Object} styles - CSS-Eigenschaftsobjekt
         */
        setStyles(element, styles) {
            if (!element || !styles) return;
            
            // Batch multiple Stil-Updates
            this.write(() => {
                for (const [property, value] of Object.entries(styles)) {
                    // Prüfe und formatiere wichtige Flags
                    if (typeof value === 'string' && value.endsWith('!important')) {
                        const actualValue = value.replace('!important', '').trim();
                        element.style.setProperty(property, actualValue, 'important');
                    } else {
                        element.style.setProperty(property, value);
                    }
                }
            });
        }

        /**
         * Berechnet die aktuelle Viewport-Position eines Elements
         * @param {Element} element - Zielelement
         * @returns {Object} Position-Objekt
         */
        getElementViewportPosition(element) {
            if (!element) return null;
            
            // Cache-Optimierung für wiederholte Berechnungen
            return this.read(() => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const windowWidth = window.innerWidth || document.documentElement.clientWidth;
                
                // Berechne Sichtbarkeitskoeffizienten (0-1)
                const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
                const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
                
                const visibleArea = visibleHeight > 0 && visibleWidth > 0 ?
                    (visibleHeight * visibleWidth) / (rect.height * rect.width) : 0;
                
                return {
                    rect,
                    visibleArea,
                    isFullyVisible: rect.top >= 0 && rect.bottom <= windowHeight && 
                                    rect.left >= 0 && rect.right <= windowWidth,
                    isPartiallyVisible: visibleArea > 0,
                    isAboveViewport: rect.bottom < 0,
                    isBelowViewport: rect.top > windowHeight
                };
            });
        }

        /**
         * Bereinigt alle Caches für optimierte Speichernutzung
         */
        clearCaches() {
            this.processedQueries.clear();
            this.elementCache.clear();
            this.mutationCache = new WeakMap();
        }
    }

    /**
     * NavigationSystem - Präzisionsoptimiertes Navigationssystem
     * Implementiert hoch-performante Scroll-Logik und Sektionsidentifikation
     */
    class NavigationSystem {
        constructor(eventBus, domManager, performanceOptimizer) {
            this.eventBus = eventBus;
            this.domManager = domManager;
            this.performanceOptimizer = performanceOptimizer;
            
            this.sections = [];
            this.navLinks = [];
            this.currentSection = null;
            this.headerHeight = CONSTANTS.DOM.SCROLL_OFFSET_DEFAULT;
            this.isScrolling = false;
            this.scrollDirection = 'down';
            this.lastScrollPosition = 0;
            
            // Optimierte IntersectionObserver-Konfiguration
            this.sectionObserver = null;
            this.headerObserver = null;
            
            // Event-Handler-Referenzen
            this.scrollHandler = null;
            this.delegatedClickHandler = null;
        }

        /**
         * Initialisiert das Navigationssystem
         */
        initialize() {
            // Header-Höhe berechnen
            this.calculateHeaderHeight();
            
            // Navigations-Elemente erfassen
            this.navLinks = this.domManager.querySelectorAll(CONSTANTS.DOM.SCROLL_LINK_SELECTOR);
            this.sections = this.domManager.querySelectorAll(CONSTANTS.DOM.SECTION_SELECTOR);
            
            // Observer initialisieren
            this.initializeObservers();
            
            // Event-Listener binden
            this.bindEventListeners();
            
            // Initiale Scroll-Position wiederherstellen oder Hash-Navigation ausführen
            this.handleInitialNavigation();
        }

        /**
         * Detektiert und speichert die Header-Höhe für präzise Offset-Berechnungen
         */
        calculateHeaderHeight() {
            const header = this.domManager.querySelector(CONSTANTS.DOM.HEADER_SELECTOR);
            
            if (header) {
                this.headerHeight = header.offsetHeight;
                
                // Header-Beobachter initialisieren
                this.initializeHeaderObserver(header);
            }
        }

        /**
         * Initialisiert Observer für Sektionen und Header
         */
        initializeObservers() {
            // Sektions-Observer für präzise Sichtbarkeitsberechnung
            this.sectionObserver = new IntersectionObserver(
                (entries) => {
                    // Deaktiviere während manueller Scrollvorgänge
                    if (this.isScrolling) return;
                    
                    // Finde die am meisten sichtbare Sektion
                    let maxVisibleSection = null;
                    let maxVisibility = 0;
                    
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Komplexere Berechnung der tatsächlichen Sichtbarkeit
                            const visibleHeight = Math.min(entry.boundingClientRect.bottom, window.innerHeight) - 
                                               Math.max(entry.boundingClientRect.top, 0);
                            const visibleRatio = visibleHeight / entry.boundingClientRect.height;
                            
                            if (visibleRatio > maxVisibility) {
                                maxVisibility = visibleRatio;
                                maxVisibleSection = entry.target;
                            }
                        }
                    });
                    
                    // Nur aktualisieren, wenn sich die Sektion ändert
                    if (maxVisibleSection && this.currentSection !== maxVisibleSection) {
                        this.setActiveSection(maxVisibleSection);
                    }
                },
                {
                    threshold: CONSTANTS.PERFORMANCE.INTERSECTION_THRESHOLDS,
                    rootMargin: `-${this.headerHeight}px 0px 0px 0px`
                }
            );
            
            // Sektionen registrieren
            this.sections.forEach(section => {
                this.sectionObserver.observe(section);
            });
        }

        /**
         * Initialisiert einen dedizierten Observer für Header-Veränderungen
         * @param {Element} header - Header-Element
         */
        initializeHeaderObserver(header) {
            // Beobachte Header-Änderungen und Scroll-Position
            this.headerObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const isHeaderVisible = entry.isIntersecting;
                        const headerClass = isHeaderVisible ? 'header-visible' : 'header-scrolled';
                        
                        // Optimiertes DOM-Update mit Batching
                        this.domManager.toggleClass(header, headerClass, true);
                        
                        // Header-Höhe nach Transformation aktualisieren
                        setTimeout(() => {
                            const newHeight = header.offsetHeight;
                            if (newHeight !== this.headerHeight) {
                                this.headerHeight = newHeight;
                                
                                // Sektions-Observer mit neuer Header-Höhe neu initialisieren
                                if (this.sectionObserver) {
                                    // Alte Observer trennen
                                    this.sections.forEach(section => {
                                        this.sectionObserver.unobserve(section);
                                    });
                                    
                                    // Neuen Observer initialisieren
                                    this.sectionObserver = new IntersectionObserver(
                                        this.sectionObserver._callback,
                                        {
                                            threshold: CONSTANTS.PERFORMANCE.INTERSECTION_THRESHOLDS,
                                            rootMargin: `-${this.headerHeight}px 0px 0px 0px`
                                        }
                                    );
                                    
                                    // Sektionen registrieren
                                    this.sections.forEach(section => {
                                        this.sectionObserver.observe(section);
                                    });
                                }
                            }
                        }, 300); // Nach Animation messen
                    });
                },
                {
                    threshold: [0],
                    rootMargin: "0px 0px 0px 0px"
                }
            );
            
            this.headerObserver.observe(header);
        }

        /**
         * Registriert alle Event-Listener mit optimaler Performance
         */
        bindEventListeners() {
            // Throttled Scroll-Handler registrieren
            this.scrollHandler = this.performanceOptimizer.throttle(
                this.handleScroll.bind(this),
                this.performanceOptimizer.calculateOptimalScrollThrottle(),
                { trailing: true }
            );
            
            window.addEventListener('scroll', this.scrollHandler, { passive: true });
            
            // Delegierter Click-Handler für Navigationselemente
            this.delegatedClickHandler = this.eventBus.delegate(
                CONSTANTS.DOM.SCROLL_LINK_SELECTOR,
                'click',
                this.handleNavClick.bind(this)
            );
            
            // Resize-Event-Handler mit Debouncing
            const resizeHandler = this.performanceOptimizer.debounce(
                () => {
                    this.calculateHeaderHeight();
                },
                CONSTANTS.PERFORMANCE.RESIZE_DEBOUNCE_DELAY
            );
            
            window.addEventListener('resize', resizeHandler, { passive: true });
            
            // Hash-Änderung beobachten
            window.addEventListener('hashchange', this.handleHashChange.bind(this));
        }

        /**
         * Verarbeitet Scroll-Events mit Richtungserkennung
         * @param {Event} event - Scroll-Event
         */
        handleScroll(event) {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Scroll-Richtung ermitteln
            this.scrollDirection = currentScroll > this.lastScrollPosition ? 'down' : 'up';
            this.lastScrollPosition = currentScroll;
            
            // Header-Klassen basierend auf Scroll-Position
            const header = this.domManager.querySelector(CONSTANTS.DOM.HEADER_SELECTOR);
            if (header) {
                if (currentScroll > 50) {
                    this.domManager.toggleClass(header, 'scrolled', true);
                } else {
                    this.domManager.toggleClass(header, 'scrolled', false);
                }
            }
            
            // Progress-Bar aktualisieren wenn vorhanden
            const progressBar = this.domManager.querySelector('.header-progress-bar .progress-indicator');
            if (progressBar) {
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100);
                
                this.domManager.setStyle(progressBar, 'width', `${progress}%`);
            }
        }

        /**
         * Event-Handler für Navigations-Klicks
         * @param {Event} event - Click-Event
         * @param {Element} element - Geklicktes Element
         */
        handleNavClick(event, element) {
            event.preventDefault();
            
            const targetId = element.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        }

        /**
         * Verarbeitet Hash-Änderungen für direktes Navigieren zu Sektionen
         * @param {Event} event - HashChange-Event
         */
        handleHashChange(event) {
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Minimal verzögern, um Browser-Standard-Scroll zu verhindern
                    setTimeout(() => {
                        this.scrollToElement(targetElement);
                    }, 10);
                }
            }
        }

        /**
         * Führt die initiale Navigation auf Basis von Hash oder gespeicherter Position aus
         */
        handleInitialNavigation() {
            // Priorität 1: Hash-Navigation
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Verzögerung für korrekte DOM-Initialisierung
                    setTimeout(() => {
                        this.scrollToElement(targetElement, { behavior: 'auto' });
                    }, 100);
                    return;
                }
            }
            
            // Priorität 2: Gespeicherte Scroll-Position
            const savedScrollPosition = localStorage.getItem(CONSTANTS.STORAGE.SCROLL_POSITION_KEY);
            if (savedScrollPosition) {
                // Verzögerung für korrekte DOM-Initialisierung
                setTimeout(() => {
                    window.scrollTo({
                        top: parseInt(savedScrollPosition, 10),
                        behavior: 'auto'
                    });
                }, 100);
            }
        }

        /**
         * Aktualisiert die aktive Sektion und zugehörige Navigationselemente
         * @param {Element} section - Aktive Sektion
         */
        setActiveSection(section) {
            if (!section) return;
            
            // Vorherige Sektion deaktivieren
            if (this.currentSection) {
                this.domManager.toggleClass(this.currentSection, CONSTANTS.DOM.ACTIVE_SECTION_CLASS, false);
            }
            
            // Neue Sektion aktivieren
            this.domManager.toggleClass(section, CONSTANTS.DOM.ACTIVE_SECTION_CLASS, true);
            this.currentSection = section;
            
            // Navigationselemente aktualisieren
            const sectionId = section.id;
            this.navLinks.forEach(link => {
                const linkTarget = link.getAttribute('href').substring(1);
                
                // Effiziente DOM-Aktualisierung mit Batching
                if (linkTarget === sectionId) {
                    this.domManager.toggleClass(link, CONSTANTS.DOM.ACTIVE_LINK_CLASS, true);
                } else {
                    this.domManager.toggleClass(link, CONSTANTS.DOM.ACTIVE_LINK_CLASS, false);
                }
            });
            
            // Hash aktualisieren ohne Scrollen
            this.updateUrlHash(sectionId);
            
            // Event senden
            this.eventBus.emit(CONSTANTS.EVENTS.SECTION_VISIBLE, { section, id: sectionId });
        }

        /**
         * Scrollt sanft zu einem Element mit präziser Offset-Berechnung
         * @param {Element} element - Zielelement
         * @param {Object} [options] - Scroll-Optionen
         */
        scrollToElement(element, options = {}) {
            if (!element) return;
            
            // Scroll-Status setzen
            this.isScrolling = true;
            
            // Element-Position berechnen mit Header-Offset
            const rect = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - this.headerHeight;
            
            // Scroll-Optionen mit Defaults
            const scrollOptions = {
                top: targetPosition,
                behavior: options.behavior || 'smooth'
            };
            
            // Scroll ausführen
            window.scrollTo(scrollOptions);
            
            // Scrollende überwachen
            let lastKnownPos = window.pageYOffset;
            const scrollEndCheck = () => {
                const currentPos = window.pageYOffset;
                if (Math.abs(currentPos - targetPosition) < 2 || currentPos === lastKnownPos) {
                    // Scroll ist beendet
                    this.isScrolling = false;
                    this.eventBus.emit(CONSTANTS.EVENTS.SCROLL_COMPLETED, { target: element, position: currentPos });
                    
                    // Aktive Sektion setzen
                    this.setActiveSection(element);
                } else {
                    // Scroll läuft noch
                    lastKnownPos = currentPos;
                    requestAnimationFrame(scrollEndCheck);
                }
            };
            
            // Animationsende überwachen
            if (scrollOptions.behavior === 'smooth') {
                // Bei Smooth Scroll das Ende überwachen
                requestAnimationFrame(scrollEndCheck);
            } else {
                // Bei Instant Scroll sofort als beendet markieren
                setTimeout(() => {
                    this.isScrolling = false;
                    this.eventBus.emit(CONSTANTS.EVENTS.SCROLL_COMPLETED, { target: element, position: targetPosition });
                    this.setActiveSection(element);
                }, 10);
            }
        }

        /**
         * Aktualisiert den URL-Hash ohne Scrollen
         * @param {string} sectionId - Sektions-ID
         */
        updateUrlHash(sectionId) {
            if (history.replaceState) {
                // Modern History API
                const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${sectionId ? '#' + sectionId : ''}`;
                history.replaceState(null, null, newUrl);
            } else {
                // Fallback für ältere Browser
                window.location.hash = sectionId;
            }
        }

        /**
         * Speichert die aktuelle Scroll-Position
         */
        saveScrollPosition() {
            const currentPosition = window.pageYOffset || document.documentElement.scrollTop;
            localStorage.setItem(CONSTANTS.STORAGE.SCROLL_POSITION_KEY, currentPosition.toString());
        }

        /**
         * Bereinigt alle Ressourcen und Event-Listener
         */
        destroy() {
            // Aktuellen Zustand speichern
            this.saveScrollPosition();
            
            // Event-Listener entfernen
            window.removeEventListener('scroll', this.scrollHandler);
            
            // Delegate entfernen
            if (this.delegatedClickHandler) {
                this.delegatedClickHandler.remove();
            }
            
            // Observer trennen
            if (this.sectionObserver) {
                this.sections.forEach(section => {
                    this.sectionObserver.unobserve(section);
                });
                this.sectionObserver = null;
            }
            
            if (this.headerObserver) {
                const header = this.domManager.querySelector(CONSTANTS.DOM.HEADER_SELECTOR);
                if (header) {
                    this.headerObserver.unobserve(header);
                }
                this.headerObserver = null;
            }
        }
    }

    /**
     * ThemeManager - Präzises Theme-Management ohne DOM-Manipulationskonflikte
     * Implementiert ein optimiertes Theming-System mit minimaler Style-Rekalkulation
     */
    class ThemeManager {
        constructor(eventBus, domManager) {
            this.eventBus = eventBus;
            this.domManager = domManager;
            
            this.currentTheme = CONSTANTS.THEMES.DARK;
            this.themeStylesheets = {
                [CONSTANTS.THEMES.DARK]: null,
                [CONSTANTS.THEMES.LIGHT]: null
            };
            
            this.themeToggles = [];
        }

        /**
         * Initialisiert das Theme-Management-System
         */
        initialize() {
            // Stylesheet-Referenzen erfassen
            this.themeStylesheets[CONSTANTS.THEMES.DARK] = document.getElementById('theme-dark');
            this.themeStylesheets[CONSTANTS.THEMES.LIGHT] = document.getElementById('theme-light');
            
            // Toggle-Elemente erfassen
            this.themeToggles = this.domManager.querySelectorAll(CONSTANTS.DOM.THEME_TOGGLE_SELECTOR);
            
            // Gespeichertes Theme laden oder System-Präferenz anwenden
            this.loadInitialTheme();
            
            // Event-Listener für Theme-Wechsel registrieren
            this.bindEventListeners();
            
            // System-Präferenz überwachen
            this.observeSystemPreference();
        }

        /**
         * Registriert Event-Listener für Theme-Wechsel
         */
        bindEventListeners() {
            // Event-Delegation für effizientes Listener-Management
            this.toggleHandler = this.eventBus.delegate(
                CONSTANTS.DOM.THEME_TOGGLE_SELECTOR,
                'click',
                this.handleThemeToggle.bind(this)
            );
        }

        /**
         * Lädt initiales Theme aus Storage oder System-Präferenz
         */
        loadInitialTheme() {
            // Priorität 1: Gespeichertes Theme
            const savedTheme = localStorage.getItem(CONSTANTS.STORAGE.THEME_KEY);
            
            if (savedTheme && Object.values(CONSTANTS.THEMES).includes(savedTheme)) {
                this.setTheme(savedTheme);
                return;
            }
            
            // Priorität 2: System-Präferenz
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.setTheme(CONSTANTS.THEMES.LIGHT);
            } else {
                this.setTheme(CONSTANTS.THEMES.DARK);
            }
        }

        /**
         * Beobachtet Änderungen der System-Präferenz
         */
        observeSystemPreference() {
            if (!window.matchMedia) return;
            
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            
            // Initialen Zustand prüfen
            if (mediaQuery.media !== 'not all') {
                mediaQuery.addEventListener('change', (e) => {
                    // Nur ändern, wenn kein explizites Theme gesetzt wurde
                    if (!localStorage.getItem(CONSTANTS.STORAGE.THEME_KEY)) {
                        this.setTheme(e.matches ? CONSTANTS.THEMES.LIGHT : CONSTANTS.THEMES.DARK);
                    }
                });
            }
        }

        /**
         * Event-Handler für Theme-Toggle
         * @param {Event} event - Click-Event
         */
        handleThemeToggle(event) {
            event.preventDefault();
            
            // Aktuelles Theme umschalten
            const newTheme = this.currentTheme === CONSTANTS.THEMES.DARK ? 
                           CONSTANTS.THEMES.LIGHT : 
                           CONSTANTS.THEMES.DARK;
            
            this.setTheme(newTheme);
        }

        /**
         * Setzt ein spezifisches Theme mit optimierten DOM-Operationen
         * @param {string} theme - Theme-Bezeichner
         */
        setTheme(theme) {
            if (!Object.values(CONSTANTS.THEMES).includes(theme)) return;
            
            // Aktuelles Theme speichern
            this.currentTheme = theme;
            
            // Root-Attribut setzen (triggert CSS-Variablen)
            this.domManager.setAttribute(document.documentElement, 'data-theme', theme);
            
            // Stylesheets aktivieren/deaktivieren
            this.enableThemeStylesheet(theme);
            
            // Theme im Storage speichern
            localStorage.setItem(CONSTANTS.STORAGE.THEME_KEY, theme);
            
            // UI-Status aktualisieren
            this.updateThemeTogglesUI();
            
            // Event emittieren
            this.eventBus.emit(CONSTANTS.EVENTS.THEME_CHANGED, { theme });
        }

        /**
         * Aktiviert das richtige Theme-Stylesheet und deaktiviert andere
         * @param {string} theme - Zu aktivierendes Theme
         */
        enableThemeStylesheet(theme) {
            // Alle Theme-Stylesheets deaktivieren
            Object.entries(this.themeStylesheets).forEach(([themeKey, stylesheet]) => {
                if (stylesheet) {
                    if (themeKey === theme) {
                        this.domManager.write(() => {
                            stylesheet.removeAttribute('disabled');
                        });
                    } else {
                        this.domManager.write(() => {
                            stylesheet.setAttribute('disabled', '');
                        });
                    }
                }
            });
        }

        /**
         * Aktualisiert die UI aller Theme-Toggle-Elemente
         */
        updateThemeTogglesUI() {
            this.themeToggles.forEach(toggle => {
                // Theme-Icon-Status aktualisieren
                const lightIcon = toggle.querySelector('.theme-icon-light');
                const darkIcon = toggle.querySelector('.theme-icon-dark');
                
                if (lightIcon && darkIcon) {
                    if (this.currentTheme === CONSTANTS.THEMES.LIGHT) {
                        this.domManager.setStyles(lightIcon, {
                            'opacity': '1',
                            'transform': 'translateY(0)'
                        });
                        
                        this.domManager.setStyles(darkIcon, {
                            'opacity': '0',
                            'transform': 'translateY(-100%)'
                        });
                    } else {
                        this.domManager.setStyles(lightIcon, {
                            'opacity': '0',
                            'transform': 'translateY(100%)'
                        });
                        
                        this.domManager.setStyles(darkIcon, {
                            'opacity': '1',
                            'transform': 'translateY(0)'
                        });
                    }
                }
            });
        }
    }

    /**
     * LanguageManager - Internationalisierungssystem mit dynamischem String-Management
     * Implementiert ein optimiertes Translation-Management mit präzisen DOM-Updates
     */
    class LanguageManager {
        constructor(eventBus, domManager) {
            this.eventBus = eventBus;
            this.domManager = domManager;
            
            this.currentLanguage = 'de'; // Default
            this.translations = new Map();
            this.supportedLanguages = ['de', 'en'];
            this.dataAttributeName = 'data-i18n';
            this.dataAttributePlaceholderName = 'data-i18n-placeholder';
            this.languageButtons = [];
            
            this.storageKey = CONSTANTS.STORAGE.LANGUAGE_KEY;
        }

        /**
         * Initialisiert das Language-Management-System
         * @returns {Promise<void>}
         */
        async initialize() {
            // Sprachschalter erfassen
            this.languageButtons = this.domManager.querySelectorAll(CONSTANTS.DOM.LANGUAGE_TOGGLE_SELECTOR);
            
            // Initiale Sprachpräferenz bestimmen und laden
            const initialLanguage = this.determineInitialLanguage();
            
            // Übersetzungen laden
            try {
                await this.loadTranslations(initialLanguage);
                
                // UI aktualisieren
                this.currentLanguage = initialLanguage;
                document.documentElement.setAttribute('lang', initialLanguage);
                this.updateLanguageButtonsUI();
                
                // DOM mit Übersetzungen aktualisieren
                this.updateDOM();
                
                // Event-Listener registrieren
                this.bindEventListeners();
                
                // Initialisierungserfolg signalisieren
                this.eventBus.emit(CONSTANTS.EVENTS.LANGUAGE_CHANGED, { language: initialLanguage });
            } catch (error) {
                console.error('Failed to initialize language system:', error);
            }
        }

        /**
         * Bestimmt die initiale Sprache basierend auf Präferenzen
         * @returns {string} Sprachcode
         */
        determineInitialLanguage() {
            // Priorität 1: Gespeicherte Präferenz
            const savedLanguage = localStorage.getItem(this.storageKey);
            if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
                return savedLanguage;
            }
            
            // Priorität 2: Browser-Sprache
            const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
            if (this.supportedLanguages.includes(browserLang)) {
                return browserLang;
            }
            
            // Fallback auf Default
            return 'de';
        }

        /**
         * Lädt Übersetzungen für eine bestimmte Sprache
         * @param {string} language - Sprachcode
         * @returns {Promise<boolean>} Erfolg
         */
        async loadTranslations(language) {
            if (!this.supportedLanguages.includes(language)) {
                return false;
            }
            
            // Prüfen, ob Übersetzungen bereits geladen sind
            if (this.translations.has(language)) {
                return true;
            }
            
            try {
                const response = await fetch(`assets/i18n/${language}.json?v=${Date.now()}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const translations = await response.json();
                this.translations.set(language, translations);
                
                return true;
            } catch (error) {
                console.error(`Failed to load translations for ${language}:`, error);
                return false;
            }
        }

        /**
         * Registriert Event-Listener für Sprachschalter
         */
        bindEventListeners() {
            // Delegierter Listener für Sprachschalter
            this.languageToggleHandler = this.eventBus.delegate(
                CONSTANTS.DOM.LANGUAGE_TOGGLE_SELECTOR,
                'click',
                async (event, element) => {
                    event.preventDefault();
                    
                    const language = element.getAttribute('data-language');
                    if (language && this.supportedLanguages.includes(language)) {
                        await this.changeLanguage(language);
                    }
                }
            );
        }

        /**
         * Wechselt die aktive Sprache und aktualisiert das UI
         * @param {string} language - Zielsprache
         * @returns {Promise<boolean>} Erfolg
         */
        async changeLanguage(language) {
            if (!this.supportedLanguages.includes(language)) {
                return false;
            }
            
            // Übersetzungen laden falls noch nicht geschehen
            if (!this.translations.has(language)) {
                const success = await this.loadTranslations(language);
                if (!success) return false;
            }
            
            // Aktuelle Sprache aktualisieren
            this.currentLanguage = language;
            document.documentElement.setAttribute('lang', language);
            
            // UI aktualisieren
            this.updateLanguageButtonsUI();
            
            // DOM mit neuen Übersetzungen aktualisieren
            this.updateDOM();
            
            // Einstellung speichern
            localStorage.setItem(this.storageKey, language);
            
            // Event emittieren
            this.eventBus.emit(CONSTANTS.EVENTS.LANGUAGE_CHANGED, { language });
            
            return true;
        }

        /**
         * Aktualisiert den DOM mit aktuellen Übersetzungen
         */
        updateDOM() {
            const translations = this.translations.get(this.currentLanguage);
            if (!translations) return;
            
            // Elemente mit Übersetzungsattribut finden
            const elements = this.domManager.querySelectorAll(`[${this.dataAttributeName}]`);
            
            // Übersetzungen anwenden
            elements.forEach(element => {
                const key = element.getAttribute(this.dataAttributeName);
                const translationText = this.getTranslation(key, translations);
                
                if (translationText) {
                    this.domManager.write(() => {
                        element.textContent = translationText;
                    });
                }
            });
            
            // Placeholder-Übersetzungen anwenden
            const placeholderElements = this.domManager.querySelectorAll(`[${this.dataAttributePlaceholderName}]`);
            
            placeholderElements.forEach(element => {
                const key = element.getAttribute(this.dataAttributePlaceholderName);
                const translationText = this.getTranslation(key, translations);
                
                if (translationText) {
                    this.domManager.write(() => {
                        element.setAttribute('placeholder', translationText);
                    });
                }
            });
        }

        /**
         * Holt eine Übersetzung aus dem Übersetzungsobjekt mittels Dot-Notation-Pfad
         * @param {string} key - Übersetzungsschlüssel (dot-notation)
         * @param {Object} translations - Übersetzungsobjekt
         * @returns {string|null} Übersetzter Text
         */
        getTranslation(key, translations) {
            if (!key || !translations) return null;
            
            // Pfad aufteilen
            const path = key.split('.');
            let current = translations;
            
            // Pfad traversieren
            for (const part of path) {
                if (current[part] === undefined) {
                    return null;
                }
                current = current[part];
            }
            
            return typeof current === 'string' ? current : null;
        }

        /**
         * Aktualisiert die UI der Sprachschalter
         */
        updateLanguageButtonsUI() {
            this.languageButtons.forEach(button => {
                const buttonLang = button.getAttribute('data-language');
                
                // Aktiven Status setzen
                if (buttonLang === this.currentLanguage) {
                    this.domManager.setAttribute(button, 'data-active', 'true');
                    this.domManager.toggleClass(button, 'active', true);
                } else {
                    this.domManager.setAttribute(button, 'data-active', 'false');
                    this.domManager.toggleClass(button, 'active', false);
                }
            });
        }
    }

    /**
     * ApplicationInitializer - Präzise Initialisierungshierarchie
     * Orchestriert die sequentielle Initialisierung mit optimaler Abhängigkeitsauflösung
     */
    class ApplicationInitializer {
        constructor() {
            // Core-Services
            this.eventBus = new EventBus();
            this.performanceOptimizer = new PerformanceOptimizer();
            this.domManager = new DOMManager();
            
            // Funktionale Services
            this.navigationSystem = new NavigationSystem(this.eventBus, this.domManager, this.performanceOptimizer);
            this.themeManager = new ThemeManager(this.eventBus, this.domManager);
            this.languageManager = new LanguageManager(this.eventBus, this.domManager);
            
            // Initialisierungszustand
            this.initialized = false;
            this.startTime = performance.now();
        }

        /**
         * Führt die sequentielle Initialisierung durch
         * @returns {Promise<boolean>} Initialisierungsstatus
         */
        async initialize() {
            if (this.initialized) return true;
            
            console.time('AppInitialization');
            
            try {
                // Phase 1: Browser-Umgebungsprüfung
                this.performEnvironmentCheck();
                
                // Phase 2: Core-Dienste initialisieren
                this.initializeCoreServices();
                
                // Phase 3: Funktionale Dienste initialisieren
                await this.initializeFunctionalServices();
                
                // Phase 4: Event-Listener registrieren
                this.registerGlobalEventListeners();
                
                // Initialisierung abschließen
                this.initialized = true;
                const initTime = performance.now() - this.startTime;
                
                console.timeEnd('AppInitialization');
                console.info(`Application initialized in ${Math.round(initTime)}ms`);
                
                // Initialisierungserfolg signalisieren
                this.eventBus.emit(CONSTANTS.EVENTS.APP_INITIALIZED, {
                    timestamp: Date.now(),
                    duration: initTime
                });
                
                return true;
            } catch (error) {
                console.error('Application initialization failed:', error);
                return false;
            }
        }

        /**
         * Führt eine Umgebungsprüfung für kritische Browserfunktionen durch
         */
        performEnvironmentCheck() {
            // Grundlegende Feature-Tests
            const requiredFeatures = {
                IntersectionObserver: typeof IntersectionObserver !== 'undefined',
                requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
                localStorage: (() => {
                    try {
                        localStorage.setItem('test', 'test');
                        localStorage.removeItem('test');
                        return true;
                    } catch (e) {
                        return false;
                    }
                })(),
                Promise: typeof Promise !== 'undefined'
            };
            
            // Prüfe, ob alle erforderlichen Features verfügbar sind
            const missingFeatures = Object.entries(requiredFeatures)
                .filter(([_, supported]) => !supported)
                .map(([feature]) => feature);
            
            if (missingFeatures.length > 0) {
                console.warn('Browser missing required features:', missingFeatures);
                
                // Fallback-Implementierungen laden wenn notwendig
                // Für Produktions-Umgebungen wäre hier ein Polyfill-Loader sinnvoll
            }
        }

        /**
         * Initialisiert Core-Dienste mit präziser Reihenfolge
         */
        initializeCoreServices() {
            // In diesem Fall sind die Core-Dienste bereits im Konstruktor erstellt
            // und benötigen keine separate Initialisierung
        }

        /**
         * Initialisiert funktionale Dienste in optimaler Sequenz
         * @returns {Promise<void>}
         */
        async initializeFunctionalServices() {
            // 1. Theme-Manager initialisieren (beeinflusst visuelle Darstellung)
            this.themeManager.initialize();
            
            // 2. Navigation-System initialisieren (beeinflusst Scroll-Verhalten)
            this.navigationSystem.initialize();
            
            // 3. Language-Manager asynchron initialisieren (lädt Übersetzungsdateien)
            await this.languageManager.initialize();
        }

        /**
         * Registriert globale Event-Listener
         */
        registerGlobalEventListeners() {
            // Unload-Handler für Zustandspersistenz
            window.addEventListener('beforeunload', () => {
                this.navigationSystem.saveScrollPosition();
            });
            
            // Optimierter Resize-Handler
            const resizeHandler = this.performanceOptimizer.debounce(() => {
                // Cache leeren
                this.domManager.clearCaches();
                
                // Event senden
                this.eventBus.emit(CONSTANTS.EVENTS.WINDOW_RESIZED, {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, CONSTANTS.PERFORMANCE.RESIZE_DEBOUNCE_DELAY);
            
            window.addEventListener('resize', resizeHandler, { passive: true });
            
            // Optimierter Visibility-Handler
            document.addEventListener('visibilitychange', () => {
                const isVisible = document.visibilityState === 'visible';
                
                if (isVisible) {
                    // Anwendung ist wieder sichtbar - inkrementell aktualisieren
                    this.domManager.clearCaches();
                    this.navigationSystem.calculateHeaderHeight();
                }
            });
        }
    }

    /**
     * Globale Anwendungsinstanz initialisieren
     */
    // Prüfe, ob DOM bereits geladen ist
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const app = new ApplicationInitializer();
            app.initialize();
            
            // Globalen Zugriff auf die App-Instanz ermöglichen (für Debug-Zwecke)
            window.FerrumApp = app;
        });
    } else {
        // DOM bereits geladen, sofort initialisieren
        const app = new ApplicationInitializer();
        app.initialize();
        
        // Globalen Zugriff auf die App-Instanz ermöglichen (für Debug-Zwecke)
        window.FerrumApp = app;
    }
})();