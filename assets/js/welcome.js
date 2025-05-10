// welcome.js - Ferrum Insignia Quantum Animation Engine

/**
 * Optimized History Particle System - implementiert konsistent mit ferrum-history.js
 * Simuliert elegante, langsamere Partikelbewegungen mit physikalisch-basiertem Verhalten
 */

class HistoryParticleSystem {
    constructor() {
        this.canvas = document.getElementById('historyParticleSystem');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.time = 0;
        this.rafId = null;
        
        // Geschwindigkeitsfaktor aus CSS-Variable mit Fallback-Wert (reduziert)
        this.particleVelocityFactor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--particle-velocity-factor')) || 0.045;
        
        // Optimierte Konfigurationsparameter mit reduzierten Geschwindigkeiten
        this.config = {
            particleCount: null, // Dynamisch basierend auf Canvas-Dimensionen
            particleSizeMin: 0.6,
            particleSizeMax: 1.8,
            particleOpacityMin: 0.12,
            particleOpacityMax: 0.6,
            mouseInteractionRadius: 180,
            mouseForceMultiplier: 0.008, // Reduziert für sanftere Interaktion
            connectionDistance: 140,
            connectionOpacityFactor: 0.08,
            oscillationAmplitude: 0.08, // Reduziert für sanftere Bewegung
            oscillationFrequency: 0.0005, // Reduziert für langsamere Oszillation
            particleDampingFactor: 0.975, // Erhöht für stärkere Dämpfung
            gradientIntensity: 0.05
        };
        
        this.initializeCanvas();
        this.bindEvents();
    }
    
    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        // Hochauflösender Canvas für schärfere Partikel
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        
        // Neuberechnung der Partikelanzahl basierend auf Viewport-Dimensionen
        // Reduzierte Partikelanzahl für bessere Performance und optische Ruhe
        this.config.particleCount = Math.floor((window.innerWidth * window.innerHeight) / 13000);
        
        // Reinitialisierung bei Größenänderung
        this.initializeParticles();
    }
    
    initializeParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: this.config.particleSizeMin + Math.random() * (this.config.particleSizeMax - this.config.particleSizeMin),
                // Reduzierte Initialgeschwindigkeit für langsamere Bewegung
                vx: (Math.random() - 0.5) * this.particleVelocityFactor * 0.5,
                vy: (Math.random() - 0.5) * this.particleVelocityFactor * 0.5,
                opacity: this.config.particleOpacityMin + Math.random() * (this.config.particleOpacityMax - this.config.particleOpacityMin),
                phase: Math.random() * Math.PI * 2,
                phaseShift: Math.random() * 0.01 - 0.005 // Reduziert für langsamere Phasenvariation
            });
        }
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        }, { passive: true });
        
        // Starten der Animation mit verzögertem Start für Übergangseffekte
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.startAnimationLoop();
            }, 200);
        });
    }
    
    updateParticles() {
        this.time++;
        
        this.particles.forEach(particle => {
            // Basisphysik mit reduzierter Geschwindigkeit
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Phasenmodifikation für natürlicheres Verhalten
            particle.phase += particle.phaseShift;
            
            // Mausinteraktion mit kontinuierlicher Abschwächung
            const dx = this.mousePosition.x - particle.x / (window.devicePixelRatio || 1);
            const dy = this.mousePosition.y - particle.y / (window.devicePixelRatio || 1);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.config.mouseInteractionRadius) {
                const force = (this.config.mouseInteractionRadius - distance) / this.config.mouseInteractionRadius;
                const angle = Math.atan2(dy, dx);
                const repulsionX = Math.cos(angle) * force * this.config.mouseForceMultiplier;
                const repulsionY = Math.sin(angle) * force * this.config.mouseForceMultiplier;
                
                // Abstoßung von der Mausposition
                particle.vx -= repulsionX;
                particle.vy -= repulsionY;
            }
            
            // Subtile oszillierende Bewegung für organisches Gefühl - reduziert
            particle.x += Math.sin(this.time * this.config.oscillationFrequency + particle.phase) * this.config.oscillationAmplitude;
            particle.y += Math.cos(this.time * this.config.oscillationFrequency + particle.phase) * this.config.oscillationAmplitude;
            
            // Physikalische Dämpfung für natürliche Bewegung - erhöht
            particle.vx *= this.config.particleDampingFactor;
            particle.vy *= this.config.particleDampingFactor;
            
            // Randlogik mit elastischem Zurückprallen
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -0.5; // Elastischer Aufprall mit Energieverlust
            } else if (particle.x > this.canvas.width / (window.devicePixelRatio || 1)) {
                particle.x = this.canvas.width / (window.devicePixelRatio || 1);
                particle.vx *= -0.5;
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy *= -0.5;
            } else if (particle.y > this.canvas.height / (window.devicePixelRatio || 1)) {
                particle.y = this.canvas.height / (window.devicePixelRatio || 1);
                particle.vy *= -0.5;
            }
        });
    }
    
    drawParticles() {
        const dpr = window.devicePixelRatio || 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Hintergrundgradient für Tiefeneffekt
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / (2 * dpr), this.canvas.height / (2 * dpr), 0,
            this.canvas.width / (2 * dpr), this.canvas.height / (2 * dpr), Math.max(this.canvas.width, this.canvas.height) / (2 * dpr)
        );
        gradient.addColorStop(0, `rgba(192, 192, 192, ${this.config.gradientIntensity * 1.2})`);
        gradient.addColorStop(0.5, `rgba(192, 192, 192, ${this.config.gradientIntensity * 0.5})`);
        gradient.addColorStop(1, `rgba(192, 192, 192, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Optimierte Verbindungen zwischen Partikeln
        this.ctx.beginPath();
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            // Verbindungen zu anderen Partikeln - Optimiert für Performance
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    
                    // Dynamische Opazität basierend auf Entfernung
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacityFactor;
                    this.ctx.strokeStyle = `rgba(192, 192, 192, ${opacity})`;
                    this.ctx.stroke();
                }
            }
        }
        
        // Zeichnen der Partikel
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(229, 228, 226, ${particle.opacity})`;
            this.ctx.fill();
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}

