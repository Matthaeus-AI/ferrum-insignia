// welcome.js - Ferrum Insignia Enhanced Animation Engine
// Mathematical Precision Animation Pipeline: Normal → Hover → Departure States
// Exponential Departure-Sequence with CSS-Synchronized State-Machine

/**
 * StellarParticleEngine - GPU-Accelerated Monochrome Silver Particle System
 * Implements 3-State Animation Pipeline with Mathematical Precision
 * States: NORMAL → HOVER_ACCELERATION → DEPARTURE_WARP
 */
class StellarParticleEngine {
    constructor() {
        this.canvas = document.getElementById('historyParticleSystem');
        if (!this.canvas) {
            console.error('CRITICAL: Canvas #historyParticleSystem not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Animation State Machine - Simplified 3-State Architecture
        this.animationState = 'normal'; // 'normal', 'hover', 'departure'
        this.stateTransitionInProgress = false;
        
        // Performance-Critical Viewport Parameters
        this.calculateResponsiveParameters();
        
        // Exponential Velocity System - Mathematical Precision Control
        this.baseVelocity = 0.24;                    // Standard particle velocity
        this.currentVelocity = this.baseVelocity;    // Real-time velocity
        this.targetVelocity = this.baseVelocity;     // Target for smooth interpolation
        this.velocityLerpFactor = 0.08;              // Smooth interpolation coefficient
        
        // Hover Animation Parameters
        this.hoverVelocityMultiplier = 2.4;          // Hover acceleration factor
        this.hoverTransitionDuration = 300;          // ms - Smooth hover transition
        
        // Departure Animation Parameters - Exponential Algorithm
        this.departureStartTime = 0;
        this.departureDuration = 1400;               // ms - Total departure animation
        this.maxDepartureMultiplier = 9.2;           // Maximum velocity multiplier
        this.departureExponent = 2.6;                // Exponential curve steepness
        
        // Particle System Core
        this.particles = [];
        this.time = 0;
        this.animationFrameId = null;
        
        // Observer Position for 3D Projection
        this.observer = { x: 0, y: 0, z: -5500 };
        this.focalLength = 850;
        
        // Silver Spectral Classification System
        this.silverSpectrum = this.generateSilverSpectrum();
        
        // Hardware Capability Detection
        this.hardwareCapability = this.detectHardwareCapability();
        
        // Initialize System
        this.initializeCanvas();
        this.generateParticleField();
        this.startRenderLoop();
        
        // Navigation Integration
        this.setupNavigationIntegration();
    }
    
    /**
     * Responsive Parameter Calculation - Viewport-Adaptive Density Algorithm
     * Implements logarithmic scaling with hardware detection multipliers
     */
    calculateResponsiveParameters() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            area: window.innerWidth * window.innerHeight,
            ratio: window.innerWidth / window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };
        
        // Hardware-Based Scaling Factors
        const webglBonus = this.detectWebGL() ? 1.15 : 1.0;
        const highDPIBonus = viewport.pixelRatio >= 2 ? 1.1 : 1.0;
        const finalMultiplier = webglBonus * highDPIBonus;
        
        // Logarithmic Density Mapping - Viewport Area → Particle Count
        let baseDensity;
        if (viewport.area >= 8294400) {        // 4K+ (3840×2160+)
            baseDensity = 6800;
        } else if (viewport.area >= 2073600) { // Full-HD+ (1920×1080+)
            baseDensity = 5400;
        } else if (viewport.area >= 1440000) { // HD+ (1600×900+)
            baseDensity = 4800;
        } else if (viewport.area >= 921600) {  // HD (1280×720+)
            baseDensity = 4200;
        } else if (viewport.area >= 518400) {  // Tablet (960×540+)
            baseDensity = 3400;
        } else if (viewport.area >= 307200) {  // Mobile-L (640×480+)
            baseDensity = 2600;
        } else {                               // Mobile-S (<640×480)
            baseDensity = 2000;
        }
        
        // Mobile Performance Optimization
        if (viewport.width <= 768) baseDensity *= 0.85;
        if (viewport.width <= 480) baseDensity *= 0.75;
        
        this.optimalParticleCount = Math.floor(baseDensity * finalMultiplier);
        this.viewport = viewport;
        
        console.log(`Viewport: ${viewport.width}×${viewport.height} | Particles: ${this.optimalParticleCount}`);
    }
    
