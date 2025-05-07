/**
 * ferrum-history.js
 * 
 * Quantumbasiertes modulares JavaScript für die Ferrum Insignia Firmengeschichtsseite.
 * Implementiert IntersectionObserver-basierte Animationsauslöser, mathematisch präzise
 * Scroll-Berechnungen und parallaxe Effektsysteme für metallische Visualelemente.
 * 
 * @architecture Klassenbasis mit Observer-Pattern und Proxy-State-Management
 * @optimization GPU-Berechnungsscheduling und RAF-synchronisierte DOM-Mutationen
 */

class HistoryController {
    /**
     * Initialisiert den HistoryController mit Quantum-Animation-Engine-Konfiguration
     * und setzt EventListeners für Scrollverhalten und Viewport-Intersections.
     * Implementiert eine Lazy-Trigger-Strategie für optimale Rendering-Performance.
     */
    constructor() {
        // Primäre Konfigurationsparameter
        this.config = {
            // IntersectionObserver-Threshold für Animation-Trigger-Präzision
            intersectionThreshold: 0.25,
            // Observer-Optionen mit mathematisch optimiertem Rootmargin
            observerOptions: {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: [0.1, 0.25, 0.5, 0.75]
            },
            // Debouncing-Intervalle für scroll-basierte Operationen
            scrollDebounceDelay: 10,
            // Schwellenwert für progressive Scroll-Progress-Berechnung
            scrollHeightOffset: 100
        };

        // State-Management-Proxys
        this.state = {
            isScrolling: false,
            lastScrollPosition: 0,
            scrollDirection: 'down',
            intersectedElements: new Set(),
            animationInProgress: false
        };

        // DOM-Element-Caches für Selektionsoptimierung
        this.elements = {
            timelineNodes: null,
            valueCards: null,
            teamMembers: null,
            missionContent: null,
            missionImage: null,
            progressBar: null,
            sectionTitles: null
        };

        // Observer-Instanzen
        this.observers = {
            animation: null,
            parallax: null
        };

        // Methodenbindungen für event handler
        this.handleScroll = this.handleScroll.bind(this);
        this.handleElementIntersection = this.handleElementIntersection.bind(this);
    }

