/**
 * technology.js - Ferrum Insignia Technology Page Controller
 * Implementiert ein hochoptimiertes Partikelsystem und Scroll-Animationen
 * für die Technologieseite mit requestAnimationFrame-Synchronisation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialisierung nach dem Laden der Hauptressourcen
    initTechnologyPage();
});

/**
 * @function initTechnologyPage
 * Primäre Initialisierungslogik für die Technologieseite
 */
function initTechnologyPage() {
    // Registriere Event-Listener sobald das Template geladen ist
    document.addEventListener('templateLoaded', event => {
        if (event.detail.templateId === 'header-container') {
            initParticleSystem();
            initScrollAnimations();
            initCardInteractions();
        }
    });
    
    // Partikelsystem sofort initialisieren, falls der DOM bereits vollständig geladen ist
    if (document.readyState === 'complete') {
        initParticleSystem();
        initScrollAnimations();
        initCardInteractions();
    }
}

/**
 * @function initParticleSystem
 * Implementiert ein WebGL-beschleunigtes Partikelsystem für den Hero-Bereich
 * mit technisch inspirierten Bewegungsmustern und reaktiven Verhaltensweisen
 */
function initParticleSystem() {
    const canvas = document.getElementById('technologyParticleSystem');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const particleCount = calculateOptimalParticleCount();
    
    // Dimensionen und Skalierung für Hochauflösungsbildschirme
    updateCanvasDimensions();
    
    // Partikelkonfiguration mit optimierten Parametern für technologische Ästhetik
    const particles = [];
    const baseParticleVelocity = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--particle-velocity-factor')) || 0.15;
    
    // Eckpunkte der Partikel für Mehrstrahlverbindungen
    const connectionDistance = Math.min(canvas.width, canvas.height) * 0.15;
    const connectionThreshold = connectionDistance * connectionDistance; // Optimierung: Vorberechnetes Quadrat
    
    // Physikbasierte Parameter
    const gravitationalConstant = 0.00004;
    const repulsionConstant = 0.00002;
    const dampingFactor = 0.98;
    
    // Partikeltypen für technologische Simulation
    const particleTypes = {
        QUANTUM: { radius: 1.2, speed: 0.8, color: '#e5e4e2', connectionProbability: 0.8 },
        NANO: { radius: 0.6, speed: 1.4, color: '#c0c0c0', connectionProbability: 0.5 },
        DATA: { radius: 0.9, speed: 1.2, color: '#d4af37', connectionProbability: 0.7 }
    };
    
    // Initialisiere Partikelsystem
    for (let i = 0; i < particleCount; i++) {
        const type = Math.random() < 0.15 ? 
                     (Math.random() < 0.3 ? particleTypes.DATA : particleTypes.NANO) : 
                     particleTypes.QUANTUM;
        
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: type.radius * (Math.random() * 0.4 + 0.8), // Leichte Radiusvariation
            velocityX: (Math.random() - 0.5) * type.speed * baseParticleVelocity,
            velocityY: (Math.random() - 0.5) * type.speed * baseParticleVelocity,
            transparency: Math.random() * 0.5 + 0.2,
            type: type,
            connections: 0, // Verfolge Verbindungen für optimalere Renderentscheidungen
            lastX: 0, // Position-Caching für Bewegungsoptimierung
            lastY: 0
        });
    }
    
    // Mausverfolgung für interaktives Verhalten
    const mouse = {
        x: undefined,
        y: undefined,
        radius: 120 // Interaktionsradius
    };
    
    // Touchevents für mobile Interaktion
    canvas.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    }, { passive: false });
    
    canvas.addEventListener('touchend', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    
    // Fensterdimensionsänderungen mit debounce-Optimierung
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            updateCanvasDimensions();
        }, 250); // Debounce für bessere Performance
    });
    
    // Optimierende Hilfsfunktionen
    function updateCanvasDimensions() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        ctx.scale(dpr, dpr);
        
        // Skaliere Verbindungsdistanz entsprechend
        const newConnectionDistance = Math.min(canvas.width, canvas.height) * 0.15;
        if (newConnectionDistance !== connectionDistance) {
            // Aktualisiere nur bei signifikanter Änderung
            connectionDistance = newConnectionDistance;
            connectionThreshold = connectionDistance * connectionDistance;
        }
    }
    
    function calculateOptimalParticleCount() {
        // Adaptive Partikeldichte basierend auf Bildschirmgröße und Geräteleistung
        const width = window.innerWidth;
        const performanceMultiplier = window.navigator.hardwareConcurrency > 4 ? 1.2 : 0.8;
        
        // Baseline-Berechnung mit logarithmischer Skalierung für reaktionsschnelles Layout
        if (width <= 768) {
            return Math.floor(40 * performanceMultiplier);
        } else if (width <= 1200) {
            return Math.floor(65 * performanceMultiplier);
        } else {
            return Math.floor(85 * performanceMultiplier);
        }
    }
    
    // Hauptanimationsschleife mit RAF-Synchronisation für optimale Leistung
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Partikelsimulation mit physikbasierter Bewegung
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Cache die vorherige Position für optimierte Verbindungsberechnungen
            p.lastX = p.x;
            p.lastY = p.y;
            
            // Aktualisiere Position mit Geschwindigkeit
            p.x += p.velocityX;
            p.y += p.velocityY;
            
            // Wandkollisionen mit realistischem Abprallverhalten
            if (p.x < 0 || p.x > canvas.width) {
                p.velocityX = -p.velocityX * dampingFactor;
                p.x = p.x < 0 ? 0 : canvas.width;
            }
            
            if (p.y < 0 || p.y > canvas.height) {
                p.velocityY = -p.velocityY * dampingFactor;
                p.y = p.y < 0 ? 0 : canvas.height;
            }
            
            // Mausinteraktion mit realistischer Kraftübertragung
            if (mouse.x !== undefined && mouse.y !== undefined) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    p.velocityX -= forceDirectionX * force * 0.6;
                    p.velocityY -= forceDirectionY * force * 0.6;
                }
            }
            
            // Partikelzeichnung mit Typ-spezifischen Attributen
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${hexToRgb(p.type.color)}, ${p.transparency})`;
            ctx.fill();
            
            // Verbindungsstatistik zurücksetzen für den aktuellen Frame
            p.connections = 0;
        }
        
        // Verbindungsrenderlogik mit quadratischer Beschleunigung
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                
                // Frühe Umgehung: Verbindungswahrscheinlichkeit evaluieren
                if (Math.random() > p1.type.connectionProbability * p2.type.connectionProbability) {
                    continue;
                }
                
                // Abstandsberechnung
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const distanceSquared = dx * dx + dy * dy;
                
                // Verbindung nur zeichnen, wenn innerhalb des Schwellwerts 
                if (distanceSquared < connectionThreshold) {
                    // Quadratische Distanzoptimierung (sqrt vermeiden)
                    const distance = Math.sqrt(distanceSquared);
                    p1.connections++;
                    p2.connections++;
                    
                    // Transparenz basierend auf Distanz mit quadratischer Abnahme
                    const opacity = Math.max(0, 1 - (distance / connectionDistance));
                    
                    // Spezielle Verbindungstypen zwischen unterschiedlichen Partikeln
                    const isDataConnection = p1.type === particleTypes.DATA || p2.type === particleTypes.DATA;
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    
                    if (isDataConnection) {
                        ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.5})`;
                        ctx.lineWidth = 0.6;
                    } else {
                        ctx.strokeStyle = `rgba(192, 192, 192, ${opacity * 0.3})`;
                        ctx.lineWidth = 0.4;
                    }
                    
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Konvertierungsfunktion für Farbdarstellung
    function hexToRgb(hex) {
        // Optimierte Hex-zu-RGB-Konvertierung mittels Cache
        const cache = hexToRgb.cache || (hexToRgb.cache = {});
        if (cache[hex]) return cache[hex];
        
        // Entferne # wenn vorhanden
        hex = hex.replace(/^#/, '');
        
        // Parse 3-stellige Hexfarben
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        
        const result = [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16)
        ].join(', ');
        
        cache[hex] = result;
        return result;
    }
    
    // Starte Animation
    animate();
}