    /**
     * WebGL Capability Detection for Hardware Acceleration
     */
    detectWebGL() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }
    
    /**
     * Hardware Capability Assessment for Performance Optimization
     */
    detectHardwareCapability() {
        return {
            webgl: this.detectWebGL(),
            highDPI: window.devicePixelRatio >= 2,
            modernBrowser: 'requestIdleCallback' in window,
            performanceAPI: 'performance' in window && 'now' in window.performance,
            memoryEstimate: navigator.deviceMemory || 4
        };
    }
    
    /**
     * Canvas Initialization with GPU Layer Promotion
     */
    initializeCanvas() {
        this.resizeCanvas();
        
        // GPU Composite Operation for Additive Blending
        this.ctx.globalCompositeOperation = 'screen';
        
        // Debounced Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateResponsiveParameters();
                this.resizeCanvas();
                this.regenerateParticleField();
            }, 150);
        }, { passive: true });
    }
    
    /**
     * Responsive Canvas Resize Handler
     */
    resizeCanvas() {
        const { width, height } = this.viewport;
        this.canvas.width = width;
        this.canvas.height = height;
        this.centerX = width * 0.5;
        this.centerY = height * 0.5;
    }
    
    /**
     * Monochrome Silver Spectral Classification System
     * Eliminates non-silver wavelengths for pure argentum-based rendering
     */
    generateSilverSpectrum() {
        return {
            'O': { 
                temp: 35000, 
                silverRGB: [248, 248, 248], // Ultra-brilliant silver (8500K equivalent)
                intensity: 0.98,
                variability: [0.015, 0.060]
            },
            'B': { 
                temp: 22000, 
                silverRGB: [240, 240, 240], // High-brilliant silver (7800K equivalent)
                intensity: 0.95,
                variability: [0.012, 0.050]
            },
            'A': { 
                temp: 8500, 
                silverRGB: [230, 230, 230], // Sterling silver (7500K equivalent)
                intensity: 0.92,
                variability: [0.010, 0.040]
            },
            'F': { 
                temp: 6800, 
                silverRGB: [220, 220, 220], // Warm silver (6500K equivalent)
                intensity: 0.88,
                variability: [0.008, 0.030]
            },
            'G': { 
                temp: 5800, 
                silverRGB: [210, 210, 210], // Standard silver (5500K equivalent)
                intensity: 0.85,
                variability: [0.006, 0.025]
            },
            'K': { 
                temp: 4300, 
                silverRGB: [200, 200, 200], // Cool silver (4500K equivalent)
                intensity: 0.82,
                variability: [0.004, 0.020]
            },
            'M': { 
                temp: 3200, 
                silverRGB: [190, 190, 190], // Dark silver (4000K equivalent)
                intensity: 0.78,
                variability: [0.002, 0.015]
            }
        };
    }
    
    /**
     * Stellar Mass Classification via Salpeter Initial Mass Function
     */
    classifyByMass(mass) {
        if (mass >= 16) return 'O';
        if (mass >= 2.1) return 'B'; 
        if (mass >= 1.4) return 'A';
        if (mass >= 1.04) return 'F';
        if (mass >= 0.8) return 'G';
        if (mass >= 0.45) return 'K';
        return 'M';
    }
    
    /**
     * Salpeter IMF Implementation - Optimized Power Law Distribution
     */
    salpeterIMF() {
        const ξ = Math.random();
        return 0.08 * Math.pow((6.75e-5 - 1) * ξ + 1, -0.7407407);
    }
    
    /**
     * Performance-Optimized Particle Field Generation
     * Memory pre-allocation for array performance optimization
     */
    generateParticleField() {
        const particleCount = this.optimalParticleCount;
        const galacticRadius = 8500;
        
        // Pre-allocate array for memory efficiency
        this.particles = new Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            // 3D Galactic coordinate distribution
            const r = -2.2 * Math.log(Math.random()) * galacticRadius;
            const θ = Math.random() * 6.283185307179586; // 2π
            const φ = this.generateGaussianHeight() * 0.25132741228718345; // π/8
            
            // Cartesian transformation
            const cosφ = Math.cos(φ);
            const x = r * Math.cos(θ) * cosφ;
            const y = r * Math.sin(θ) * cosφ;
            
            // Z-distribution for optimal visibility
            let z;
            if (Math.random() < 0.75) {
                z = 150 + Math.random() * 1800; // Front layer for immediate visibility
            } else {
                z = r * Math.sin(φ);
            }
            
            // Stellar classification
            const stellarMass = this.salpeterIMF();
            const spectralClass = this.classifyByMass(stellarMass);
            const stellarData = this.silverSpectrum[spectralClass];
            
            // Visual properties calculation
            const distance = Math.sqrt(x*x + y*y + z*z);
            const baseMagnitude = 1000 / distance;
            const visualSize = Math.max(0.4, Math.min(2.6, baseMagnitude * stellarData.intensity));
            
            // Variability parameters
            const [minVar, maxVar] = stellarData.variability;
            const variabilityAmplitude = minVar + Math.random() * (maxVar - minVar);
            
            this.particles[i] = {
                // Spatial coordinates
                x, y, z,
                initialZ: z,
                
                // Physical properties
                mass: stellarMass,
                spectralClass,
                temperature: stellarData.temp,
                silverRGB: [...stellarData.silverRGB],
                intensity: stellarData.intensity,
                
                // Visual properties
                visualSize,
                baseVisualSize: visualSize,
                
                // Motion parameters
                properMotion: {
                    x: (Math.random() - 0.5) * 0.0014,
                    y: (Math.random() - 0.5) * 0.0014,
                    z: (Math.random() - 0.5) * 0.0007
                },
                
                // Variability system for silver shimmer
                variabilityAmplitude,
                variabilityPeriod: 6 + Math.random() * 32,
                phase: Math.random() * 6.283185307179586,
                
                // Runtime properties
                brightness: 1.0,
                atmosphericFlicker: Math.random() * 0.012 + 0.004
            };
        }
    }
    
    /**
     * Gaussian Distribution Generator for Galactic Height
     */
    generateGaussianHeight() {
        const u = Math.random();
        const v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(6.283185307179586 * v) * 0.25;
    }
    
    /**
     * Dynamic Field Regeneration for Resize Events
     */
    regenerateParticleField() {
        this.generateParticleField();
    }
    
    /**
     * HOVER ANIMATION SYSTEM
     * Smooth velocity interpolation for button hover events
     */
    initiateHoverAcceleration() {
        if (this.animationState === 'departure') return; // Prevent interference
        
        console.log('HOVER-ACCELERATION: Initiating particle acceleration...');
        this.animationState = 'hover';
        this.targetVelocity = this.baseVelocity * this.hoverVelocityMultiplier;
    }
    
    /**
     * Hover Animation Termination
     */
    terminateHoverAcceleration() {
        if (this.animationState === 'departure') return; // Prevent interference
        
        console.log('HOVER-DECELERATION: Returning to normal velocity...');
        this.animationState = 'normal';
        this.targetVelocity = this.baseVelocity;
    }
    
    /**
     * DEPARTURE ANIMATION SYSTEM
     * Exponential acceleration curve for warp-speed navigation
     */
    initiateDepartureSequence() {
        if (this.animationState === 'departure') return; // Prevent double-triggering
        
        console.log('DEPARTURE-SEQUENCE: Initiating warp-speed animation...');
        this.animationState = 'departure';
        this.departureStartTime = performance.now();
        this.stateTransitionInProgress = true;
        
        // Coordinate with CSS animations
        this.triggerCSSAnimations();
    }
    
    /**
     * CSS Animation Coordination with Phase-Synchronized Triggers
     */
    triggerCSSAnimations() {
        const elements = {
            container: document.querySelector('.quantum-container'),
            canvas: document.querySelector('.hero-canvas'),
            content: document.querySelector('.signia-content')
        };
        
        // Phase-based animation triggers with mathematical precision
        setTimeout(() => {
            if (elements.container) elements.container.classList.add('departure-phase-1');
            if (elements.canvas) elements.canvas.classList.add('departure-phase-1');
            if (elements.content) elements.content.classList.add('departure-phase-1');
        }, 100);
        
        setTimeout(() => {
            if (elements.container) {
                elements.container.classList.remove('departure-phase-1');
                elements.container.classList.add('departure-phase-2');
            }
            if (elements.canvas) {
                elements.canvas.classList.remove('departure-phase-1');
                elements.canvas.classList.add('departure-phase-2');
            }
            if (elements.content) {
                elements.content.classList.remove('departure-phase-1');
                elements.content.classList.add('departure-phase-2');
            }
        }, 300);
        
        setTimeout(() => {
            if (elements.container) {
                elements.container.classList.remove('departure-phase-2');
                elements.container.classList.add('departure-phase-3');
            }
            if (elements.canvas) {
                elements.canvas.classList.remove('departure-phase-2');
                elements.canvas.classList.add('departure-phase-3');
            }
            if (elements.content) {
                elements.content.classList.remove('departure-phase-2');
                elements.content.classList.add('departure-phase-3');
            }
        }, 800);
        
        // Navigation execution with precise timing
        setTimeout(() => {
            this.executeNavigation();
        }, 1400);
    }
    
    /**
     * EXPONENTIAL VELOCITY CALCULATION ENGINE
     * Mathematical precision velocity modulation for all animation states
     * Formula: v(t) = v₀ × (1 + α × (t/τ)^β)
     */
    calculateCurrentVelocity() {
        if (this.animationState === 'departure') {
            // Exponential departure velocity calculation
            const elapsedTime = performance.now() - this.departureStartTime;
            const normalizedTime = Math.min(elapsedTime / this.departureDuration, 1.0);
            const exponentialFactor = Math.pow(normalizedTime, this.departureExponent);
            const accelerationMultiplier = 1.0 + (this.maxDepartureMultiplier - 1.0) * exponentialFactor;
            
            this.currentVelocity = this.baseVelocity * accelerationMultiplier;
        } else {
            // Smooth interpolation for hover/normal states
            this.currentVelocity += (this.targetVelocity - this.currentVelocity) * this.velocityLerpFactor;
        }
        
        return this.currentVelocity;
    }
    
    /**
     * PARTICLE KINEMATICS UPDATE
     * Frame-synchronous particle motion with velocity modulation
     */
    updateParticleKinematics() {
        this.time += 0.016667; // 60fps precise timing
        
        // Dynamic velocity calculation
        const frameVelocity = this.calculateCurrentVelocity();
        
        // Observer motion
        this.observer.z += frameVelocity;
        
        // Batch particle processing
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Primary observer-relative motion
            particle.z -= frameVelocity;
            
            // Stellar proper motion
            particle.x += particle.properMotion.x;
            particle.y += particle.properMotion.y;
            particle.z += particle.properMotion.z;
            
            // Perspective velocity modification for central field effect
            const centerDistance = Math.sqrt(particle.x*particle.x + particle.y*particle.y);
            const perspectiveFactor = 1.0 / (1.0 + centerDistance * 0.0000006);
            particle.z -= frameVelocity * perspectiveFactor * 0.2;
            
            // Multi-frequency brightness variability
            const primaryPhase = this.time / particle.variabilityPeriod + particle.phase;
            const brightness = Math.sin(primaryPhase) * particle.variabilityAmplitude;
            particle.brightness = 1.0 + brightness;
            
            // Departure state brightness boost
            if (this.animationState === 'departure') {
                const departureElapsed = performance.now() - this.departureStartTime;
                const departureProgress = Math.min(departureElapsed / this.departureDuration, 1.0);
                particle.brightness *= (1.0 + departureProgress * 1.8);
            }
            
            // Atmospheric flicker
            particle.atmosphericFlicker = 0.012 + Math.sin(this.time * (3.5 + Math.random() * 1.2)) * 0.006;
            
            // Particle regeneration at boundary
            if (particle.z < -60) {
                particle.z = particle.initialZ + 4200 + Math.random() * 2400;
                particle.x = (Math.random() - 0.5) * 7200;
                particle.y = (Math.random() - 0.5) * 7200;
            }
        }
    }
    
    /**
     * SILVER PARTICLE RENDERING PIPELINE
     * GPU-accelerated monochrome silver rendering with z-depth sorting
     */
    renderParticleField() {
        // Hardware-accelerated canvas clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Frustum culling with z-depth filtering
        const visibleParticles = [];
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            if (particle.z > 0.2) {
                visibleParticles.push(particle);
            }
        }
        
        // Z-depth sort for correct layering (back-to-front)
        visibleParticles.sort((a, b) => b.z - a.z);
        
        // Batch render for optimal GPU utilization
        for (let i = 0; i < visibleParticles.length; i++) {
            const particle = visibleParticles[i];
            
            // 3D→2D perspective projection
            const zInverse = this.focalLength / particle.z;
            const projectedX = this.centerX + particle.x * zInverse;
            const projectedY = this.centerY + particle.y * zInverse;
            
            // Viewport boundary check
            if (projectedX >= -60 && projectedX <= this.canvas.width + 60 &&
                projectedY >= -60 && projectedY <= this.canvas.height + 60) {
                
                // Distance scaling with silver intensity modification
                const distanceScale = Math.max(0.12, Math.min(1.8, 1200 / particle.z));
                const renderSize = particle.visualSize * distanceScale * particle.intensity;
                
                // Monochrome silver color processing
                const [r, g, b] = particle.silverRGB;
                
                // Multi-layered luminosity with atmospheric flicker
                const luminosityFactor = particle.brightness * distanceScale;
                const baseAlpha = Math.min(0.75, luminosityFactor * 0.55);
                const flickerAlpha = baseAlpha * (1 + particle.atmosphericFlicker);
                
                this.renderSilverParticle(particle, projectedX, projectedY, renderSize, r, g, b, flickerAlpha);
            }
        }
    }
    
    /**
     * Individual Silver Particle Rendering
     */
    renderSilverParticle(particle, x, y, size, r, g, b, alpha) {
        // Primary silver atmosphere gradient
        const atmosphereRadius = size * 2.8;
        const atmosphereGradient = this.ctx.createRadialGradient(x, y, 0, x, y, atmosphereRadius);
        
        atmosphereGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        atmosphereGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
        atmosphereGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
        atmosphereGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        // Render atmosphere
        this.ctx.fillStyle = atmosphereGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, atmosphereRadius, 0, 6.283185307179586);
        this.ctx.fill();
        
        // Silver core
        const coreAlpha = alpha * 1.2;
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.85, coreAlpha)})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.6, 0, 6.283185307179586);
        this.ctx.fill();
        
        // Enhanced silver highlight for premium effect
        if (particle.brightness > 1.012 && particle.spectralClass !== 'M') {
            const highlightAlpha = (particle.brightness - 1) * 0.7 * particle.intensity;
            const highlightRadius = size * 1.0;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${highlightAlpha * 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, highlightRadius, 0, 6.283185307179586);
            this.ctx.fill();
        }
    }
    
    /**
     * Main Render Loop with 60fps Guarantee
     */
    startRenderLoop() {
        const renderFrame = () => {
            this.updateParticleKinematics();
            this.renderParticleField();
            
            this.animationFrameId = requestAnimationFrame(renderFrame);
        };
        
        renderFrame();
    }
    
    /**
     * Navigation Integration System
     */
    setupNavigationIntegration() {
        // Export reference for external access
        window.stellarEngine = this;
    }
    
    /**
     * Navigation Execution
     */
    executeNavigation() {
        console.log('NAVIGATION: Executing transition to home.html...');
        
        try {
            window.location.href = 'home.html';
        } catch (error) {
            console.error('Navigation failed:', error);
            // Fallback navigation methods
            try {
                window.location.assign('home.html');
            } catch (error2) {
                window.open('home.html', '_self');
            }
        }
    }
    
    /**
     * Resource Cleanup
     */
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.particles = null;
        this.ctx = null;
    }
}

