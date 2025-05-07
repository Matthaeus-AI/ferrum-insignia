// welcome.js - Ferrum Insignia Quantum Animation Engine

/**
 * Quantum Animation Engine - Ultra-Premium Landing Experience
 * Implements physics-based particle systems and metallic material simulations
 */

class QuantumAnimationEngine {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.time = 0;
        this.rafId = null;
        
        this.initializeCanvas();
        this.initializeParticles();
        this.bindEvents();
        this.startAnimationLoop();
    }
    
    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    initializeParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Apply physics
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx += (dx / distance) * force * 0.02;
                particle.vy += (dy / distance) * force * 0.02;
            }
            
            // Add subtle oscillation
            particle.x += Math.sin(this.time * 0.001 + particle.phase) * 0.1;
            particle.y += Math.cos(this.time * 0.001 + particle.phase) * 0.1;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Boundary conditions
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create metallic gradient
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(192, 192, 192, 0.05)');
        gradient.addColorStop(1, 'rgba(192, 192, 192, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(192, 192, 192, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(192, 192, 192, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            this.time++;
            this.updateParticles();
            this.drawParticles();
            this.rafId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

/**
 * Metallic Material Simulator
 * Implements dynamic reflections and shine effects
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
            // Add data attributes for shine effect
            logoFerrum.setAttribute('data-text', 'FERRUM');
            logoInsignia.setAttribute('data-text', 'INSIGNIA');
            
            // Mouse movement effect
            document.addEventListener('mousemove', (e) => {
                const x = e.clientX / window.innerWidth;
                const y = e.clientY / window.innerHeight;
                
                const angle = Math.atan2(y - 0.5, x - 0.5) * 180 / Math.PI;
                
                logoFerrum.style.background = `linear-gradient(${angle}deg, 
                    #e8e8e8 0%, #c0c0c0 30%, #a8a8a8 50%, #c0c0c0 70%, #e8e8e8 100%)`;
                logoInsignia.style.background = `linear-gradient(${angle}deg, 
                    #e8e8e8 0%, #c0c0c0 30%, #a8a8a8 50%, #c0c0c0 70%, #e8e8e8 100%)`;
                
                logoFerrum.style.webkitBackgroundClip = 'text';
                logoInsignia.style.webkitBackgroundClip = 'text';
            });
        }
    }
    
    initializeButton() {
        const ctaButton = document.getElementById('enterButton');
        
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.initiateQuantumTransition();
            });
            
            // Haptic feedback simulation
            ctaButton.addEventListener('mousedown', () => {
                ctaButton.style.transform = 'translateY(0)';
            });
            
            ctaButton.addEventListener('mouseup', () => {
                ctaButton.style.transform = 'translateY(-2px)';
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
                
                node.style.transform = `
                    translate(${Math.cos(angle) * distance * 5}px, 
                             ${Math.sin(angle) * distance * 5}px)
                    scale(${1 + distance * 0.05})
                `;
            });
            
            node.addEventListener('mouseleave', () => {
                node.style.transform = '';
            });
        });
    }
    
    initiateQuantumTransition() {
        const container = document.querySelector('.quantum-container');
        
        // Quantum fade out effect
        container.style.opacity = '0';
        container.style.transform = 'scale(0.98) translateY(-20px)';
        container.style.transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Metallic flash effect
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
        
        // Navigate after animation
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    }
}

// Initialize Quantum Systems
document.addEventListener('DOMContentLoaded', () => {
    const particleEngine = new QuantumAnimationEngine();
    const materialSimulator = new MetallicMaterialSimulator();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        particleEngine.destroy();
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
`;
document.head.appendChild(quantumStyles);