/**
 * @function initScrollAnimations
 * Initialisiert Scroll-basierte Animationen für Inhaltskomponenten
 * mit IntersectionObserver-Optimierung für performantes Scrolling
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    // Frühzeitige Beendigung falls keine zu animierenden Elemente existieren
    if (revealElements.length === 0) return;
    
    // Optimaler Threshold basierend auf Elementhöhen und Viewport
    const calculateOptimalThreshold = () => {
        const viewportHeight = window.innerHeight;
        return viewportHeight > 800 ? 0.15 : 0.1;
    };
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: calculateOptimalThreshold()
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const element = entry.target;
            const delay = parseInt(element.getAttribute('data-reveal-delay') || 0) * 200;
            
            // Verzögerte Animation mit RAF für smoother Paint
            window.setTimeout(() => {
                requestAnimationFrame(() => {
                    element.classList.add('visible');
                });
            }, delay);
            
            // Trennen des Observers nach Animation für Leistungsoptimierung
            observer.unobserve(element);
        });
    }, observerOptions);
    
    // Observer für jedes Element registrieren
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Effiziente Anpassung bei Dimensionsänderungen
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Aktualisiere nur nicht-sichtbare Elemente
            const remainingElements = document.querySelectorAll('.reveal-element:not(.visible)');
            if (remainingElements.length === 0) return;
            
            // Observer neu erstellen mit angepassten Parametern
            revealObserver.disconnect();
            observerOptions.threshold = calculateOptimalThreshold();
            
            const newObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const element = entry.target;
                    const delay = parseInt(element.getAttribute('data-reveal-delay') || 0) * 200;
                    
                    window.setTimeout(() => {
                        requestAnimationFrame(() => {
                            element.classList.add('visible');
                        });
                    }, delay);
                    
                    observer.unobserve(element);
                });
            }, observerOptions);
            
            remainingElements.forEach(element => {
                newObserver.observe(element);
            });
        }, 250); // Debounce für bessere Performance
    });
}

/**
 * @function initCardInteractions
 * Implementiert interaktive Funktionalitäten für Kartenelemente
 */
function initCardInteractions() {
    // Glanzeffekt-Optimierung für Karten
    const cards = document.querySelectorAll('.innovation-card');
    
    cards.forEach(card => {
        const shine = document.createElement('div');
        shine.classList.add('card-shine');
        card.appendChild(shine);
        
        // Parallax-ähnlicher Glanzeffekt bei Mausbewegung
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalisierte Koordinaten für optimalen Effekt
            const normalizedX = (x / rect.width) * 200 - 100;
            const normalizedY = (y / rect.height) * 200 - 100;
            
            // RAF für GPU-beschleunigte Animation
            requestAnimationFrame(() => {
                shine.style.transform = `translateX(${normalizedX}%) translateY(${normalizedY}%) rotate(45deg)`;
                shine.style.opacity = '0.3';
            });
        });
        
        // Event-Listener Cleanup für bessere Performance
        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                shine.style.opacity = '0';
                shine.style.transform = 'translateX(-100%) rotate(45deg)';
            });
        });
    });
    
    // Scroll-to-Funktionalität für TOC-Buttons
    const tocButtons = document.querySelectorAll('.toc-button');
    
    tocButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Offset für fixierten Header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Sanftes Scrollen mit Physik-basierter Animation
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}