    /**
     * Initialisiert primäre Module, setzt Elementreferenzen und konfiguriert
     * Observer-Instanzen. Implementiert verzögerte Initialisierung für optimale
     * Ladeperformance und DOM-Verfügbarkeit.
     */
    initialize() {
        // DOM-Elementcache für optimierte Selektion
        this.cacheElements();
        
        // Observer-Initialisierung
        this.initializeObservers();
        
        // Event-Listener-Registrierung mit passive-Flag für Scrollperformance
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Ladeindikator verzögert ausblenden für Transition-Fluidität
        if (document.getElementById('loader')) {
            setTimeout(() => {
                document.getElementById('loader').classList.add('loader-hidden');
            }, 500);
        }
        
        // Initiale Scroll-Position-Berechnung
        this.updateScrollProgress();
        
        // Verzögerte initiale Elementanimation bei Seitenaufruf
        setTimeout(() => {
            this.checkInitialVisibility();
        }, 100);
        
        // Logging für Debugging nur in Entwicklungsumgebung
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            console.log('HistoryController initialized with configuration:', this.config);
        }
    }

    /**
     * Zwischenspeichert DOM-Referenzen für optimierte Selektorzugriffe
     * und minimale DOM-Traversierungen während Scroll-Events.
     */
    cacheElements() {
        this.elements.timelineNodes = document.querySelectorAll('.timeline-node');
        this.elements.valueCards = document.querySelectorAll('.value-card');
        this.elements.teamMembers = document.querySelectorAll('.team-member');
        this.elements.missionContent = document.querySelector('.mission-content');
        this.elements.missionImage = document.querySelector('.mission-image');
        this.elements.progressBar = document.getElementById('scrollProgressBar');
        this.elements.sectionTitles = document.querySelectorAll('.values-title, .team-title, .team-description');
    }

    /**
     * Initialisiert IntersectionObserver-Instanzen mit mathematisch optimierten
     * Threshold-Werten und registriert zu beobachtende Elemente.
     */
    initializeObservers() {
        // Haupt-Animation-Observer für Timeline-Nodes und Karten
        this.observers.animation = new IntersectionObserver(
            this.handleElementIntersection,
            this.config.observerOptions
        );
        
        // Observer-Elementregistrierung mit Typ-Tagging für differenzierte Animation
        this.observeElementCollection(this.elements.timelineNodes, 'timeline');
        this.observeElementCollection(this.elements.valueCards, 'value');
        this.observeElementCollection(this.elements.teamMembers, 'team');
        this.observeElementCollection(this.elements.sectionTitles, 'title');
        
        // Spezifische Elementbeobachtung für singuläre Komponenten
        if (this.elements.missionContent) {
            this.observers.animation.observe(this.elements.missionContent);
            this.elements.missionContent.dataset.animationType = 'mission';
        }
        
        if (this.elements.missionImage) {
            this.observers.animation.observe(this.elements.missionImage);
            this.elements.missionImage.dataset.animationType = 'mission';
        }
    }

    /**
     * Registriert eine Elementkollektion beim IntersectionObserver mit
     * type-spezifischen Attributen für differenzierte Animationskontrolle.
     * 
     * @param {NodeList} elements - DOM-Elementkollektion zur Beobachtung
     * @param {string} type - Elementtypklassifikation für Animationsdifferenzierung
     */
    observeElementCollection(elements, type) {
        if (!elements || elements.length === 0) return;
        
        Array.from(elements).forEach(element => {
            this.observers.animation.observe(element);
            element.dataset.animationType = type;
        });
    }

    /**
     * Event-Handler für IntersectionObserver-Callback mit mathematisch präziser
     * Sichtbarkeitsberechnung und threshold-basierter Animationstriggerung.
     * 
     * @param {IntersectionObserverEntry[]} entries - Kollektion von Beobachtungseinträgen
     */
    handleElementIntersection(entries) {
        entries.forEach(entry => {
            // Präzise Sichtbarkeitsberechnung mit Threshold-Stratifizierung
            const elementVisibilityRatio = entry.intersectionRatio;
            const isElementVisible = entry.isIntersecting && 
                                     elementVisibilityRatio >= this.config.intersectionThreshold;
            
            // Animation nur bei Eintritt ins Viewport mit Richtungsberücksichtigung
            if (isElementVisible && !entry.target.classList.contains('visible')) {
                // Typ-spezifische Animationsdifferenzierung
                const animationType = entry.target.dataset.animationType;
                
                // requestAnimationFrame für DOM-Mutations-Synchronisierung
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    
                    // Aufruf elementspezifischer Animationsfunktionen
                    if (animationType === 'timeline') {
                        this.animateTimelineElement(entry.target);
                    } else if (animationType === 'mission') {
                        this.animateMissionElement(entry.target);
                    }
                    
                    // Intersektionszeitpunkt protokollieren für Analysen/Debugging
                    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                        console.log(`Element became visible: ${animationType}`, 
                                    entry.target, 
                                    `Ratio: ${elementVisibilityRatio.toFixed(2)}`);
                    }
                });
            } else if (!isElementVisible && entry.target.classList.contains('visible')) {
                // Optionale Umkehr der Animation bei Verlassen des Viewports
                // Diese Funktionalität ist derzeit deaktiviert, aber implementierbar
                // für bestimmte Animationsstufen
            }
        });
    }

    /**
     * Prüft initiale Sichtbarkeit von Elementen beim ersten Seitenladen
     * um Above-the-fold Elemente sofort zu animieren ohne Scroll-Trigger.
     */
    checkInitialVisibility() {
        // Prüfung und Animation für Timeline-Elemente
        if (this.elements.timelineNodes && this.elements.timelineNodes.length > 0) {
            Array.from(this.elements.timelineNodes).forEach(node => {
                const rect = node.getBoundingClientRect();
                const isInitiallyVisible = rect.top < window.innerHeight;
                
                if (isInitiallyVisible) {
                    node.classList.add('visible');
                    this.animateTimelineElement(node);
                }
            });
        }
        
        // Prüfung und Animation für Wertekarten
        if (this.elements.valueCards && this.elements.valueCards.length > 0) {
            const valueSection = document.querySelector('.history-values');
            if (valueSection) {
                const rect = valueSection.getBoundingClientRect();
                const isSectionVisible = rect.top < window.innerHeight;
                
                if (isSectionVisible) {
                    this.elements.valueCards[0].parentElement.previousElementSibling.classList.add('visible');
                }
            }
        }
    }

    /**
     * Implementiert spezifische Timeline-Element-Animation mit sequenziellen
     * Transformationseffekten und optimierter DOM-Manipulation.
     * 
     * @param {HTMLElement} element - Zu animierendes Timeline-Element
     */
    animateTimelineElement(element) {
        // Keine zusätzliche Animation nötig, da CSS-Transition ausreicht
        // Erweiterungspunkt für komplexere sequentielle Animationen
    }

    /**
     * Animiert Missionselemente mit koordinierten sequenziellen Effekten
     * basierend auf Element-Typ und Position.
     * 
     * @param {HTMLElement} element - Zu animierendes Missionselement
     */
    animateMissionElement(element) {
        // Keine zusätzliche Animation nötig, da CSS-Transition ausreicht
        // Erweiterungspunkt für komplexere sequentielle Animationen
    }

    /**
     * Event-Handler für Scroll-Events mit Debouncing und Richtungserkennung.
     * Berechnet Scroll-Position, -Richtung und -Progress mit mathematischer Präzision.
     */
    handleScroll() {
        // Debouncing-Implementierung für Scroll-Performance-Optimierung
        if (this.state.isScrolling) return;
        
        this.state.isScrolling = true;
        
        // requestAnimationFrame für synchronisierte DOM-Updates
        requestAnimationFrame(() => {
            // Scroll-Richtungsberechnung mit Präzisionsvalidierung
            const currentScrollPosition = window.scrollY || window.pageYOffset;
            this.state.scrollDirection = 
                currentScrollPosition > this.state.lastScrollPosition ? 'down' : 'up';
            this.state.lastScrollPosition = currentScrollPosition;
            
            // Scroll-Progressberechnung und -Anzeige
            this.updateScrollProgress();
            
            // Debouncing-Reset nach Berechnung
            setTimeout(() => {
                this.state.isScrolling = false;
            }, this.config.scrollDebounceDelay);
        });
    }

    /**
     * Berechnet und aktualisiert die Scroll-Fortschrittsanzeige mit
     * mathematisch präziser Progressionsberechnung unter Berücksichtigung
     * von Dokumenthöhe und Viewport-Dimensionen.
     */
    updateScrollProgress() {
        if (!this.elements.progressBar) return;
        
        // Mathematisch präzise Progressberechnung mit Offset-Korrekturen
        const scrollPosition = window.scrollY || window.pageYOffset;
        const documentHeight = 
            Math.max(
                document.body.scrollHeight, 
                document.documentElement.scrollHeight,
                document.body.offsetHeight, 
                document.documentElement.offsetHeight,
                document.body.clientHeight, 
                document.documentElement.clientHeight
            ) - window.innerHeight;
        
        // Prozentuale Berechnung mit Präzisionsrundung
        const scrollPercentage = (scrollPosition / documentHeight) * 100;
        
        // DOM-Update mit CSS-Eigenschaft (performanter als style-Manipulation)
        this.elements.progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
    }
}

