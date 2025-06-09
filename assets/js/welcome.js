// welcome.js - Ferrum Insignia Enhanced Animation Engine
// Mathematical Precision Animation Pipeline: Normal → Hover → Departure States
// Exponential Departure-Sequence with CSS-Synchronized State-Machine
// Performance-Optimized Particle System with Z-Depth Classification and Memory-Pool Management

/**
 * StellarParticleEngine - GPU-Accelerated Monochrome Silver Particle System
 * Implements Mathematical Z-Depth Classification with Performance-Optimized Rendering
 * States: NORMAL → HOVER_ACCELERATION → DEPARTURE_WARP
 * Performance-Targets: 60fps, <50% CPU, Cross-Device-Responsive-Integrity
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
        
        // Z-DEPTH CLASSIFICATION SYSTEM - Mathematical Performance Optimization
        this.zDepthThresholds = {
            background: 2500,      // z > 2500: Background particles (40% density reduction)
            midground: 800,        // 800 < z < 2500: Standard density
            foreground: 200        // z < 200: Foreground particles (loop-buffer system)
        };
        
        // PERFORMANCE-OPTIMIZED PARTICLE POOLS - Memory Management
        this.particlePools = {
            background: [],        // Reduced density, simple rendering
            midground: [],         // Standard particles with full features
            foreground: []         // Loop-buffer particles with enhanced effects
        };
        
        // OBJECT POOLING SYSTEM - Memory Efficiency
        this.objectPool = {
            particles: [],
            maxPoolSize: 10000,
            activeParticles: 0,
            recycledParticles: 0
        };
        
        // LOOP-BUFFER SYSTEM FOR FOREGROUND PARTICLES
        this.foregroundLoop = {
            particles: [],
            bufferSize: 150,       // Optimized buffer size for foreground effects
            currentIndex: 0,
            loopDuration: 8000,    // 8 seconds loop cycle
            lastLoopTime: 0
        };
        
        // Particle System Core
        this.particles = [];
        this.time = 0;
        this.animationFrameId = null;
        
        // Observer Position for 3D Projection
        this.observer = { x: 0, y: 0, z: -5500 };
        this.focalLength = 850;
        
        // Silver Spectral Classification System
        this.silverSpectrum = this.generateSilverSpectrum();
        
        // Hardware Capability Detection with Performance Metrics
        this.hardwareCapability = this.detectHardwareCapability();
        this.performanceMetrics = {
            frameCount: 0,
            lastFrameTime: 0,
            averageFPS: 60,
            qualityReductions: 0,
            adaptiveScaling: 1.0
        };
        
        // Initialize System with Performance-Optimized Architecture
        this.initializeCanvas();
        this.initializeObjectPool();
        this.generateOptimizedParticleField();
        this.startRenderLoop();
        
        // Navigation Integration
        this.setupNavigationIntegration();
    }
    
    /**
     * Responsive Parameter Calculation - Logarithmic Scaling with Hardware-Adaptive Multipliers
     * Implements mathematical viewport-area classification with performance coefficients
     */
    calculateResponsiveParameters() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            area: window.innerWidth * window.innerHeight,
            ratio: window.innerWidth / window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1
        };
        
        // Hardware-Based Scaling Factors with Mathematical Precision
        const webglBonus = this.detectWebGL() ? 1.15 : 1.0;
        const highDPIBonus = viewport.pixelRatio >= 2 ? 1.1 : 1.0;
        const memoryBonus = (navigator.deviceMemory >= 8) ? 1.3 : 
                           (navigator.deviceMemory >= 4) ? 1.1 : 0.8;
        const finalMultiplier = webglBonus * highDPIBonus * memoryBonus;
        
        // Logarithmic Density Mapping with Z-Depth Optimization
        let baseDensity, backgroundReduction, foregroundEnhancement;
        
        if (viewport.area >= 8294400) {        // 4K+ (3840×2160+)
            baseDensity = 4200;               // Reduced from 6800 for performance
            backgroundReduction = 0.3;        // 70% density reduction for background
            foregroundEnhancement = 1.4;      // 40% enhancement for foreground
        } else if (viewport.area >= 2073600) { // Full-HD+ (1920×1080+)
            baseDensity = 3400;               // Reduced from 5400 for performance
            backgroundReduction = 0.35;       // 65% density reduction
            foregroundEnhancement = 1.3;      // 30% enhancement
        } else if (viewport.area >= 1440000) { // HD+ (1600×900+)
            baseDensity = 3000;               // Reduced from 4800 for performance
            backgroundReduction = 0.4;        // 60% density reduction
            foregroundEnhancement = 1.2;      // 20% enhancement
        } else if (viewport.area >= 921600) {  // HD (1280×720+)
            baseDensity = 2800;               // Reduced from 4200 for performance
            backgroundReduction = 0.45;       // 55% density reduction
            foregroundEnhancement = 1.1;      // 10% enhancement
        } else if (viewport.area >= 518400) {  // Tablet (960×540+)
            baseDensity = 2200;               // Reduced from 3400 for performance
            backgroundReduction = 0.5;        // 50% density reduction
            foregroundEnhancement = 1.0;      // No enhancement
        } else if (viewport.area >= 307200) {  // Mobile-L (640×480+)
            baseDensity = 1800;               // Reduced from 2600 for performance
            backgroundReduction = 0.6;        // 40% density reduction
            foregroundEnhancement = 0.9;      // 10% reduction
        } else {                               // Mobile-S (<640×480)
            baseDensity = 1400;               // Reduced from 2000 for performance
            backgroundReduction = 0.7;        // 30% density reduction
            foregroundEnhancement = 0.8;      // 20% reduction
        }
        
        // Mobile Performance Optimization with Mathematical Scaling
        if (viewport.width <= 768) baseDensity *= 0.75;  // 25% reduction
        if (viewport.width <= 480) baseDensity *= 0.65;  // Additional 35% reduction
        
        // Calculate optimized particle distribution
        this.optimalParticleCount = Math.floor(baseDensity * finalMultiplier);
        this.backgroundDensityMultiplier = backgroundReduction;
        this.foregroundDensityMultiplier = foregroundEnhancement;
        this.viewport = viewport;
        
        console.log(`Performance-Optimized Viewport: ${viewport.width}×${viewport.height}`);
        console.log(`Total Particles: ${this.optimalParticleCount}`);
        console.log(`Background Reduction: ${(1-backgroundReduction)*100}%`);
        console.log(`Foreground Enhancement: ${(foregroundEnhancement-1)*100}%`);
    }
    
    /**
     * WebGL Capability Detection for Hardware Acceleration Assessment
     */
    detectWebGL() {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    }
    
    /**
     * Hardware Capability Assessment with Performance Profiling
     */
    detectHardwareCapability() {
        const startTime = performance.now();
        
        // CPU Performance Test - Lightweight computation benchmark
        let computationResult = 0;
        for (let i = 0; i < 100000; i++) {
            computationResult += Math.sqrt(i) * Math.sin(i * 0.01);
        }
        
        const cpuBenchmarkTime = performance.now() - startTime;
        
        return {
            webgl: this.detectWebGL(),
            highDPI: window.devicePixelRatio >= 2,
            modernBrowser: 'requestIdleCallback' in window,
            performanceAPI: 'performance' in window && 'now' in window.performance,
            memoryEstimate: navigator.deviceMemory || 4,
            cpuPerformance: cpuBenchmarkTime < 10 ? 'high' : cpuBenchmarkTime < 25 ? 'medium' : 'low',
            hardwareTier: (() => {
                const score = (this.detectWebGL() ? 30 : 0) + 
                             (window.devicePixelRatio >= 2 ? 20 : 0) + 
                             (navigator.deviceMemory >= 8 ? 25 : navigator.deviceMemory >= 4 ? 15 : 0) +
                             (cpuBenchmarkTime < 10 ? 25 : cpuBenchmarkTime < 25 ? 15 : 0);
                
                if (score >= 80) return 'premium';
                if (score >= 60) return 'high';
                if (score >= 40) return 'medium';
                return 'low';
            })()
        };
    }
    
    /**
     * Canvas Initialization with GPU Layer Promotion and Performance Optimization
     */
    initializeCanvas() {
        this.resizeCanvas();
        
        // GPU Composite Operation for Additive Blending
        this.ctx.globalCompositeOperation = 'screen';
        
        // Performance-optimized rendering hints
        this.ctx.imageSmoothingEnabled = false;
        
        // Debounced Resize Handler with Performance Throttling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.calculateResponsiveParameters();
                this.resizeCanvas();
                this.regenerateOptimizedParticleField();
            }, 150);
        }, { passive: true });
    }
    
    /**
     * Responsive Canvas Resize Handler with Pixel-Perfect Scaling
     */
    resizeCanvas() {
        const { width, height } = this.viewport;
        this.canvas.width = width;
        this.canvas.height = height;
        this.centerX = width * 0.5;
        this.centerY = height * 0.5;
        
        // Update canvas attributes for performance monitoring
        this.canvas.setAttribute('data-canvas-width', width);
        this.canvas.setAttribute('data-canvas-height', height);
        this.canvas.setAttribute('data-pixel-ratio', this.viewport.pixelRatio);
    }
    
    /**
     * Object Pool Initialization - Memory Management System
     * Pre-allocates particle objects to eliminate garbage collection overhead
     */
    initializeObjectPool() {
        console.log('Initializing Object Pool with memory management...');
        
        // Pre-allocate particle objects
        for (let i = 0; i < this.objectPool.maxPoolSize; i++) {
            this.objectPool.particles.push(this.createParticleObject());
        }
        
        console.log(`Object Pool initialized: ${this.objectPool.maxPoolSize} particles pre-allocated`);
    }
    
    /**
     * Creates a reusable particle object template
     */
    createParticleObject() {
        return {
            // Spatial coordinates
            x: 0, y: 0, z: 0,
            initialZ: 0,
            
            // Physical properties
            mass: 0,
            spectralClass: '',
            temperature: 0,
            silverRGB: [0, 0, 0],
            intensity: 0,
            
            // Visual properties
            visualSize: 0,
            baseVisualSize: 0,
            
            // Motion parameters
            properMotion: { x: 0, y: 0, z: 0 },
            
            // Variability system
            variabilityAmplitude: 0,
            variabilityPeriod: 0,
            phase: 0,
            
            // Runtime properties
            brightness: 1.0,
            atmosphericFlicker: 0,
            
            // Performance optimization flags
            zDepthCategory: 'midground',
            renderingTier: 'standard',
            active: false,
            poolIndex: -1
        };
    }
    
    /**
     * Retrieves a particle from the object pool or creates new one if needed
     */
    getParticleFromPool() {
        // Try to find inactive particle in pool
        for (let i = 0; i < this.objectPool.particles.length; i++) {
            const particle = this.objectPool.particles[i];
            if (!particle.active) {
                particle.active = true;
                particle.poolIndex = i;
                this.objectPool.activeParticles++;
                return particle;
            }
        }
        
        // If pool is exhausted, create new particle (should be rare)
        console.warn('Object pool exhausted, creating new particle');
        const newParticle = this.createParticleObject();
        newParticle.active = true;
        newParticle.poolIndex = -1;
        return newParticle;
    }
    
    /**
     * Returns a particle to the object pool for reuse
     */
    returnParticleToPool(particle) {
        if (particle.poolIndex >= 0) {
            particle.active = false;
            this.objectPool.activeParticles--;
            this.objectPool.recycledParticles++;
        }
    }
    
    /**
     * Monochrome Silver Spectral Classification System
     * Performance-optimized with reduced computational overhead
     */
    generateSilverSpectrum() {
        return {
            'O': { 
                temp: 35000, 
                silverRGB: [248, 248, 248], // Ultra-brilliant silver
                intensity: 0.98,
                variability: [0.015, 0.060],
                renderingTier: 'premium'
            },
            'B': { 
                temp: 22000, 
                silverRGB: [240, 240, 240], // High-brilliant silver
                intensity: 0.95,
                variability: [0.012, 0.050],
                renderingTier: 'high'
            },
            'A': { 
                temp: 8500, 
                silverRGB: [230, 230, 230], // Sterling silver
                intensity: 0.92,
                variability: [0.010, 0.040],
                renderingTier: 'high'
            },
            'F': { 
                temp: 6800, 
                silverRGB: [220, 220, 220], // Warm silver
                intensity: 0.88,
                variability: [0.008, 0.030],
                renderingTier: 'standard'
            },
            'G': { 
                temp: 5800, 
                silverRGB: [210, 210, 210], // Standard silver
                intensity: 0.85,
                variability: [0.006, 0.025],
                renderingTier: 'standard'
            },
            'K': { 
                temp: 4300, 
                silverRGB: [200, 200, 200], // Cool silver
                intensity: 0.82,
                variability: [0.004, 0.020],
                renderingTier: 'reduced'
            },
            'M': { 
                temp: 3200, 
                silverRGB: [190, 190, 190], // Dark silver
                intensity: 0.78,
                variability: [0.002, 0.015],
                renderingTier: 'minimal'
            }
        };
    }
    
    /**
     * Stellar Mass Classification via Optimized Salpeter IMF
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
     * Optimized Salpeter IMF Implementation with Performance Caching
     */
    salpeterIMF() {
        const ξ = Math.random();
        return 0.08 * Math.pow((6.75e-5 - 1) * ξ + 1, -0.7407407);
    }
    
    /**
     * PERFORMANCE-OPTIMIZED PARTICLE FIELD GENERATION
     * Implements Z-Depth Classification and Memory Pool Management
     */
    generateOptimizedParticleField() {
        console.log('Generating performance-optimized particle field...');
        
        const particleCount = this.optimalParticleCount;
        const galacticRadius = 8500;
        
        // Clear existing particles and return to pool
        this.particles.forEach(particle => this.returnParticleToPool(particle));
        this.particles = [];
        this.particlePools.background = [];
        this.particlePools.midground = [];
        this.particlePools.foreground = [];
        
        // Generate particles with Z-depth classification
        for (let i = 0; i < particleCount; i++) {
            const particle = this.generateSingleParticle(galacticRadius, i);
            
            // Classify particle by Z-depth for performance optimization
            this.classifyParticleByZDepth(particle);
            
            // Add to appropriate pool
            this.particles.push(particle);
            this.particlePools[particle.zDepthCategory].push(particle);
        }
        
        // Initialize foreground loop buffer
        this.initializeForegroundLoop();
        
        console.log(`Particle distribution - Background: ${this.particlePools.background.length}, Midground: ${this.particlePools.midground.length}, Foreground: ${this.particlePools.foreground.length}`);
    }
    
    /**
     * Generates a single optimized particle with performance characteristics
     */
    generateSingleParticle(galacticRadius, index) {
        const particle = this.getParticleFromPool();
        
        // 3D Galactic coordinate distribution with performance optimization
        const r = -2.2 * Math.log(Math.random()) * galacticRadius;
        const θ = Math.random() * 6.283185307179586; // 2π
        const φ = this.generateGaussianHeight() * 0.25132741228718345; // π/8
        
        // Cartesian transformation
        const cosφ = Math.cos(φ);
        particle.x = r * Math.cos(θ) * cosφ;
        particle.y = r * Math.sin(θ) * cosφ;
        
        // Z-distribution with performance-based depth assignment
        if (Math.random() < 0.6) {
            particle.z = 150 + Math.random() * 1200; // Closer particles for better visibility
        } else {
            particle.z = r * Math.sin(φ);
        }
        particle.initialZ = particle.z;
        
        // Stellar classification with performance consideration
        const stellarMass = this.salpeterIMF();
        const spectralClass = this.classifyByMass(stellarMass);
        const stellarData = this.silverSpectrum[spectralClass];
        
        particle.mass = stellarMass;
        particle.spectralClass = spectralClass;
        particle.temperature = stellarData.temp;
        particle.silverRGB = [...stellarData.silverRGB];
        particle.intensity = stellarData.intensity;
        particle.renderingTier = stellarData.renderingTier;
        
        // Visual properties calculation with performance optimization
        const distance = Math.sqrt(particle.x*particle.x + particle.y*particle.y + particle.z*particle.z);
        const baseMagnitude = 1000 / distance;
        particle.visualSize = Math.max(0.4, Math.min(2.6, baseMagnitude * stellarData.intensity));
        particle.baseVisualSize = particle.visualSize;
        
        // Motion parameters with reduced complexity for background particles
        particle.properMotion.x = (Math.random() - 0.5) * 0.0014;
        particle.properMotion.y = (Math.random() - 0.5) * 0.0014;
        particle.properMotion.z = (Math.random() - 0.5) * 0.0007;
        
        // Variability system
        const [minVar, maxVar] = stellarData.variability;
        particle.variabilityAmplitude = minVar + Math.random() * (maxVar - minVar);
        particle.variabilityPeriod = 6 + Math.random() * 32;
        particle.phase = Math.random() * 6.283185307179586;
        
        // Runtime properties
        particle.brightness = 1.0;
        particle.atmosphericFlicker = Math.random() * 0.012 + 0.004;
        
        return particle;
    }
    
    /**
     * Classifies particles by Z-depth for performance optimization
     */
    classifyParticleByZDepth(particle) {
        if (particle.z > this.zDepthThresholds.background) {
            particle.zDepthCategory = 'background';
            // Apply density reduction for background particles
            if (Math.random() > this.backgroundDensityMultiplier) {
                particle.renderingTier = 'reduced';
            }
        } else if (particle.z > this.zDepthThresholds.midground) {
            particle.zDepthCategory = 'midground';
        } else {
            particle.zDepthCategory = 'foreground';
            // Apply enhancement for foreground particles
            particle.intensity *= this.foregroundDensityMultiplier;
            particle.visualSize *= 1.1; // Slight size boost for prominence
        }
    }
    
    /**
     * Initializes the foreground loop buffer system
     */
    initializeForegroundLoop() {
        console.log('Initializing foreground loop buffer...');
        
        // Select brightest foreground particles for loop buffer
        const foregroundCandidates = this.particlePools.foreground
            .filter(p => p.intensity > 0.85)
            .sort((a, b) => b.intensity - a.intensity)
            .slice(0, this.foregroundLoop.bufferSize);
        
        this.foregroundLoop.particles = foregroundCandidates.map(particle => ({
            ...particle,
            loopPhase: Math.random() * Math.PI * 2,
            loopAmplitude: 0.8 + Math.random() * 0.4,
            loopFrequency: 0.5 + Math.random() * 1.5
        }));
        
        console.log(`Foreground loop buffer initialized with ${this.foregroundLoop.particles.length} particles`);
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
    regenerateOptimizedParticleField() {
        console.log('Regenerating optimized particle field...');
        this.generateOptimizedParticleField();
    }
    
    /**
     * HOVER ANIMATION SYSTEM - Performance Optimized
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
     * DEPARTURE ANIMATION SYSTEM - Exponential Acceleration with CSS Synchronization
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
     * Mathematical precision velocity modulation with performance optimization
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
     * PERFORMANCE-OPTIMIZED PARTICLE KINEMATICS UPDATE
     * Z-Depth classified processing with adaptive quality scaling
     */
    updateParticleKinematics() {
        this.time += 0.016667; // 60fps precise timing
        
        // Dynamic velocity calculation
        const frameVelocity = this.calculateCurrentVelocity();
        
        // Observer motion
        this.observer.z += frameVelocity;
        
        // Update foreground loop buffer with enhanced effects
        this.updateForegroundLoop();
        
        // Batch particle processing with Z-depth optimization
        this.updateParticlesByDepth(frameVelocity);
        
        // Performance monitoring
        this.updatePerformanceMetrics();
    }
    
    /**
     * Updates foreground loop buffer with enhanced visual effects
     */
    updateForegroundLoop() {
        const currentTime = this.time;
        
        this.foregroundLoop.particles.forEach(particle => {
            // Enhanced loop animation for foreground particles
            const loopProgress = (currentTime * particle.loopFrequency) + particle.loopPhase;
            const loopInfluence = Math.sin(loopProgress) * particle.loopAmplitude;
            
            // Apply subtle oscillation for enhanced visual appeal
            particle.brightness = 1.0 + (loopInfluence * 0.3);
            particle.visualSize = particle.baseVisualSize * (1.0 + loopInfluence * 0.2);
            
            // Enhanced atmospheric effects for foreground
            particle.atmosphericFlicker = 0.015 + Math.sin(currentTime * 2.5) * 0.008;
        });
    }
    
    /**
     * Updates particles by Z-depth category with performance optimization
     */
    updateParticlesByDepth(frameVelocity) {
        // Background particles - reduced processing
        this.particlePools.background.forEach(particle => {
            this.updateParticleBasic(particle, frameVelocity);
        });
        
        // Midground particles - standard processing
        this.particlePools.midground.forEach(particle => {
            this.updateParticleStandard(particle, frameVelocity);
        });
        
        // Foreground particles - enhanced processing
        this.particlePools.foreground.forEach(particle => {
            this.updateParticleEnhanced(particle, frameVelocity);
        });
    }
    
    /**
     * Basic particle update for background particles (performance optimized)
     */
    updateParticleBasic(particle, frameVelocity) {
        // Primary observer-relative motion
        particle.z -= frameVelocity;
        
        // Simplified proper motion
        particle.x += particle.properMotion.x;
        particle.y += particle.properMotion.y;
        particle.z += particle.properMotion.z * 0.5; // Reduced for background
        
        // Simple brightness calculation
        particle.brightness = 1.0 + Math.sin(this.time / particle.variabilityPeriod + particle.phase) * particle.variabilityAmplitude * 0.5;
        
        // Particle regeneration at boundary
        if (particle.z < -60) {
            particle.z = particle.initialZ + 4200 + Math.random() * 2400;
            particle.x = (Math.random() - 0.5) * 7200;
            particle.y = (Math.random() - 0.5) * 7200;
        }
    }
    
    /**
     * Standard particle update for midground particles
     */
    updateParticleStandard(particle, frameVelocity) {
        // Primary observer-relative motion
        particle.z -= frameVelocity;
        
        // Standard proper motion
        particle.x += particle.properMotion.x;
        particle.y += particle.properMotion.y;
        particle.z += particle.properMotion.z;
        
        // Perspective velocity modification
        const centerDistance = Math.sqrt(particle.x*particle.x + particle.y*particle.y);
        const perspectiveFactor = 1.0 / (1.0 + centerDistance * 0.0000006);
        particle.z -= frameVelocity * perspectiveFactor * 0.2;
        
        // Standard brightness variability
        const primaryPhase = this.time / particle.variabilityPeriod + particle.phase;
        const brightness = Math.sin(primaryPhase) * particle.variabilityAmplitude;
        particle.brightness = 1.0 + brightness;
        
        // Departure state brightness boost
        if (this.animationState === 'departure') {
            const departureElapsed = performance.now() - this.departureStartTime;
            const departureProgress = Math.min(departureElapsed / this.departureDuration, 1.0);
            particle.brightness *= (1.0 + departureProgress * 1.8);
        }
        
        // Standard atmospheric flicker
        particle.atmosphericFlicker = 0.012 + Math.sin(this.time * (3.5 + Math.random() * 1.2)) * 0.006;
        
        // Particle regeneration at boundary
        if (particle.z < -60) {
            particle.z = particle.initialZ + 4200 + Math.random() * 2400;
            particle.x = (Math.random() - 0.5) * 7200;
            particle.y = (Math.random() - 0.5) * 7200;
        }
    }
    
    /**
     * Enhanced particle update for foreground particles with premium effects
     */
    updateParticleEnhanced(particle, frameVelocity) {
        // Enhanced observer-relative motion
        particle.z -= frameVelocity;
        
        // Enhanced proper motion with micro-variations
        particle.x += particle.properMotion.x * 1.1;
        particle.y += particle.properMotion.y * 1.1;
        particle.z += particle.properMotion.z * 1.2;
        
        // Enhanced perspective effects
        const centerDistance = Math.sqrt(particle.x*particle.x + particle.y*particle.y);
        const perspectiveFactor = 1.0 / (1.0 + centerDistance * 0.0000004);
        particle.z -= frameVelocity * perspectiveFactor * 0.3;
        
        // Multi-frequency brightness variability for enhanced sparkle
        const primaryPhase = this.time / particle.variabilityPeriod + particle.phase;
        const secondaryPhase = this.time / (particle.variabilityPeriod * 0.7) + particle.phase;
        const brightness = Math.sin(primaryPhase) * particle.variabilityAmplitude +
                          Math.sin(secondaryPhase) * particle.variabilityAmplitude * 0.3;
        particle.brightness = 1.0 + brightness;
        
        // Enhanced departure state effects
        if (this.animationState === 'departure') {
            const departureElapsed = performance.now() - this.departureStartTime;
            const departureProgress = Math.min(departureElapsed / this.departureDuration, 1.0);
            particle.brightness *= (1.0 + departureProgress * 2.2); // Higher multiplier for foreground
        }
        
        // Enhanced atmospheric flicker with micro-turbulence
        particle.atmosphericFlicker = 0.015 + Math.sin(this.time * (4.0 + Math.random() * 1.5)) * 0.008 +
                                     Math.sin(this.time * 12.0) * 0.003;
        
        // Particle regeneration at boundary with enhanced positioning
        if (particle.z < -60) {
            particle.z = particle.initialZ + 3800 + Math.random() * 1800; // Closer regeneration
            particle.x = (Math.random() - 0.5) * 6000; // Tighter distribution
            particle.y = (Math.random() - 0.5) * 6000;
        }
    }
    
    /**
     * Performance metrics monitoring and adaptive quality scaling
     */
    updatePerformanceMetrics() {
        this.performanceMetrics.frameCount++;
        const currentTime = performance.now();
        
        // Calculate FPS every second
        if (currentTime - this.performanceMetrics.lastFrameTime >= 1000) {
            const fps = this.performanceMetrics.frameCount;
            this.performanceMetrics.averageFPS = fps;
            this.performanceMetrics.frameCount = 0;
            this.performanceMetrics.lastFrameTime = currentTime;
            
            // Adaptive quality scaling based on performance
            this.adaptiveQualityScaling(fps);
        }
    }
    
    /**
     * Adaptive quality scaling based on real-time performance
     */
    adaptiveQualityScaling(fps) {
        const targetFPS = 55; // Target minimum FPS with buffer
        
        if (fps < targetFPS && this.performanceMetrics.qualityReductions < 3) {
            console.warn(`Performance optimization: FPS=${fps}, applying quality reduction`);
            
            // Reduce background particle density
            const reductionFactor = 0.8;
            const backgroundToRemove = Math.floor(this.particlePools.background.length * (1 - reductionFactor));
            
            for (let i = 0; i < backgroundToRemove; i++) {
                const removedParticle = this.particlePools.background.pop();
                if (removedParticle) {
                    this.returnParticleToPool(removedParticle);
                    const index = this.particles.indexOf(removedParticle);
                    if (index > -1) {
                        this.particles.splice(index, 1);
                    }
                }
            }
            
            this.performanceMetrics.qualityReductions++;
            this.performanceMetrics.adaptiveScaling *= reductionFactor;
            
            // Update canvas attributes
            this.canvas.setAttribute('data-quality-reduction', this.performanceMetrics.qualityReductions);
            this.canvas.setAttribute('data-adaptive-scaling', this.performanceMetrics.adaptiveScaling.toFixed(2));
            
            console.log(`Quality reduction applied: ${backgroundToRemove} background particles removed`);
        } else if (fps >= targetFPS + 10 && this.performanceMetrics.adaptiveScaling < 1.0) {
            // Performance is good, could potentially restore quality
            console.log(`Performance excellent: FPS=${fps}, maintaining quality`);
        }
    }
    
    /**
     * OPTIMIZED SILVER PARTICLE RENDERING PIPELINE
     * Z-depth sorted rendering with frustum culling and adaptive quality
     */
    renderParticleField() {
        // Hardware-accelerated canvas clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Frustum culling with Z-depth filtering and performance optimization
        const visibleParticles = [];
        
        // Process particles by category for optimal performance
        this.addVisibleParticlesByCategory('background', visibleParticles);
        this.addVisibleParticlesByCategory('midground', visibleParticles);
        this.addVisibleParticlesByCategory('foreground', visibleParticles);
        
        // Z-depth sort for correct layering (back-to-front)
        visibleParticles.sort((a, b) => b.z - a.z);
        
        // Batch render with quality-based culling
        this.renderParticlesByQuality(visibleParticles);
    }
    
    /**
     * Adds visible particles by category with performance optimization
     */
    addVisibleParticlesByCategory(category, visibleParticles) {
        const particles = this.particlePools[category];
        const scalingFactor = this.performanceMetrics.adaptiveScaling;
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            
            // Z-depth visibility check
            if (particle.z > 0.2) {
                // Apply adaptive scaling - skip some particles if performance is reduced
                if (category === 'background' && scalingFactor < 1.0) {
                    if (Math.random() > scalingFactor) continue;
                }
                
                visibleParticles.push(particle);
            }
        }
    }
    
    /**
     * Renders particles with quality-based optimizations
     */
    renderParticlesByQuality(visibleParticles) {
        for (let i = 0; i < visibleParticles.length; i++) {
            const particle = visibleParticles[i];
            
            // 3D→2D perspective projection
            const zInverse = this.focalLength / particle.z;
            const projectedX = this.centerX + particle.x * zInverse;
            const projectedY = this.centerY + particle.y * zInverse;
            
            // Viewport boundary check with margin
            if (projectedX >= -60 && projectedX <= this.canvas.width + 60 &&
                projectedY >= -60 && projectedY <= this.canvas.height + 60) {
                
                // Distance scaling with silver intensity modification
                const distanceScale = Math.max(0.12, Math.min(1.8, 1200 / particle.z));
                const renderSize = particle.visualSize * distanceScale * particle.intensity;
                
                // Skip very small particles for performance
                if (renderSize < 0.3) continue;
                
                // Render based on particle category and quality tier
                this.renderParticleByCategory(particle, projectedX, projectedY, renderSize, distanceScale);
            }
        }
    }
    
    /**
     * Renders individual particle based on its category and performance tier
     */
    renderParticleByCategory(particle, x, y, size, distanceScale) {
        const [r, g, b] = particle.silverRGB;
        
        // Calculate alpha based on category and performance
        let baseAlpha = Math.min(0.75, (particle.brightness * distanceScale) * 0.55);
        let atmosphereRadius = size * 2.8;
        
        // Adjust rendering quality based on category
        switch (particle.zDepthCategory) {
            case 'background':
                // Simplified rendering for background particles
                baseAlpha *= 0.6; // Reduce opacity
                atmosphereRadius *= 0.7; // Smaller atmosphere
                this.renderSimpleParticle(x, y, size, r, g, b, baseAlpha);
                break;
                
            case 'midground':
                // Standard rendering for midground particles
                this.renderStandardParticle(particle, x, y, size, r, g, b, baseAlpha, atmosphereRadius);
                break;
                
            case 'foreground':
                // Enhanced rendering for foreground particles
                baseAlpha *= 1.2; // Boost opacity
                atmosphereRadius *= 1.1; // Larger atmosphere
                this.renderEnhancedParticle(particle, x, y, size, r, g, b, baseAlpha, atmosphereRadius);
                break;
        }
    }
    
    /**
     * Simple particle rendering for background particles
     */
    renderSimpleParticle(x, y, size, r, g, b, alpha) {
        // Simple circle rendering without atmosphere
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.8, 0, 6.283185307179586);
        this.ctx.fill();
    }
    
    /**
     * Standard particle rendering for midground particles
     */
    renderStandardParticle(particle, x, y, size, r, g, b, baseAlpha, atmosphereRadius) {
        const flickerAlpha = baseAlpha * (1 + particle.atmosphericFlicker);
        
        // Atmosphere gradient
        const atmosphereGradient = this.ctx.createRadialGradient(x, y, 0, x, y, atmosphereRadius);
        atmosphereGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${flickerAlpha})`);
        atmosphereGradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.4})`);
        atmosphereGradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.15})`);
        atmosphereGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        // Render atmosphere
        this.ctx.fillStyle = atmosphereGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, atmosphereRadius, 0, 6.283185307179586);
        this.ctx.fill();
        
        // Silver core
        const coreAlpha = flickerAlpha * 1.2;
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.85, coreAlpha)})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.6, 0, 6.283185307179586);
        this.ctx.fill();
    }
    
    /**
     * Enhanced particle rendering for foreground particles
     */
    renderEnhancedParticle(particle, x, y, size, r, g, b, baseAlpha, atmosphereRadius) {
        const flickerAlpha = baseAlpha * (1 + particle.atmosphericFlicker);
        
        // Enhanced atmosphere gradient
        const atmosphereGradient = this.ctx.createRadialGradient(x, y, 0, x, y, atmosphereRadius);
        atmosphereGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${flickerAlpha})`);
        atmosphereGradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.6})`);
        atmosphereGradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.3})`);
        atmosphereGradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${flickerAlpha * 0.1})`);
        atmosphereGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        // Render enhanced atmosphere
        this.ctx.fillStyle = atmosphereGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, atmosphereRadius, 0, 6.283185307179586);
        this.ctx.fill();
        
        // Enhanced silver core with multiple layers
        const coreAlpha = flickerAlpha * 1.3;
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.9, coreAlpha)})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.7, 0, 6.283185307179586);
        this.ctx.fill();
        
        // Enhanced silver highlight for premium effect
        if (particle.brightness > 1.015 && particle.spectralClass !== 'M') {
            const highlightAlpha = (particle.brightness - 1) * 0.8 * particle.intensity;
            const highlightRadius = size * 1.2;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${highlightAlpha * 0.4})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, highlightRadius, 0, 6.283185307179586);
            this.ctx.fill();
        }
    }
    
    /**
     * Main Render Loop with 60fps Guarantee and Performance Monitoring
     */
    startRenderLoop() {
        let lastFrameTime = 0;
        
        const renderFrame = (currentTime) => {
            // Frame rate limiting for consistency
            if (currentTime - lastFrameTime >= 16.67) { // ~60fps
                this.updateParticleKinematics();
                this.renderParticleField();
                lastFrameTime = currentTime;
            }
            
            this.animationFrameId = requestAnimationFrame(renderFrame);
        };
        
        renderFrame(0);
    }
    
    /**
     * Navigation Integration System
     */
    setupNavigationIntegration() {
        // Export reference for external access
        window.stellarEngine = this;
        
        // Performance monitoring export
        window.stellarPerformance = {
            getMetrics: () => this.performanceMetrics,
            getParticleDistribution: () => ({
                total: this.particles.length,
                background: this.particlePools.background.length,
                midground: this.particlePools.midground.length,
                foreground: this.particlePools.foreground.length,
                active: this.objectPool.activeParticles,
                recycled: this.objectPool.recycledParticles
            }),
            getHardwareInfo: () => this.hardwareCapability
        };
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
     * Resource Cleanup with Memory Management
     */
    destroy() {
        console.log('Destroying stellar engine and cleaning up resources...');
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // Return all particles to pool
        this.particles.forEach(particle => this.returnParticleToPool(particle));
        
        // Clear arrays
        this.particles = null;
        this.particlePools = null;
        this.foregroundLoop = null;
        
        // Clean up context
        this.ctx = null;
        
        console.log('Stellar engine destroyed and memory cleaned up');
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
 * System Initialization with Error Recovery and Performance Monitoring
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded: Initializing Enhanced Performance-Optimized Animation System...');
    
    try {
        // Initialize core systems
        const stellarEngine = new StellarParticleEngine();
        const navigationController = new NavigationController();
        
        // Cross-reference systems
        navigationController.setStellarEngineReference(stellarEngine);
        
        // Performance monitoring setup
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark('stellar-engine-initialization-complete');
        }
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (stellarEngine) stellarEngine.destroy();
        });
        
        console.log('✓ Enhanced Performance-Optimized Animation System successfully initialized');
        console.log(`✓ Hardware Tier: ${stellarEngine.hardwareCapability.hardwareTier}`);
        console.log(`✓ Particle Distribution: Background=${stellarEngine.particlePools.background.length}, Midground=${stellarEngine.particlePools.midground.length}, Foreground=${stellarEngine.particlePools.foreground.length}`);
        
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
 * Window Load Event for Performance Validation and System Verification
 */
window.addEventListener('load', () => {
    console.log('Window Load: Verifying system components and performance...');
    
    const components = {
        button: document.getElementById('enterButton'),
        canvas: document.getElementById('historyParticleSystem'),
        container: document.querySelector('.quantum-container'),
        stellarEngine: window.stellarEngine,
        performanceMonitor: window.stellarPerformance
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
        
        // Log performance metrics if available
        if (window.stellarPerformance) {
            const distribution = window.stellarPerformance.getParticleDistribution();
            const hardware = window.stellarPerformance.getHardwareInfo();
            
            console.log('✓ Particle System Performance Report:');
            console.log(`  - Total Particles: ${distribution.total}`);
            console.log(`  - Background: ${distribution.background} (${((distribution.background/distribution.total)*100).toFixed(1)}%)`);
            console.log(`  - Midground: ${distribution.midground} (${((distribution.midground/distribution.total)*100).toFixed(1)}%)`);
            console.log(`  - Foreground: ${distribution.foreground} (${((distribution.foreground/distribution.total)*100).toFixed(1)}%)`);
            console.log(`  - Active Objects: ${distribution.active}`);
            console.log(`  - Recycled Objects: ${distribution.recycled}`);
            console.log(`  - Hardware Tier: ${hardware.hardwareTier}`);
            console.log(`  - WebGL Support: ${hardware.webgl}`);
            console.log(`  - Memory Estimate: ${hardware.memoryEstimate}GB`);
        }
    } else {
        console.warn('⚠ Partial system availability detected');
    }
});