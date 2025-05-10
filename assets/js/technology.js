/**
 * technology.js - Technologieseiten-spezifische Funktionen und Interaktionen
 * @module TechnologyController
 */

document.addEventListener('DOMContentLoaded', function() {
    // Systeminitialisierungs-Sentinel
    const systemReady = document.readyState === 'interactive' || document.readyState === 'complete';
    
    // Modulinitialisierung mit Bedingungs-Hook
    if (systemReady) {
        initializeTechnologyPage();
    } else {
        document.addEventListener('readystatechange', function() {
            if (document.readyState === 'interactive') {
                initializeTechnologyPage();
            }
        });
    }
    
    /**
     * Haupt-Initialisierungsfunktion für die Technologieseite
     * Orchestriert Subsystemaktivierung in kaskadierender Abfolge
     */
    function initializeTechnologyPage() {
        // Partikelsystem-Instanziierung (falls Canvas gefunden)
        const particleCanvas = document.getElementById('techParticleSystem');
        if (particleCanvas) {
            initializeParticleSystem(particleCanvas);
        }
        
        // Scroll-Enthüllungssystem mit bidirektionaler Unterstützung
        initializeRevealOnScroll();
        
        // Animierte Divider neu initialisieren bei Sichtbarkeit
        initializeDividerAnimations();
        
        // Technologie-Prozessanimationen
        initializeProcessAnimations();
        
        // Dynamische Materialmuster-Interaktionen
        initializeMaterialSamples();
        
        // Event-Delegation für globale Handler
        document.addEventListener('scroll', handleGlobalScroll, { passive: true });
        window.addEventListener('resize', debounce(handleResize, 150));
        
        // Setze initiale Viewport-Höhe
        setVhVariable();
        
        // Debug-Bestätigung bei Entwicklung
        console.debug('Technology module initialized');
    }
    
    /**
     * Setzt die --vh CSS Variable basierend auf tatsächlicher Viewport-Höhe
     * Kritisch für konsistente mobile Darstellung
     */
    function setVhVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    /**
     * Initialisiert das technologische Partikelsystem
     * Implementiert ein Netzwerk von interconnected Partikeln mit adaptiver Verhaltensdynamik
     * @param {HTMLCanvasElement} canvas - Canvas-DOM-Element für Rendering
     */
    function initializeParticleSystem(canvas) {
        // Kontext-Acquisition mit High-DPI-Support
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Physikalische Konstanten
        const PARTICLE_COUNT = calculateOptimalParticleCount();
        const PARTICLE_SIZE_RANGE = [1, 2];
        const PARTICLE_SPEED_RANGE = [0.2, 0.6];
        const CONNECTION_DISTANCE = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--particle-connect-distance').trim()) || 120;
        const VELOCITY_FACTOR = parseFloat(getComputedStyle(document.documentElement)
            .getPropertyValue('--particle-velocity-factor').trim()) || 0.12;
        
        // Partikelsystem-Zustandsvektor
        let particles = [];
        let animationFrameId = null;
        let lastTimestamp = 0;
        
        // Initialisierungsmethode
        function initParticles() {
            // Canvas-Dimensionierung mit Pixeldichte-Korrektur
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    
                    // High-DPI-Skalierung
                    canvas.width = width * pixelRatio;
                    canvas.height = height * pixelRatio;
                    canvas.style.width = `${width}px`;
                    canvas.style.height = `${height}px`;
                    ctx.scale(pixelRatio, pixelRatio);
                    
                    // Partikel neu generieren bei signifikanter Dimensionsänderung
                    if (Math.abs(width - (particles.length > 0 ? particles[0].canvasWidth : 0)) > 50) {
                        particles = generateParticles(width, height);
                    }
                }
            });
            
            // Observer aktivieren
            resizeObserver.observe(canvas);
            
            // Initial-Population
            const rect = canvas.getBoundingClientRect();
            particles = generateParticles(rect.width, rect.height);
            
            // Animation triggern
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        
        /**
         * Berechnet die optimale Partikelanzahl basierend auf Viewport-Dimensionen und Device-Performance
         * @returns {number} Optimale Partikelanzahl
         */
        function calculateOptimalParticleCount() {
            const viewportArea = window.innerWidth * window.innerHeight;
            const baseCount = Math.floor(viewportArea / 9000);
            
            // Performance-adaptive Skalierung
            const performanceLevel = detectPerformanceLevel();
            const scaleFactor = performanceLevel === 'high' ? 1.5 : 
                              performanceLevel === 'medium' ? 1.0 : 0.6;
            
            return Math.max(15, Math.min(150, Math.floor(baseCount * scaleFactor)));
        }
        
        /**
         * Ermittelt die Performance-Kapazität des Clients
         * @returns {string} Performance-Niveau ('low', 'medium', 'high')
         */
        function detectPerformanceLevel() {
            // Heuristische Performanceevaluation
            const memory = navigator.deviceMemory || 4;
            const processor = navigator.hardwareConcurrency || 4;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (memory >= 6 && processor >= 6 && !isMobile) {
                return 'high';
            } else if (memory >= 4 && processor >= 4) {
                return 'medium';
            }
            return 'low';
        }
        
        /**
         * Generiert die initiale Partikel-Population
         * @param {number} width - Canvas-Breite
         * @param {number} height - Canvas-Höhe
         * @returns {Array} Partikel-Array mit positionalen und kinetischen Eigenschaften
         */
        function generateParticles(width, height) {
            const particles = [];
            
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const size = PARTICLE_SIZE_RANGE[0] + Math.random() * (PARTICLE_SIZE_RANGE[1] - PARTICLE_SIZE_RANGE[0]);
                const speed = PARTICLE_SPEED_RANGE[0] + Math.random() * (PARTICLE_SPEED_RANGE[1] - PARTICLE_SPEED_RANGE[0]);
                const directionAngle = Math.random() * Math.PI * 2;
                
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: size,
                    speed: speed * VELOCITY_FACTOR,
                    vx: Math.cos(directionAngle) * speed * VELOCITY_FACTOR,
                    vy: Math.sin(directionAngle) * speed * VELOCITY_FACTOR,
                    canvasWidth: width,
                    canvasHeight: height,
                    // Technologie-spezifische Partikelattribute
                    connectionProbability: Math.random(),
                    hue: 210 + Math.random() * 30 // Bläulich-technologische Farbpalette
                });
            }
            
            return particles;
        }
        
        /**
         * Animationsschleife für Partikelsimulation
         * @param {DOMHighResTimeStamp} timestamp - Aktueller Zeitstempel für Frame-Berechnung
         */
        function animateParticles(timestamp) {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // Anti-janking Protection: Delta-Zeiten begrenzen
            const safeDelta = Math.min(deltaTime, 30);
            
            // Kontext löschen
            ctx.clearRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
            
            // Particles update & render
            updateAndRenderParticles(safeDelta);
            
            // Rekursive Animation
            animationFrameId = requestAnimationFrame(animateParticles);
        }
        
        /**
         * Aktualisiert Partikelzustände und rendert sie
         * @param {number} deltaTime - Zeitdifferenz seit letztem Frame in ms
         */
        function updateAndRenderParticles(deltaTime) {
            // Phase 1: Position Updates mit Kollisionscheck
            particles.forEach(p => {
                // Positionsupdate mit Zeitnormalisierung (konstante Geschwindigkeit unabhängig von Framerate)
                p.x += p.vx * (deltaTime / 16);
                p.y += p.vy * (deltaTime / 16);
                
                // Kollisionserkennung und -reaktion mit Boundaries
                if (p.x < 0) {
                    p.x = 0;
                    p.vx *= -1;
                } else if (p.x > p.canvasWidth) {
                    p.x = p.canvasWidth;
                    p.vx *= -1;
                }
                
                if (p.y < 0) {
                    p.y = 0;
                    p.vy *= -1;
                } else if (p.y > p.canvasHeight) {
                    p.y = p.canvasHeight;
                    p.vy *= -1;
                }
            });
            
            // Phase 2: Verbindungslinien zwischen nahen Partikeln
            ctx.strokeStyle = 'rgba(192, 192, 192, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            
            // Effizientes Verbindungsrendering mit Quadratischer Optimierung
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Verbindungen nur erstellen, wenn Partikel nahe genug sind
                    if (distance < CONNECTION_DISTANCE && 
                        (p1.connectionProbability + p2.connectionProbability) > 1.0) {
                        // Opazität basierend auf Distanz
                        const opacity = 1 - (distance / CONNECTION_DISTANCE);
                        ctx.strokeStyle = `rgba(192, 192, 192, ${opacity * 0.15})`;
                        
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    }
                }
            }
            ctx.stroke();
            
            // Phase 3: Partikel-Rendering
            particles.forEach(p => {
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size
                );
                
                // Technologisch-inspirierte Farbgebung mit subtiler Variation
                gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0.8)`);
                gradient.addColorStop(1, `hsla(${p.hue}, 90%, 40%, 0)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // System initialisieren
        initParticles();
        
        // Cleanup-Hook für Ressourcenfreigabe
        return function cleanup() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }
    
    /**
     * Initialisiert das Scroll-Enthüllungssystem mit bidirektionaler Unterstützung
     * Detektiert Viewport-Eintritt von Elementen und triggert Sichtbarkeits-Transformationen
     */
    function initializeRevealOnScroll() {
        const revealElements = document.querySelectorAll('.reveal-element');
        const revealOffset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--reveal-offset').trim() || '30');
            
        // Letzter bekannter Scroll-Zustand für Richtungserkennung
        let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Speichern des Zustands für jedes Element
        const elementStates = new Map();
        
        // Initial für alle Elemente den Zustand festlegen
        revealElements.forEach(element => {
            elementStates.set(element, {
                visible: false,
                wasVisible: false
            });
        });
        
        // IntersectionObserver für hochpräzise Viewport-Erkennung
        const observer = new IntersectionObserver((entries) => {
            // Aktuelle Scroll-Position für Richtungserkennung
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollingDown = currentScrollTop > lastScrollTop;
            lastScrollTop = currentScrollTop;
            
            entries.forEach(entry => {
                const element = entry.target;
                const state = elementStates.get(element);
                
                if (entry.isIntersecting) {
                    // Element ist im Viewport - sollte sichtbar sein
                    if (!state.visible) {
                        const delay = parseFloat(element.dataset.revealDelay || 0) * 1000;
                        
                        // Verzögerte Klassen-Anwendung für gestaffelte Animation
                        setTimeout(() => {
                            element.classList.add('visible');
                            element.classList.remove('was-visible');
                            state.visible = true;
                            state.wasVisible = true;
                        }, delay);
                    }
                } else {
                    // Element ist außerhalb des Viewports
                    if (state.visible) {
                        // Nur Klasse entfernen, wenn Element vorher sichtbar war
                        element.classList.remove('visible');
                        
                        // Bei Aufwärts-Scrolling zusätzliche Klasse für bidirektionale Animation
                        if (!scrollingDown && state.wasVisible) {
                            element.classList.add('was-visible');
                        } else {
                            element.classList.remove('was-visible');
                        }
                        
                        state.visible = false;
                    }
                }
            });
        }, {
            // Optimierte Observer-Konfiguration für präzise Erkennung
            threshold: [0, 0.1, 0.2, 0.5], 
            rootMargin: '0px 0px -10% 0px' // Negativer Bottom-Margin für früheren Trigger
        });
        
        // Elemente für Beobachtung registrieren
        revealElements.forEach(element => {
            observer.observe(element);
        });
        
        // Initial-Check direkt ausführen für bereits sichtbare Elemente
        checkElementsInView();
        
        /**
         * Evaluiert zusätzlich initial die Viewport-Visibility für alle registrierten Elemente
         * Verwendet Intersection-basierte Heuristik mit Buffer-Zone
         */
        function checkElementsInView() {
            const viewportHeight = window.innerHeight;
            const buffer = viewportHeight * 0.1; // 10% Buffer-Zone
            
            revealElements.forEach(element => {
                const state = elementStates.get(element);
                if (state.visible) return;
                
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top;
                
                // Ermittlung, ob Element im erweiterten Sichtfeld ist
                if (elementTop < viewportHeight - buffer) {
                    // Verzögerung basierend auf data-Attribut
                    const delay = parseFloat(element.dataset.revealDelay || 0) * 1000;
                    
                    // Verzögerte Klassen-Anwendung für gestaffelte Animation
                    setTimeout(() => {
                        element.classList.add('visible');
                        element.classList.remove('was-visible');
                        state.visible = true;
                        state.wasVisible = true;
                    }, delay);
                }
            });
        }
        
        // Öffentliche Handler-Methode für globalen Scroll-Listener
        window.checkElementsInView = checkElementsInView;
    }
    
    /**
     * Initialisiert Animationen für die Trennlinien
     * Implementiert Verzögerungsstrategien für sequentielle Effekte
     */
    function initializeDividerAnimations() {
        const dividers = document.querySelectorAll('.chapter-divider');
        
        // Observer für Animation bei Eintritt ins Viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animation zurücksetzen und neu starten
                    const divider = entry.target;
                    const line = divider.querySelector('.divider-line');
                    
                    // Animationsreset durch DOM-Manipulation
                    if (line) {
                        // Force-Reflow-Technik für Animation-Reset
                        line.style.animation = 'none';
                        void line.offsetWidth; // Reflow erzwingen
                        line.style.animation = null; // CSS-Animation wiederherstellen
                    }
                    
                    // Observer entfernen nach erstem Trigger
                    observer.unobserve(divider);
                }
            });
        }, {
            threshold: 0.2, // 20% Sichtbarkeit für Trigger
            rootMargin: '0px 0px -100px 0px' // Negative Margin für früheren Trigger
        });
        
        // Observer für alle Divider registrieren
        dividers.forEach(divider => {
            observer.observe(divider);
        });
    }
    
    /**
     * Initialisiert Prozess-Animationen für Technologiedemonstration
     * Koordiniert komplexe Animationssequenzen mit CSS-Variablen
     */
    function initializeProcessAnimations() {
        // Konfiguration für QA-Inspection-Punktanimation
        const inspectionPoints = document.querySelectorAll('.inspection-point');
        
        // Sequenzierte Aktivierung der Inspektionspunkte
        let activePointIndex = 0;
        
        // Animation nur starten, wenn sichtbar
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // InspectionPoint-Sequenz initialisieren
                    if (inspectionPoints.length > 0) {
                        startInspectionSequence();
                    }
                    
                    // Observer deaktivieren nach Initialisierung
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -10% 0px'
        });
        
        // Beobachtung der Qualitätsinspektions-Animation starten
        const qualityInspection = document.querySelector('.quality-inspection');
        if (qualityInspection) {
            observer.observe(qualityInspection);
        }
        
        /**
         * Startet die sequentielle Animation der Inspektionspunkte
         * Implementiert einen zyklischen Iterator mit temporaler Steuerung
         */
        function startInspectionSequence() {
            // Alle Punkte deaktivieren
            inspectionPoints.forEach(point => {
                point.classList.remove('active');
            });
            
            // Initialen Punkt aktivieren
            if (inspectionPoints.length > 0) {
                inspectionPoints[0].classList.add('active');
                activePointIndex = 0;
                
                // Sequenz-Timer starten
                setInterval(activateNextPoint, 500);
            }
        }
        
        /**
         * Aktiviert den nächsten Inspektionspunkt in der Sequenz
         * Implementiert zyklische Iteration durch Punktarray
         */
        function activateNextPoint() {
            // Aktuellen Punkt deaktivieren
            if (inspectionPoints.length > 0) {
                inspectionPoints[activePointIndex].classList.remove('active');
                
                // Index zyklisch inkrementieren
                activePointIndex = (activePointIndex + 1) % inspectionPoints.length;
                
                // Neuen Punkt aktivieren
                inspectionPoints[activePointIndex].classList.add('active');
            }
        }
        
        // Weitere Prozessanimationen initialisieren
        
        // Laser-Animation Optimierung
        const laserAnimations = document.querySelectorAll('.laser-animation');
        laserAnimations.forEach(animation => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation Reset und Neustart
                        const beam = entry.target.querySelector('.laser-beam');
                        const path = entry.target.querySelector('.laser-target::before');
                        
                        if (beam) {
                            beam.style.animation = 'none';
                            void beam.offsetWidth;
                            beam.style.animation = null;
                        }
                        
                        if (path) {
                            path.style.animation = 'none';
                            void path.offsetWidth;
                            path.style.animation = null;
                        }
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(animation);
        });
        
        // NFC-Wellen Animation
        const nfcAnimations = document.querySelectorAll('.nfc-animation');
        nfcAnimations.forEach(animation => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Wellen-Reset
                        const waves = entry.target.querySelectorAll('.wave');
                        waves.forEach(wave => {
                            wave.style.animation = 'none';
                            void wave.offsetWidth;
                            wave.style.animation = null;
                        });
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(animation);
        });
        
        // Fräs-Animation
        const millingAnimations = document.querySelectorAll('.milling-animation');
        millingAnimations.forEach(animation => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation-Reset
                        const head = entry.target.querySelector('.milling-head');
                        const path = entry.target.querySelector('.milling-path');
                        
                        if (head) {
                            head.style.animation = 'none';
                            void head.offsetWidth;
                            head.style.animation = null;
                        }
                        
                        if (path) {
                            path.style.animation = 'none';
                            void path.offsetWidth;
                            path.style.animation = null;
                        }
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(animation);
        });
    }
    
    /**
     * Initialisiert interaktive Effekte für Materialmuster
     */
    function initializeMaterialSamples() {
        const materialSamples = document.querySelectorAll('.material-sample');
        
        materialSamples.forEach(sample => {
            // Hover-State-Handling mit 3D-Transformation
            sample.addEventListener('mouseenter', function() {
                this.style.transform = 'perspective(800px) rotateX(0deg) translateY(-5px) scale(1.05)';
                this.style.zIndex = '5';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
            });
            
            sample.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(800px) rotateX(10deg)';
                this.style.zIndex = '1';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });
            
            // Touch-Events für mobile Geräte
            sample.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.style.transform = 'perspective(800px) rotateX(0deg) translateY(-5px) scale(1.05)';
                this.style.zIndex = '5';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
            });
            
            sample.addEventListener('touchend', function() {
                this.style.transform = 'perspective(800px) rotateX(10deg)';
                this.style.zIndex = '1';
                this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });
        });
    }
    
    /**
     * Globaler Scroll-Event-Handler mit Debouncing
     * Koordiniert alle scroll-abhängigen Subsysteme
     */
    function handleGlobalScroll() {
        // Sichtbarkeits-Check nur ausführen, wenn Funktion verfügbar
        if (typeof window.checkElementsInView === 'function') {
            window.checkElementsInView();
        }
    }
    
    /**
     * Resize-Event-Handler
     * Koordiniert dimensionsabhängige Aktualisierungen
     */
    function handleResize() {
        // Viewport-Höhenvariable aktualisieren für konsistente mobile Darstellung
        setVhVariable();
    }
    
    /**
     * Utility-Funktion: Debounce für Event-Throttling
     * @param {Function} func - Zu debouncende Funktion
     * @param {number} wait - Wartezeit in ms
     * @returns {Function} Debounced Funktion
     */
    function debounce(func, wait) {
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
});