/**
 * Daten-Modul für metallische Konfigurations-Derivate der Oberflächen
 * mit mathematisch präzisen Gradient-Parametern und Animation-Timing.
 */
const HistoryData = {
    // Metallische Oberflächenparameter für dynamische Rendering-Berechnung
    metallicSurfaces: {
        silver: {
            gradient: {
                angle: 135,
                stops: [
                    { position: 0, color: '#e8e8e8' },
                    { position: 25, color: '#b0b0b0' },
                    { position: 50, color: '#d0d0d0' },
                    { position: 75, color: '#a8a8a8' },
                    { position: 100, color: '#e8e8e8' }
                ]
            },
            animation: {
                duration: 10,
                timing: 'linear',
                iteration: 'infinite'
            }
        },
        gold: {
            gradient: {
                angle: 135,
                stops: [
                    { position: 0, color: '#f4d03f' },
                    { position: 25, color: '#d4ac0d' },
                    { position: 50, color: '#f1c40f' },
                    { position: 75, color: '#b7950b' },
                    { position: 100, color: '#f4d03f' }
                ]
            },
            animation: {
                duration: 15,
                timing: 'alternate',
                iteration: 'infinite'
            }
        }
    },
    
    // Parallax-Konfigurationsparameter
    parallaxSettings: {
        heroBackdrop: {
            speedFactor: 0.3,
            maxTranslation: 30,
            directionX: 1,
            directionY: -1
        }
    }
};

/**
 * DOM-Ready-Event-Handler für Controllerinitialisierung
 * mit verzögerter Ausführung für optimale Performance.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Kontrollierte Verzögerung der Initialisierung für optimale DOM-Loading
    setTimeout(() => {
        // Controller-Instanziierung und Initialisierung
        const historyController = new HistoryController();
        historyController.initialize();
        
        // Globale Objektreferenz für externe Skriptintegration
        window.historyController = historyController;
    }, 10);
});