/**
 * NavigationController - Enhanced UI Interaction Handler
 * Implements button hover/click events with stellar engine coordination
 */
class NavigationController {
    constructor() {
        this.stellarEngine = null;
        this.navigationInProgress = false;
        this.hoverDebounceTimeout = null;
        
        this.initializeLogoElements();
        this.initializeNavigationButton();
    }
    
    /**
     * Logo Element Initialization with Data Attributes
     */
    initializeLogoElements() {
        const logoFerrum = document.querySelector('.logo-ferrum');
        const logoInsignia = document.querySelector('.logo-insignia');
        
        if (logoFerrum) logoFerrum.setAttribute('data-text', 'FERRUM');
        if (logoInsignia) logoInsignia.setAttribute('data-text', 'INSIGNIA');
    }
    
    /**
     * Navigation Button Event Binding with Multi-Strategy Detection
     */
    initializeNavigationButton() {
        const button = this.findNavigationButton();
        
        if (button) {
            console.log('Navigation button detected:', button);
            this.bindButtonEvents(button);
        } else {
            console.error('CRITICAL: Navigation button not found');
            // Retry detection after DOM stabilization
            setTimeout(() => this.initializeNavigationButton(), 500);
        }
    }
    
    /**
     * Multi-Strategy Button Detection
     */
    findNavigationButton() {
        const strategies = [
            () => document.getElementById('enterButton'),
            () => document.querySelector('#enterButton'),
            () => document.querySelector('.cta-premium'),
            () => document.querySelector('[data-i18n="cta.enter"]'),
            () => document.querySelector('[data-navigation="home.html"]')
        ];
        
        for (const strategy of strategies) {
            const button = strategy();
            if (button) return button;
        }
        
        return null;
    }
    
