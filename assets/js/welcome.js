// welcome.js - Ferrum Insignia Präzise Silber-Sternenfeld-System
// Ultra-Performance Optimierung mit mathematisch exakter Silber-Farbpalette

/**
 * RelativisticStellarFieldSystem - Hochperformante Silber-Partikel-Simulation
 * Implementiert GPU-accelerated Rendering mit präzisen Argentum-Spektrallinien
 */

class RelativisticStellarFieldSystem {
    constructor() {
        this.canvas = document.getElementById('historyParticleSystem');
        if (!this.canvas) {
            console.error('Canvas element not found: historyParticleSystem');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Performance-kritische Viewport-Parameter
        this.calculateOptimalParameters();
        
        // Minimal-Memory Simulation-Parameter
        this.stars = [];
        this.time = 0;
        this.constantVelocity = 0.24; // Optimiert für 60fps+
        
        // Observer-System mit reduziertem Overhead
        this.observerPosition = { x: 0, y: 0, z: -6000 };
        
        // Präzise Silber-Spektral-Klassifikation
        this.silverStellarCatalog = this.generateSilverStellarCatalog();
        
        // Hardware-Acceleration-Detection
        this.enabledOptimizations = this.detectHardwareCapabilities();
        
        // Initialisierung mit minimaler Latenz
        this.initializeCanvas();
        this.generateOptimizedStellarField();
        this.executeRenderLoop();
    }

    // Adaptive Performance-Parameter mit Hardware-Detection
    calculateOptimalParameters() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportArea = viewportWidth * viewportHeight;
        const aspectRatio = viewportWidth / viewportHeight;
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Hardware-basierte Partikel-Skalierung
        const baseMultiplier = devicePixelRatio >= 2 ? 0.85 : 1.0;
        
        // Logarithmische Area-basierte Skalierung
        if (viewportArea >= 8294400) { // 4K+
            this.optimalParticleCount = Math.floor(6800 * baseMultiplier);
        } else if (viewportArea >= 2073600) { // 1920x1080+
            this.optimalParticleCount = Math.floor(5400 * baseMultiplier);
        } else if (viewportArea >= 1440000) { // 1600x900+
            this.optimalParticleCount = Math.floor(4800 * baseMultiplier);
        } else if (viewportArea >= 921600) { // 1280x720+
            this.optimalParticleCount = Math.floor(4200 * baseMultiplier);
        } else if (viewportArea >= 518400) { // 960x540+
            this.optimalParticleCount = Math.floor(3400 * baseMultiplier);
        } else if (viewportArea >= 307200) { // 640x480+
            this.optimalParticleCount = Math.floor(2600 * baseMultiplier);
        } else {
            this.optimalParticleCount = Math.floor(1900 * baseMultiplier);
        }
        
        // Mobile-spezifische Reduktion für konstante 60fps
        if (viewportWidth <= 768) {
            this.optimalParticleCount = Math.floor(this.optimalParticleCount * 0.72);
        }
        if (viewportWidth <= 480) {
            this.optimalParticleCount = Math.floor(this.optimalParticleCount * 0.58);
        }
        
        console.log(`Optimized Viewport: ${viewportWidth}x${viewportHeight}, Silver Particles: ${this.optimalParticleCount}`);
    }

    // Hardware-Capability-Detection für GPU-Optimierungen
    detectHardwareCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        const capabilities = {
            webgl: !!gl,
            highDPI: window.devicePixelRatio >= 2,
            modernBrowser: 'requestIdleCallback' in window,
            performanceAPI: 'performance' in window && 'now' in window.performance,
            offscreenCanvas: 'OffscreenCanvas' in window
        };
        