/**
 * Metallic Material Simulator
 * Implementiert dynamische Reflektionen und Glanzeffekte
 */
class MetallicMaterialSimulator {
    constructor() {
        this.initializeLogo();
        this.initializeButton();
        this.initializeFeatures();
    }
    
    initializeLogo() {
        const logoFerrum = document.querySelector('.logo-ferrum');
        const logoInsignia = document.querySelector('.logo-insignia');
        
        if (logoFerrum && logoInsignia) {
            // Set data attributes for shine effect
            logoFerrum.setAttribute('data-text', 'FERRUM');
            logoInsignia.setAttribute('data-text', 'INSIGNIA');
            
            // Kontinuierliche Animation durch CSS-gesteuerte Keyframes
            // Die Animation wird unabhängig von Mausbewegungen kontinuierlich ausgeführt
        }
    }
    
    initializeButton() {
        const ctaButton = document.getElementById('enterButton');
        
        if (ctaButton) {
            // Direkte Weiterleitung zur Homepage ohne Loader-Animation
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.initiateDirectTransition();
            });
            
            // Haptic feedback simulation
            ctaButton.addEventListener('mousedown', () => {
                if (ctaButton) ctaButton.style.transform = 'translateY(0)';
            });
            
            ctaButton.addEventListener('mouseup', () => {
                if (ctaButton) ctaButton.style.transform = 'translateY(-2px)';
            });
            
            // Tastaturzugänglichkeit hinzufügen
            ctaButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.initiateDirectTransition();
                }
            });
        }
    }
    
    initializeFeatures() {
        const featureNodes = document.querySelectorAll('.feature-node');
        
        featureNodes.forEach((node, index) => {
            // Staggered entrance
            node.style.animationDelay = `${1.5 + (index * 0.2)}s`;
            
            // Magnetic hover effect
            node.addEventListener('mousemove', (e) => {
                const rect = node.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const angle = Math.atan2(y, x);
                const distance = Math.min(Math.sqrt(x * x + y * y) / (rect.width / 2), 1);
                
                // Flüssigere Animation mit transform
                node.style.transform = `
                    translate(${Math.cos(angle) * distance * 5}px, 
                             ${Math.sin(angle) * distance * 5}px)
                    scale(${1 + distance * 0.05})
                `;
            });
            
            node.addEventListener('mouseleave', () => {
                // Setze die Animation zurück
                node.style.transform = '';
            });
        });
    }
    
    // Neue optimierte direkte Transition ohne Loader
    initiateDirectTransition() {
        const container = document.querySelector('.quantum-container');
        
        // Einfacher Fade-out ohne Loader
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'scale(0.98) translateY(-20px)';
            container.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        // Metallic flash effect für visuelle Kontinuität
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, 
                rgba(192,192,192,0) 0%, 
                rgba(192,192,192,0.3) 50%, 
                rgba(192,192,192,0) 100%);
            opacity: 0;
            pointer-events: none;
            z-index: 10000;
            animation: quantumFlash 0.8s ease-out;
        `;
        document.body.appendChild(flash);
        
        // Unmittelbare Weiterleitung nach minimalem Übergang
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 800);
    }
}

// Initialize Systems
document.addEventListener('DOMContentLoaded', () => {
    // Initialisierung des Partikelsystems
    const particleSystem = new HistoryParticleSystem();
    const materialSimulator = new MetallicMaterialSimulator();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (particleSystem) particleSystem.destroy();
    });
});

// Inject dynamic animations
const quantumStyles = document.createElement('style');
quantumStyles.textContent = `
    @keyframes quantumFlash {
        0% { opacity: 0; transform: translateX(-100%); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateX(100%); }
    }
    
    /* Kontinuierliche Metallic-Animation für Logo */
    @keyframes continuousMetallicShine {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
    }
`;
document.head.appendChild(quantumStyles);