    /**
     * Comprehensive Button Event Binding
     */
    bindButtonEvents(button) {
        // Hover events for particle acceleration
        button.addEventListener('mouseenter', () => this.handleHoverStart());
        button.addEventListener('mouseleave', () => this.handleHoverEnd());
        
        // Click events for departure animation
        button.addEventListener('click', (e) => this.handleClick(e));
        
        // Keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !this.navigationInProgress) {
                e.preventDefault();
                this.handleClick(e);
            }
        });
        
        // Touch support for mobile devices
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e);
        }, { passive: false });
        
        // Visual feedback
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px)';
        });
    }
    
    /**
     * Hover Start Handler with Debouncing
     */
    handleHoverStart() {
        clearTimeout(this.hoverDebounceTimeout);
        
        if (this.stellarEngine && !this.navigationInProgress) {
            console.log('HOVER-START: Initiating particle acceleration...');
            this.stellarEngine.initiateHoverAcceleration();
        }
    }
    
    /**
     * Hover End Handler with Debouncing
     */
    handleHoverEnd() {
        clearTimeout(this.hoverDebounceTimeout);
        
        // Debounce hover end to prevent rapid toggling
        this.hoverDebounceTimeout = setTimeout(() => {
            if (this.stellarEngine && !this.navigationInProgress) {
                console.log('HOVER-END: Terminating particle acceleration...');
                this.stellarEngine.terminateHoverAcceleration();
            }
        }, 50);
    }
    
    /**
     * Click Handler for Departure Animation
     */
    handleClick(event) {
        event.preventDefault();
        
        if (this.navigationInProgress) {
            console.warn('Navigation already in progress');
            return;
        }
        
        console.log('CLICK: Initiating departure sequence...');
        this.navigationInProgress = true;
        
        if (this.stellarEngine) {
            this.stellarEngine.initiateDepartureSequence();
        } else {
            console.warn('Stellar engine not available - executing fallback navigation');
            setTimeout(() => {
                try {
                    window.location.href = 'home.html';
                } catch (error) {
                    window.location.assign('home.html');
                }
            }, 800);
        }
    }
    
    /**
     * Stellar Engine Reference Setter
     */
    setStellarEngineReference(engine) {
        this.stellarEngine = engine;
        console.log('Navigation controller linked to stellar engine');
    }
}