        // WebGL-spezifische Optimierungen
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                capabilities.gpuAccelerated = !renderer.toLowerCase().includes('software');
            }
        }
        
        return capabilities;
    }

    initializeCanvas() {
        // Direkte Canvas-Dimensionierung für minimale Latenz
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width * 0.5;
        this.centerY = this.canvas.height * 0.5;
        this.focalLength = 850; // Optimiert für Silber-Partikel-Visibility
        
        // GPU-Layer-Promotion
        this.ctx.globalCompositeOperation = 'screen';
        
        // Event-Handler mit Debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleCanvasResize();
                this.calculateOptimalParameters();
                this.regenerateStellarField();
            }, 150);
        });
    }
    
    handleCanvasResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width * 0.5;
        this.centerY = this.canvas.height * 0.5;
    }

    // Mathematisch präzise Silber-Spektral-Klassifikation
    generateSilverStellarCatalog() {
        return {
            'O': { 
                temp: 35000, 
                color: [235, 240, 245], // Brillantes Platin-Silber
                luminosity: 90000,
                variabilityRange: [0.015, 0.06],
                temperatureVariability: 800,
                abundance: 0.00003
            },
            'B': { 
                temp: 22000, 
                color: [220, 230, 240], // Helles Sterlingsilber
                luminosity: 15000,
                variabilityRange: [0.012, 0.05],
                temperatureVariability: 600,
                abundance: 0.0013
            },
            'A': { 
                temp: 8500, 
                color: [205, 220, 235], // Klassisches Silber
                luminosity: 54,
                variabilityRange: [0.008, 0.035],
                temperatureVariability: 500,
                abundance: 0.006
            },
            'F': { 
                temp: 6800, 
                color: [190, 210, 230], // Perlen-Silber
                luminosity: 4.2,
                variabilityRange: [0.006, 0.025],
                temperatureVariability: 400,
                abundance: 0.03
            },
            'G': { 
                temp: 5800, 
                color: [175, 200, 225], // Mondschein-Silber
                luminosity: 1.3,
                variabilityRange: [0.004, 0.018],
                temperatureVariability: 300,
                abundance: 0.076
            },
            'K': { 
                temp: 4300, 
                color: [160, 185, 210], // Gedämpftes Silber
                luminosity: 0.4,
                variabilityRange: [0.003, 0.012],
                temperatureVariability: 250,
                abundance: 0.121
            },
            'M': { 
                temp: 3200, 
                color: [145, 170, 195], // Antikes Silber
                luminosity: 0.04,
                variabilityRange: [0.002, 0.008],
                temperatureVariability: 200,
                abundance: 0.765
            }
        };
    }

    // Optimierte Masse-Klassifikation mit reduziertem Overhead
    classifyByMass(mass) {
        if (mass >= 16) return 'O';
        if (mass >= 2.1) return 'B'; 
        if (mass >= 1.4) return 'A';
        if (mass >= 1.04) return 'F';
        if (mass >= 0.8) return 'G';
        if (mass >= 0.45) return 'K';
        return 'M';
    }

    // Performance-optimierte Salpeter IMF
    salpeterIMF() {
        const ξ = Math.random();
        // Pre-computed constants für Performance
        return 0.08 * Math.pow((Math.pow(1500, -1.35) - 1) * ξ + 1, -0.7407407);
    }

    // Ultra-Performance Exponential-Distribution
    generateExponentialDistribution() {
        return -2.2 * Math.log(Math.random());
    }

    // Optimierte Gaussian-Distribution
    generateGaussianHeight() {
        // Box-Muller mit Performance-Optimierung
        const u = Math.random();
        const v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(6.283185307179586 * v) * 0.25;
    }

    // Ultra-Performance Stellar-Field-Generation
    generateOptimizedStellarField() {
        const stellarDensity = this.optimalParticleCount;
        const galacticRadius = 9500;
        
        // Pre-allocate array für Memory-Efficiency
        this.stars = new Array(stellarDensity);
        
        for (let i = 0; i < stellarDensity; i++) {
            // 3D Galactic-Koordinaten mit optimierter Distribution
            const r = this.generateExponentialDistribution() * galacticRadius;
            const θ = Math.random() * 6.283185307179586; // 2π
            const φ = this.generateGaussianHeight() * 0.25132741228718345; // π/8
            
            // Cartesian-Transformation
            const cosφ = Math.cos(φ);
            const x = r * Math.cos(θ) * cosφ;
            const y = r * Math.sin(θ) * cosφ;  
            
            // Z-Distribution für optimale initiale Visibility
            let z;
            if (Math.random() < 0.65) {
                z = 120 + Math.random() * 1880; // Front-layer für sofortige Sichtbarkeit
            } else {
                z = r * Math.sin(φ);
            }
            
            // Stellar-Mass via Salpeter IMF
            const stellarMass = this.salpeterIMF();
            const spectralClass = this.classifyByMass(stellarMass);
            const stellarData = this.silverStellarCatalog[spectralClass];
            
            // Distance-based Magnitude
            const distance = Math.sqrt(x*x + y*y + z*z);
            const visualSize = Math.max(0.4, Math.min(2.8, 900 / distance));
            
            // Variability-Parameter
            const [minVar, maxVar] = stellarData.variabilityRange;
            const variabilityAmplitude = minVar + Math.random() * (maxVar - minVar);
            
            this.stars[i] = {
                // Spatial-Koordinaten
                x: x, y: y, z: z,
                initialZ: z,
                
                // Physical-Properties
                mass: stellarMass,
                spectralClass: spectralClass,
                temperature: stellarData.temp,
                color: [...stellarData.color],
                
                // Visual-Properties
                visualSize: visualSize,
                
                // Kinematic-Properties
                properMotion: {
                    x: (Math.random() - 0.5) * 0.0014,
                    y: (Math.random() - 0.5) * 0.0014,
                    z: (Math.random() - 0.5) * 0.0007
                },
                
                // Variability-System
                variabilityAmplitude: variabilityAmplitude,
                variabilityPeriod: 6 + Math.random() * 38,
                phase: Math.random() * 6.283185307179586,
                secondaryPhase: Math.random() * 6.283185307179586,
                
                // Temperature-Variability
                temperatureVariability: stellarData.temperatureVariability,
                temperaturePhase: Math.random() * 6.283185307179586,
                
                // Pulsation-Parameters
                pulsationAmplitude: Math.random() * 0.025 + 0.008,
                pulsationFrequency: 0.08 + Math.random() * 0.28,
                
                // Runtime-Properties
                relativeBrightness: 1.0,
                currentTemperature: stellarData.temp,
                atmosphericFlicker: Math.random() * 0.015 + 0.005
            };
        }
    }

    // Dynamic Field-Regeneration
    regenerateStellarField() {
        this.generateOptimizedStellarField();
    }

    // Ultra-Performance Silber-Color-Conversion
    silverTemperatureToColor(temperature, baseColor) {
        // Direkter Silber-Spektral-Mapping ohne komplexe Berechnungen
        const [baseR, baseG, baseB] = baseColor;
        
        // Temperature-basierte Silber-Modulation
        let tempFactor = 1.0;
        if (temperature > 8000) {
            tempFactor = 1.15; // Brillanteres Silber für heiße Sterne
        } else if (temperature < 4000) {
            tempFactor = 0.88; // Gedämpfteres Silber für kalte Sterne
        }
        
        // Silber-Spektrum mit Blau-Bias für Authentizität
        const r = Math.min(255, baseR * tempFactor);
        const g = Math.min(255, baseG * tempFactor * 1.05);
        const b = Math.min(255, baseB * tempFactor * 1.12);
        
        return [r, g, b];
    }

    // Ultra-Performance Kinematic-Update
    updateStellarKinematics() {
        this.time += 0.016667; // Exact 60fps timing
        
        const frameVelocity = this.constantVelocity;
        this.observerPosition.z += frameVelocity;
        
        // Batch-Processing für Array-Performance
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            
            // Primary Motion
            star.z -= frameVelocity;
            
            // Proper Motion
            star.x += star.properMotion.x;
            star.y += star.properMotion.y;
            star.z += star.properMotion.z;
            
            // Perspective-Velocity-Modifikation
            const centerDistance = Math.sqrt(star.x*star.x + star.y*star.y);
            const perspectiveFactor = 1.0 / (1.0 + centerDistance * 0.0000008);
            star.z -= frameVelocity * perspectiveFactor * 0.25;
            
            // Optimierte Variability-Computation
            const primaryPhase = this.time / star.variabilityPeriod + star.phase;
            const secondaryPhase = this.time / (star.variabilityPeriod * 1.618) + star.secondaryPhase;
            
            // Multi-frequency Brightness-Modulation
            const primaryBrightness = Math.sin(primaryPhase) * star.variabilityAmplitude;
            const secondaryBrightness = Math.sin(secondaryPhase) * (star.variabilityAmplitude * 0.35);
            const pulsationBrightness = Math.sin(this.time * star.pulsationFrequency) * star.pulsationAmplitude;
            
            star.relativeBrightness = 1.0 + primaryBrightness + secondaryBrightness + pulsationBrightness;
            
            // Temperature-Variability für Silber-Color-Shifting
            const temperaturePhase = this.time / (star.variabilityPeriod * 2.2) + star.temperaturePhase;
            const temperatureOffset = Math.sin(temperaturePhase) * star.temperatureVariability;
            star.currentTemperature = star.temperature + temperatureOffset;
            
            // Atmospheric-Flicker
            star.atmosphericFlicker = 0.015 + Math.sin(this.time * (3.8 + Math.random() * 1.4)) * 0.008;
            
            // Stellar-Regeneration
            if (star.z < -80) {
                star.z = star.initialZ + 4800 + Math.random() * 2800;
                star.x = (Math.random() - 0.5) * 7800;
                star.y = (Math.random() - 0.5) * 7800;
            }
        }
    }

    // Ultra-Performance Silber-Rendering-Pipeline
    renderStellarField() {
        // Hardware-accelerated Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Frustum-Culling mit Z-Sorting
        const visibleStars = [];
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            if (star.z > 0.2) {
                visibleStars.push(star);
            }
        }
        
        // Z-depth Sort (optimiert)
        visibleStars.sort((a, b) => b.z - a.z);
        
        // Batch-Render für optimale Performance
        for (let i = 0; i < visibleStars.length; i++) {
            const star = visibleStars[i];
            
            // 3D→2D Projection mit optimierter Division
            const zInverse = this.focalLength / star.z;
            const projectedX = this.centerX + star.x * zInverse;
            const projectedY = this.centerY + star.y * zInverse;
            
            // Viewport-Boundary-Check
            if (projectedX >= -80 && projectedX <= this.canvas.width + 80 &&
                projectedY >= -80 && projectedY <= this.canvas.height + 80) {
                
                // Distance-Scaling mit zentripetaler Eleganz-Modulation
                const distanceScale = Math.max(0.12, Math.min(1.9, 1100 / star.z));
                
                // Zentripetaler Eleganz-Faktor für optimale Zentral-Partikel-Reduktion
                const centerDistanceX = projectedX - this.centerX;
                const centerDistanceY = projectedY - this.centerY;
                const centerDistance = Math.sqrt(centerDistanceX * centerDistanceX + centerDistanceY * centerDistanceY);
                const viewportRadius = Math.sqrt(this.canvas.width * this.canvas.width + this.canvas.height * this.canvas.height) * 0.5;
                const centerProximityRatio = Math.min(1.0, centerDistance / (viewportRadius * 0.6));
                
                // Zentripetale Größen-Reduktion: Partikel werden zum Zentrum hin eleganter
                const centralEleganceFactor = 0.65 + (centerProximityRatio * 0.35);
                const renderSize = star.visualSize * distanceScale * centralEleganceFactor;
                
                // Silber-Color-Processing
                const dynamicSilverColor = this.silverTemperatureToColor(star.currentTemperature, star.color);
                const [r, g, b] = dynamicSilverColor;
                
                // Luminosity mit Multi-layered Brightness
                const luminosityFactor = star.relativeBrightness * distanceScale;
                const baseAlpha = Math.min(0.78, luminosityFactor * 0.65);
                const flickerAlpha = baseAlpha * (1 + star.atmosphericFlicker);
                
                // Primary Silber-Atmosphere
                const atmosphereGradient = this.ctx.createRadialGradient(
                    projectedX, projectedY, 0,
                    projectedX, projectedY, renderSize * 3.8
                );
                
                atmosphereGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${flickerAlpha})`);
                atmosphereGradient.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.45})`);
                atmosphereGradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.18})`);
                atmosphereGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                
                // Render Primary Atmosphere
                this.ctx.fillStyle = atmosphereGradient;
                this.ctx.beginPath();
                this.ctx.arc(projectedX, projectedY, renderSize * 3.8, 0, 6.283185307179586);
                this.ctx.fill();
                
                // Silber-Core
                const coreAlpha = flickerAlpha * 1.25;
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, coreAlpha)})`;
                this.ctx.beginPath();
                this.ctx.arc(projectedX, projectedY, renderSize * 0.75, 0, 6.283185307179586);
                this.ctx.fill();
                
                // Enhanced Silber-Highlight für Glänzen
                if (star.relativeBrightness > 1.015) {
                    const highlightAlpha = (star.relativeBrightness - 1) * 0.85;
                    const highlightGradient = this.ctx.createRadialGradient(
                        projectedX, projectedY, 0,
                        projectedX, projectedY, renderSize * 1.15
                    );
                    
                    // Silber-Highlight mit Platin-Akzent
                    highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightAlpha * 0.35})`);
                    highlightGradient.addColorStop(0.35, `rgba(${r+15}, ${g+15}, ${b+15}, ${highlightAlpha * 0.18})`);
                    highlightGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                    
                    this.ctx.fillStyle = highlightGradient;
                    this.ctx.beginPath();
                    this.ctx.arc(projectedX, projectedY, renderSize * 1.15, 0, 6.283185307179586);
                    this.ctx.fill();
                }
            }
        }
    }

    // Haupt-Execution-Loop mit 60fps-Garantie
    executeRenderLoop() {
        this.updateStellarKinematics();
        this.renderStellarField();
        requestAnimationFrame(() => this.executeRenderLoop());
    }
    
    // Resource-Cleanup
    destroy() {
        this.stars = null;
    }
}

/**
 * MetallicMaterialSimulator - UI-Interactions
 * Performance-optimiert für flüssige Responsivität
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
            logoFerrum.setAttribute('data-text', 'FERRUM');
            logoInsignia.setAttribute('data-text', 'INSIGNIA');
        }
    }
    
    initializeButton() {
        const ctaButton = document.getElementById('enterButton');
        
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.initiateTransition();
            });
            
            // Haptic-Feedback
            ctaButton.addEventListener('mousedown', () => {
                ctaButton.style.transform = 'translateY(0)';
            });
            
            ctaButton.addEventListener('mouseup', () => {
                ctaButton.style.transform = 'translateY(-2px)';
            });
            
            // Keyboard-Accessibility
            ctaButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.initiateTransition();
                }
            });
        }
    }
    
    initializeFeatures() {
        const featureNodes = document.querySelectorAll('.feature-node');
        
        featureNodes.forEach((node, index) => {
            node.style.animationDelay = `${1.5 + (index * 0.18)}s`;
            
            // Magnetic-Hover mit Performance-Optimierung
            let animationId;
            node.addEventListener('mousemove', (e) => {
                if (animationId) return;
                
                animationId = requestAnimationFrame(() => {
                    const rect = node.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width * 0.5;
                    const y = e.clientY - rect.top - rect.height * 0.5;
                    
                    const angle = Math.atan2(y, x);
                    const distance = Math.min(Math.sqrt(x * x + y * y) / (rect.width * 0.5), 1);
                    
                    node.style.transform = `
                        translate(${Math.cos(angle) * distance * 4}px, 
                                 ${Math.sin(angle) * distance * 4}px)
                        scale(${1 + distance * 0.04})
                    `;
                    animationId = null;
                });
            });
            
            node.addEventListener('mouseleave', () => {
                node.style.transform = '';
            });
        });
    }
    
    // Ultra-Performance Transition
    initiateTransition() {
        const container = document.querySelector('.quantum-container');
        
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'scale(0.985) translateY(-15px)';
            container.style.transition = 'all 0.75s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        // Silber-Flash-Effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, 
                rgba(235,240,245,0) 0%, 
                rgba(220,230,240,0.25) 50%, 
                rgba(235,240,245,0) 100%);
            opacity: 0;
            pointer-events: none;
            z-index: 10000;
            animation: silverFlash 0.75s ease-out;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 750);
    }
}

// System-Initialization mit Error-Recovery
document.addEventListener('DOMContentLoaded', () => {
    try {
        const stellarFieldSystem = new RelativisticStellarFieldSystem();
        const materialSimulator = new MetallicMaterialSimulator();
        
        // Performance-Monitoring
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark('silver-stellar-field-init-complete');
        }
        
        // Cleanup
        window.addEventListener('beforeunload', () => {
            if (stellarFieldSystem) stellarFieldSystem.destroy();
        });
        
    } catch (error) {
        console.error('Silver Stellar Field System Error:', error);
    }
});

// Inject Silver-Flash-Animation
const silverStyles = document.createElement('style');
silverStyles.textContent = `
    @keyframes silverFlash {
        0% { opacity: 0; transform: translateX(-100%); }
        50% { opacity: 1; }
        100% { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(silverStyles);