/**
 * System Initialization with Error Recovery
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded: Initializing Enhanced Animation System...');
    
    try {
        // Initialize core systems
        const stellarEngine = new StellarParticleEngine();
        const navigationController = new NavigationController();
        
        // Cross-reference systems
        navigationController.setStellarEngineReference(stellarEngine);
        
        // Performance monitoring
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark('stellar-engine-initialization-complete');
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (stellarEngine) stellarEngine.destroy();
        });
        
        console.log('✓ Enhanced Animation System successfully initialized');
        
    } catch (error) {
        console.error('CRITICAL: System initialization failed:', error);
        
        // Fallback: Basic navigation without particles
        try {
            const fallbackController = new NavigationController();
            console.log('✓ Fallback navigation system activated');
        } catch (fallbackError) {
            console.error('✗ Fallback system failed:', fallbackError);
        }
    }
});

/**
 * Window Load Event for Additional System Verification
 */
window.addEventListener('load', () => {
    console.log('Window Load: Verifying system components...');
    
    const components = {
        button: document.getElementById('enterButton'),
        canvas: document.getElementById('historyParticleSystem'),
        container: document.querySelector('.quantum-container'),
        stellarEngine: window.stellarEngine
    };
    
    let systemIntegrity = true;
    Object.entries(components).forEach(([name, component]) => {
        if (!component) {
            console.warn(`Component missing: ${name}`);
            systemIntegrity = false;
        }
    });
    
    if (systemIntegrity) {
        console.log('✓ All system components verified');
    } else {
        console.warn('⚠ Partial system availability detected');
    }
});