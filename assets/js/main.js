// main.js - Ferrum Insignia Core JavaScript Engine
// Optimierte Version ohne Slidebar-Generierung

/**
 * Template Loader System
 * Asynchronous component injection architecture with error recovery
 */
class TemplateLoader {
    constructor() {
        this.templateCache = new Map();
        this.loadingPromises = new Map();
        this.loadRetries = new Map();
        this.maxRetries = 3;
        this.retryDelay = 300; // ms
        this.initTimestamp = Date.now();
        this.debug = false;
    }
    
    /**
     * Load template with robust error handling and caching
     * @param {string} path - Template file path
     * @returns {Promise<string>} Template content
     */
    async loadTemplate(path) {
        // Check cache first for optimal performance
        if (this.templateCache.has(path)) {
            this.logDebug(`Cache hit for template: ${path}`);
            return this.templateCache.get(path);
        }
        
        // Check if template is already being loaded to prevent duplicate requests
        if (this.loadingPromises.has(path)) {
            this.logDebug(`Reusing pending request for template: ${path}`);
            return this.loadingPromises.get(path);
        }
        
        // Create new loading promise with retry logic
        const loadPromise = this._loadTemplateWithRetry(path);
        this.loadingPromises.set(path, loadPromise);
        
        try {
            // Await template loading
            const content = await loadPromise;
            
            // Cache successful result
            this.templateCache.set(path, content);
            
            // Remove from loading tracking
            this.loadingPromises.delete(path);
            
            return content;
        } catch (error) {
            // Clean up on terminal failure
            this.loadingPromises.delete(path);
            
            // Resort to fallback content for critical components
            this.logError(`Fatal error loading template: ${path}`, error);
            if (path.includes('header.html')) {
                return this.getHeaderFallback();
            } else if (path.includes('footer.html')) {
                return this.getFooterFallback();
            } else if (path.includes('navigation.html')) {
                return this.getNavigationFallback();
            }
            return '';
        }
    }
    
    /**
     * Internal method to load template with retries
     * @param {string} path - Template file path
     * @returns {Promise<string>} Template content
     * @private
     */
    async _loadTemplateWithRetry(path) {
        // Initialize retry counter if not exists
        if (!this.loadRetries.has(path)) {
            this.loadRetries.set(path, 0);
        }
        
        try {
            const response = await fetch(path, {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Reset retry counter on success
            this.loadRetries.set(path, 0);
            
            return await response.text();
        } catch (error) {
            // Increment retry counter
            const retryCount = this.loadRetries.get(path) + 1;
            this.loadRetries.set(path, retryCount);
            
            // Check if we should retry
            if (retryCount <= this.maxRetries) {
                this.logDebug(`Retry ${retryCount}/${this.maxRetries} for template: ${path}`);
                
                // Exponential backoff
                const delay = this.retryDelay * Math.pow(2, retryCount - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                // Recursive retry
                return this._loadTemplateWithRetry(path);
            }
            
            // Exhausted retries
            throw error;
        }
    }
    
    /**
     * Inject template into container with error boundary
     * @param {string} containerId - Target container ID
     * @param {string} templatePath - Template file path
     * @returns {Promise<boolean>} Success status
     */
    async injectTemplate(containerId, templatePath) {
        // Get container with safety check
        const container = document.getElementById(containerId);
        if (!container) {
            this.logError(`Template container not found: ${containerId}`);
            return false;
        }
        
        try {
            // Load template content
            this.logDebug(`Loading template for ${containerId}: ${templatePath}`);
            const content = await this.loadTemplate(templatePath);
            
            // Inject content
            container.innerHTML = content;
            
            // Apply critical styles immediately if dynamic content has visibility issues
            this._applyImportantStyles(container);
            
            // Initialize any JavaScript within the template
            this._initializeTemplateScripts(container);
            
            // Dispatch custom event for template load completion
            this._dispatchTemplateEvent(containerId, templatePath);
            
            this.logDebug(`Template successfully loaded for ${containerId}`);
            return true;
        } catch (error) {
            this.logError(`Error injecting template: ${containerId}`, error);
            return false;
        }
    }
    
    /**
     * Apply critical styles to ensure template visibility
     * @param {HTMLElement} container - Template container
     * @private
     */
    _applyImportantStyles(container) {
        // Ensure header visibility
        if (container.id === 'header-container') {
            const header = container.querySelector('.quantum-header');
            if (header) {
                // Force header visibility and correct positioning
                header.style.display = 'block';
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.left = '0';
                header.style.width = '100%';
                header.style.zIndex = '1000';
                
                // Critical fix: Immediate visibility
                header.style.opacity = '1';
                header.style.visibility = 'visible';
            }
        }
        
        // Critical fix: Ensure navigation visibility
        if (container.id === 'navigation-container') {
            const navigation = container.querySelector('.quantum-navigation');
            if (navigation) {
                navigation.style.visibility = 'visible';
                navigation.style.opacity = '1';
                
                // Force visibility of navigation items
                const navLinks = navigation.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                });
            }
        }
    }
    
    /**
     * Initialize any JavaScript within loaded template
     * @param {HTMLElement} container - Template container
     * @private
     */
    _initializeTemplateScripts(container) {
        // Execute any inline scripts
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy content
            newScript.textContent = oldScript.textContent;
            
            // Replace old script with new one to trigger execution
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    }
    
    /**
     * Dispatch template load event
     * @param {string} containerId - Container ID
     * @param {string} templatePath - Template path
     * @private
     */
    _dispatchTemplateEvent(containerId, templatePath) {
        const event = new CustomEvent('templateLoaded', {
            bubbles: true,
            detail: { 
                containerId, 
                templatePath,
                timestamp: Date.now(),
                loadTime: Date.now() - this.initTimestamp
            }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Fallback header content
     */
    getHeaderFallback() {
        return `
            <header class="quantum-header">
                <div class="header-backdrop"></div>
                <div class="header-container">
                    <div class="header-logo">
                        <a href="/" class="logo-link">
                            <span class="logo-ferrum">FERRUM</span>
                            <span class="logo-divider-vertical"></span>
                            <span class="logo-insignia">INSIGNIA</span>
                        </a>
                    </div>
                    <div id="navigation-container"></div>
                    <div class="header-actions">
                        <div class="header-language-toggle">
                            <button class="language-btn" data-language="de" data-active="true">DE</button>
                            <span class="language-divider">|</span>
                            <button class="language-btn" data-language="en" data-active="false">EN</button>
                        </div>
                        <button class="header-search" aria-label="Suche">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                        <a href="/login" class="header-login">
                            <span>Login</span>
                            <div class="login-shimmer"></div>
                        </a>
                    </div>
                </div>
            </header>
        `;
    }
    
    /**
     * Fallback navigation content
     */
    getNavigationFallback() {
        return `
            <nav class="quantum-navigation">
                <ul class="nav-primary">
                    <li class="nav-item" data-quantum="hero">
                        <a href="#hero" class="nav-link active">Home</a>
                        <div class="nav-indicator"></div>
                    </li>
                    <li class="nav-item" data-quantum="story">
                        <a href="#story" class="nav-link">Geschichte</a>
                        <div class="nav-indicator"></div>
                    </li>
                    <li class="nav-item" data-quantum="products">
                        <a href="#products" class="nav-link">Produkte</a>
                        <div class="nav-indicator"></div>
                    </li>
                    <li class="nav-item" data-quantum="technology">
                        <a href="#technology" class="nav-link">Technologie</a>
                        <div class="nav-indicator"></div>
                    </li>
                    <li class="nav-item" data-quantum="about">
                        <a href="#about" class="nav-link">Über Uns</a>
                        <div class="nav-indicator"></div>
                    </li>
                    <li class="nav-item" data-quantum="contact">
                        <a href="#contact" class="nav-link">Kontakt</a>
                        <div class="nav-indicator"></div>
                    </li>
                </ul>
                <button class="mobile-nav-trigger" aria-label="Menu">
                    <span class="trigger-line"></span>
                    <span class="trigger-line"></span>
                    <span class="trigger-line"></span>
                </button>
            </nav>
        `;
    }
    
    /**
     * Fallback footer content
     */
    getFooterFallback() {
        return `
            <footer class="quantum-footer">
                <div class="footer-container">
                    <div class="footer-grid">
                        <div class="footer-column footer-brand">
                            <div class="footer-logo">
                                <span class="logo-ferrum">FERRUM</span>
                                <span class="logo-divider-vertical"></span>
                                <span class="logo-insignia">INSIGNIA</span>
                            </div>
                            <p class="footer-tagline">Die Kunst der metallischen Signatur</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-copyright">
                            <p>&copy; 2025 Ferrum Insignia GmbH. Alle Rechte vorbehalten.</p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
    
    /**
     * Debug logging
     * @param {string} message - Log message
     * @private
     */
    logDebug(message) {
        if (this.debug) {
            console.debug(`[TemplateLoader] ${message}`);
        }
    }
    
    /**
     * Error logging
     * @param {string} message - Error message
     * @param {Error} [error] - Error object
     * @private
     */
    logError(message, error) {
        console.error(`[TemplateLoader] ${message}`, error || '');
    }
}

/**
 * Navigation System Controller
 * Optimized implementation without vertical slidebars
 */
class NavigationController {
    constructor() {
        this.sections = [];
        this.navLinks = null;
        this.mobileNavTrigger = null;
        this.mobileNavOverlay = null;
        this.mobileNavClose = null;
        this.eventListeners = new Map(); // Track event listeners for cleanup
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.activeSection = null;
        this.initialized = false;
        this.debug = false;
        
        // Configuration parameters
        this.config = {
            enableSlidebars: false,          // DISABLED: No slidebars
            enableScrollIndicators: false,   // DISABLED: No scroll indicators
            smoothScrollEnabled: true,       // Smooth scrolling is still enabled
            showActiveNavigation: true,      // Show active navigation items
            useIntersectionObserver: true,   // Use IntersectionObserver for performance
            debounceDelay: 150              // Debounce delay for scroll events
        };
        
        // ScrollIndicatorRemover - automatic cleanup function
        this.indicatorRemoverInterval = null;
    }
    
    initialize() {
        // Initialize sections immediately
        this.sections = document.querySelectorAll('section[data-section]');
        
        // Start immediately with the slidebar removal
        this.removeAllScrollIndicators();
        
        // Wait for navigation template to load
        document.addEventListener('templateLoaded', (e) => {
            if (e.detail.containerId === 'navigation-container') {
                this.setupNavigation();
            }
            
            // Special case for header event to ensure visibility
            if (e.detail.containerId === 'header-container') {
                this.ensureHeaderVisibility();
            }
            
            // Always remove indicators after template loading
            this.removeAllScrollIndicators();
        });
        
        // Theme & Language initialization
        this.initializeTheme();
        this.initializeLanguage();
        
        // Setup periodic indicator removal (aggressive approach)
        this.indicatorRemoverInterval = setInterval(() => {
            this.removeAllScrollIndicators();
        }, 1000);
        
        // Mark as initialized
        this.initialized = true;
        this.logDebug('NavigationController initialized');
    }
    
    /**
     * Aggressively remove all scroll indicators and slidebars
     */
    removeAllScrollIndicators() {
        // Comprehensive list of potential slidebar/indicator selectors
        const selectors = [
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
            '.slide-indicator',
            '.slide-bar',
            '[data-scroll-indicator]',
            '[data-slide-indicator]',
            '[class*="scroll-indicator"]',
            '[class*="slide-bar"]',
            '[class*="scroll-progress"]',
            '[id*="scroll-indicator"]'
        ];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.width = '0';
                        el.style.height = '0';
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        
                        // Try to remove the element completely
                        try {
                            el.parentNode.removeChild(el);
                        } catch (e) {
                            // Silently fail if can't remove
                        }
                    }
                });
            } catch (e) {
                // Ignore errors for invalid selectors
            }
        });
        
        // Special handling for hero section
        const heroSection = document.querySelector('.hero-quantum');
        if (heroSection) {
            const heroChildren = heroSection.querySelectorAll('*');
            heroChildren.forEach(child => {
                const className = child.className || '';
                if (typeof className === 'string' && (
                    className.includes('scroll') || 
                    className.includes('indicator') || 
                    className.includes('slide')
                )) {
                    child.style.display = 'none';
                    child.style.visibility = 'hidden';
                    child.style.opacity = '0';
                    
                    // Try to remove the element
                    try {
                        if (child.parentNode) {
                            child.parentNode.removeChild(child);
                        }
                    } catch (e) {
                        // Silently fail if can't remove
                    }
                }
            });
        }
    }
    
    /**
     * Ensure header is visible and properly positioned
     */
    ensureHeaderVisibility() {
        const header = document.querySelector('.quantum-header');
        if (header) {
            // Force critical styles
            header.style.display = 'block';
            header.style.visibility = 'visible';
            header.style.opacity = '1';
            
            // Set proper z-index
            header.style.zIndex = '1000';
            
            // Critical fix: Immediate visibility
            setTimeout(() => {
                header.classList.add('visible');
            }, 50);
            
            this.logDebug('Header visibility ensured');
        }
    }
    
    setupNavigation() {
        // Query all required DOM elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
        this.mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
        this.mobileNavClose = document.querySelector('.mobile-nav-close');
        
        // Ensure navigation visibility - Critical fix
        const nav = document.querySelector('.quantum-navigation');
        if (nav) {
            nav.style.visibility = 'visible';
            nav.style.opacity = '1';
            
            // Critical fix: Ensure nav items are visible
            const navItems = nav.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });
        }
        
        // Bind event handlers
        this.bindEvents();
        
        // Initialize intersection observer for section detection
        if (this.config.useIntersectionObserver) {
            this.initIntersectionObserver();
        }
        
        this.logDebug('Navigation setup complete');
    }
    
    bindEvents() {
        // Desktop navigation
        this.navLinks.forEach(link => {
            if (!link.classList.contains('nav-link-external')) {
                const handler = (e) => this.handleNavClick(e);
                link.addEventListener('click', handler);
                
                // Store reference for cleanup
                this.eventListeners.set(link, {
                    type: 'click',
                    handler: handler
                });
            }
        });
        
        // Mobile navigation
        if (this.mobileNavTrigger) {
            const handler = () => this.toggleMobileNav();
            this.mobileNavTrigger.addEventListener('click', handler);
            this.eventListeners.set(this.mobileNavTrigger, {
                type: 'click',
                handler: handler
            });
        }
        
        // Mobile nav close
        if (this.mobileNavClose) {
            const handler = () => this.closeMobileNav();
            this.mobileNavClose.addEventListener('click', handler);
            this.eventListeners.set(this.mobileNavClose, {
                type: 'click',
                handler: handler
            });
        }
        
        // Mobile nav links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            if (!link.classList.contains('mobile-nav-link-external')) {
                const handler = (e) => {
                    this.handleNavClick(e);
                    this.closeMobileNav();
                };
                link.addEventListener('click', handler);
                this.eventListeners.set(link, {
                    type: 'click',
                    handler: handler
                });
            } else {
                const handler = () => this.closeMobileNav();
                link.addEventListener('click', handler);
                this.eventListeners.set(link, {
                    type: 'click',
                    handler: handler
                });
            }
        });
        
        // Theme toggle
        this.bindThemeToggle();
        
        // Scroll event with debounce
        const scrollHandler = () => this.handleScroll();
        window.addEventListener('scroll', scrollHandler, { passive: true });
        this.eventListeners.set(window, {
            type: 'scroll',
            handler: scrollHandler
        });
        
        // Handle hash in URL for direct navigation
        this.handleInitialHash();
        
        this.logDebug('Event handlers bound');
    }
    
    handleInitialHash() {
        if (window.location.hash) {
            const targetId = window.location.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Wait for page to be fully loaded
                setTimeout(() => {
                    this.smoothScroll(targetElement);
                }, 500);
            }
        }
    }
    
    handleNavClick(e) {
        if (e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            
            // Special handling for home button
            if (targetId === '#hero') {
                const heroSection = document.querySelector(targetId);
                if (heroSection) {
                    this.smoothScroll(heroSection);
                    // Manually update active state for home link
                    this.setActiveNavItem('hero');
                }
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                this.smoothScroll(targetElement);
            }
        }
    }
    
    smoothScroll(target) {
        const headerHeight = document.querySelector('.quantum-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    toggleMobileNav() {
        this.mobileNavTrigger.classList.toggle('active');
        this.mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    }
    
    closeMobileNav() {
        this.mobileNavTrigger.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
    
    initIntersectionObserver() {
        // Base observer options with improved thresholds for reliability
        const options = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: [0.1, 0.5, 0.9] // Multiple thresholds for better precision
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const sectionId = entry.target.getAttribute('data-section');
                    this.setActiveNavItem(sectionId);
                    this.activeSection = sectionId;
                    
                    // Update URL hash without scrolling
                    this.updateUrlHash(sectionId);
                }
            });
        }, options);
        
        this.sections.forEach(section => observer.observe(section));
        
        // Store observer for cleanup
        this.sectionObserver = observer;
    }
    
    updateUrlHash(sectionId) {
        if (history.replaceState) {
            history.replaceState(null, null, `#${sectionId}`);
        } else {
            // Fallback for older browsers
            window.location.hash = sectionId;
        }
    }
    
    setActiveNavItem(sectionId) {
        if (!this.navLinks) return;
        
        this.navLinks.forEach(link => {
            const linkSection = link.getAttribute('href')?.replace('#', '');
            if (linkSection === sectionId || (sectionId === 'hero' && linkSection === 'hero')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update mobile nav active state
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            const linkSection = link.getAttribute('href')?.replace('#', '');
            if (linkSection === sectionId || (sectionId === 'hero' && linkSection === 'hero')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    handleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                const header = document.querySelector('.quantum-header');
                if (header) {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                
                // Update scroll progress if controller exists
                if (window.scrollProgressController && 
                    typeof window.scrollProgressController.updateProgress === 'function') {
                    window.scrollProgressController.updateProgress();
                }
                
                // Remove any scroll indicators that might have been created
                this.removeAllScrollIndicators();
                
                this.isScrolling = false;
            });
            this.isScrolling = true;
        }
    }
    
    // Theme handling
    initializeTheme() {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem('ferrum-theme');
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.enableThemeStylesheet(savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.setAttribute('data-theme', 'light');
            this.enableThemeStylesheet('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.enableThemeStylesheet('dark');
        }
    }
    
    /**
     * Enable the appropriate theme stylesheet
     * @param {string} theme - Theme name ('dark' or 'light')
     */
    enableThemeStylesheet(theme) {
        const darkThemeLink = document.getElementById('theme-dark');
        const lightThemeLink = document.getElementById('theme-light');
        
        if (darkThemeLink && lightThemeLink) {
            if (theme === 'dark') {
                darkThemeLink.removeAttribute('disabled');
                lightThemeLink.setAttribute('disabled', '');
            } else {
                lightThemeLink.removeAttribute('disabled');
                darkThemeLink.setAttribute('disabled', '');
            }
        }
    }
    
    bindThemeToggle() {
        // Select all theme toggle buttons
        const themeToggles = document.querySelectorAll('[data-theme-toggle="true"]');
        
        themeToggles.forEach(toggle => {
            const handler = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                // Update data attribute
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // Enable correct stylesheet
                this.enableThemeStylesheet(newTheme);
                
                // Save preference
                localStorage.setItem('ferrum-theme', newTheme);
                
                // Update theme icons visibility state
                this.updateThemeIcons(newTheme);
            };
            
            toggle.addEventListener('click', handler);
            
            // Store reference for cleanup
            this.eventListeners.set(toggle, {
                type: 'click',
                handler: handler
            });
        });
    }
    
    /**
     * Update theme icon visibility states based on current theme
     * @param {string} theme - Current theme ('dark' or 'light')
     */
    updateThemeIcons(theme) {
        const themeToggles = document.querySelectorAll('[data-theme-toggle="true"]');
        
        themeToggles.forEach(toggle => {
            const lightIcon = toggle.querySelector('.theme-icon-light');
            const darkIcon = toggle.querySelector('.theme-icon-dark');
            
            if (lightIcon && darkIcon) {
                if (theme === 'light') {
                    lightIcon.style.opacity = '1';
                    lightIcon.style.transform = 'translateY(0)';
                    darkIcon.style.opacity = '0';
                    darkIcon.style.transform = 'translateY(-100%)';
                } else {
                    lightIcon.style.opacity = '0';
                    lightIcon.style.transform = 'translateY(100%)';
                    darkIcon.style.opacity = '1';
                    darkIcon.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    // Language handling - Updated for integration with LanguageController
    initializeLanguage() {
        // Defer to language controller if available
        // This is for backwards compatibility
        if (!window.languageController) {
            // Check localStorage or browser language
            const savedLanguage = localStorage.getItem('ferrum-language');
            if (savedLanguage) {
                document.documentElement.setAttribute('lang', savedLanguage);
            } else {
                const browserLang = navigator.language || navigator.userLanguage;
                if (browserLang.startsWith('en')) {
                    document.documentElement.setAttribute('lang', 'en');
                } else {
                    document.documentElement.setAttribute('lang', 'de'); // Default
                }
            }
            
            // Mark active language buttons
            this.updateLanguageButtons();
            
            // Bind language toggle
            this.bindLanguageToggle();
        }
    }
    
    updateLanguageButtons() {
        const currentLang = document.documentElement.getAttribute('lang');
        document.querySelectorAll('.language-btn').forEach(btn => {
            if (btn.getAttribute('data-language') === currentLang) {
                btn.setAttribute('data-active', 'true');
            } else {
                btn.setAttribute('data-active', 'false');
            }
        });
    }
    
    bindLanguageToggle() {
        // Defer to language controller if available
        if (window.languageController) return;
        
        const languageButtons = document.querySelectorAll('.language-btn');
        
        languageButtons.forEach(btn => {
            const handler = () => {
                const language = btn.getAttribute('data-language');
                document.documentElement.setAttribute('lang', language);
                localStorage.setItem('ferrum-language', language);
                this.updateLanguageButtons();
            };
            
            btn.addEventListener('click', handler);
            
            // Store reference for cleanup
            this.eventListeners.set(btn, {
                type: 'click',
                handler: handler
            });
        });
    }
    
    /**
     * Cleanup all event listeners
     */
    destroy() {
        // Clear interval for indicator removal
        if (this.indicatorRemoverInterval) {
            clearInterval(this.indicatorRemoverInterval);
            this.indicatorRemoverInterval = null;
        }
        
        // Cleanup all stored event listeners
        this.eventListeners.forEach((value, element) => {
            element.removeEventListener(value.type, value.handler);
        });
        
        // Clear the event listeners map
        this.eventListeners.clear();
        
        // Disconnect intersection observer
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        // Reset state
        this.initialized = false;
        
        this.logDebug('NavigationController destroyed');
    }
    
    /**
     * Debug logging
     * @param {string} message - Log message
     * @private
     */
    logDebug(message) {
        if (this.debug) {
            console.debug(`[NavigationController] ${message}`);
        }
    }
}

/**
 * Page initializer with optimal execution sequence
 */
class PageInitializer {
    constructor() {
        this.templateLoader = new TemplateLoader();
        this.navigationController = new NavigationController();
        this.loaded = false;
        this.debug = false;
        
        // Forceful scrollbar removal - prevents recreation
        this.removalInterval = null;
    }
    
    /**
     * Initialize page with optimal sequence
     */
    async initialize() {
        this.logDebug('PageInitializer starting');
        
        // Show loader if available
        this.showLoader();
        
        try {
            // Initial cleanup of any existing indicators
            this.removeAllScrollIndicators();
            
            // Start periodic cleaning
            this.startPeriodicCleaning();
            
            // Navigation controller initialization
            this.navigationController.initialize();
            
            // Load critical templates in optimal sequence
            await this.loadCriticalTemplates();
            
            // Wait for templates to complete rendering
            await this.waitForRender();
            
            // Initialize auxiliary components
            this.initAuxiliaryComponents();
            
            // Initialize language controller if available
            if (window.languageController && !window.languageController.initialized) {
                await window.languageController.initialize();
            }
            
            // One more cleanup after initialization
            this.removeAllScrollIndicators();
            
            // Fire page initialization completion event
            this.dispatchInitComplete();
            
            // Mark as loaded
            this.loaded = true;
            
            // Hide loader
            this.hideLoader();
            
            this.logDebug('PageInitializer complete');
        } catch (error) {
            console.error('[PageInitializer] Initialization error:', error);
            
            // Ensure loader is hidden even on error
            this.hideLoader();
        }
    }
    
    /**
     * Aggressive removal of all scroll indicators and slidebars
     */
    removeAllScrollIndicators() {
        // Use navigationController's method if available
        if (this.navigationController) {
            this.navigationController.removeAllScrollIndicators();
        }
        
        // Also use the scrollProgressController if available
        if (window.scrollProgressController && 
            typeof window.scrollProgressController.removeAllScrollIndicators === 'function') {
            window.scrollProgressController.removeAllScrollIndicators();
        }
        
        // Comprehensive list of selectors
        const selectors = [
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
            '[class*="scroll-indicator"]',
            '[class*="slide-indicator"]',
            '[class*="scroll-progress"]',
            '[data-scroll-indicator]'
        ];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        // Fully hide the element
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                        el.style.opacity = '0';
                        el.style.width = '0';
                        el.style.height = '0';
                        el.style.position = 'absolute';
                        el.style.left = '-9999px';
                        
                        // Try to remove it completely
                        try {
                            el.parentNode.removeChild(el);
                        } catch (e) {
                            // Silently fail
                        }
                    }
                });
            } catch (e) {
                // Ignore errors from invalid selectors
            }
        });
    }
    
    /**
     * Start periodic cleaning of scroll indicators
     */
    startPeriodicCleaning() {
        // Clear any existing interval
        if (this.removalInterval) {
            clearInterval(this.removalInterval);
        }
        
        // Set up a new interval to continuously remove indicators
        this.removalInterval = setInterval(() => {
            this.removeAllScrollIndicators();
        }, 1000); // Check every second
    }
    
    /**
     * Show loader if available
     */
    showLoader() {
        if (window.quantumLoader) {
            window.quantumLoader.showLoader();
        }
    }
    
    /**
     * Hide loader
     */
    hideLoader() {
        if (window.quantumLoader) {
            // Show 100% complete before hiding
            window.quantumLoader.setProgress(100, 'Bereit');
            setTimeout(() => window.quantumLoader.hideLoader(), 300);
        }
    }
    
    /**
     * Load critical templates in optimal sequence
     */
    async loadCriticalTemplates() {
        this.logDebug('Loading critical templates');
        
        // Load header first (most visible component)
        await this.templateLoader.injectTemplate('header-container', 'templates/header.html');
        this.logProgress(30);
        
        // Load navigation after header is loaded
        await this.templateLoader.injectTemplate('navigation-container', 'templates/navigation.html');
        this.logProgress(60);
        
        // Load footer last
        await this.templateLoader.injectTemplate('footer-container', 'templates/footer.html');
        this.logProgress(90);
    }
    
    /**
     * Wait for DOM to update and render
     */
    async waitForRender() {
        // Allow browser to process DOM updates
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                // Double RAF ensures rendering is complete
                requestAnimationFrame(resolve);
            });
        });
    }
    
    /**
     * Initialize auxiliary components
     */
    initAuxiliaryComponents() {
        // Reinitialize scroll progress if available
        if (window.scrollProgressController) {
            window.scrollProgressController.reinitialize();
        }
        
        // Ensure header visibility
        const header = document.querySelector('.quantum-header');
        if (header) {
            header.style.display = 'block';
            header.style.visibility = 'visible';
            header.style.opacity = '1';
        }
        
        // Ensure navigation visibility - Critical fix
        const nav = document.querySelector('.quantum-navigation');
        if (nav) {
            nav.style.visibility = 'visible';
            nav.style.opacity = '1';
        }
        
        // Initialize home-nav-link with active state
        const homeNavLink = document.getElementById('home-nav-link');
        if (homeNavLink && !window.location.hash) {
            homeNavLink.classList.add('active');
        }
        
        // Update theme icons according to current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme) {
            this.navigationController.updateThemeIcons(currentTheme);
        }
        
        // Remove all scroll indicators again
        this.removeAllScrollIndicators();
    }
    
    /**
     * Dispatch initialization complete event
     */
    dispatchInitComplete() {
        document.dispatchEvent(new CustomEvent('pageInitComplete', {
            bubbles: true,
            detail: {
                timestamp: Date.now()
            }
        }));
    }
    
    /**
     * Log progress to loader
     * @param {number} progress - Progress percentage 
     */
    logProgress(progress) {
        if (window.quantumLoader) {
            const status = progress < 100 ? 'Laden...' : 'Bereit';
            window.quantumLoader.setProgress(progress, status);
        }
        
        this.logDebug(`Progress: ${progress}%`);
    }
    
    /**
     * Debug logging
     * @param {string} message - Log message
     * @private
     */
    logDebug(message) {
        if (this.debug) {
            console.debug(`[PageInitializer] ${message}`);
        }
    }
}

/**
 * Initialize page with optimal timing
 */
document.addEventListener('DOMContentLoaded', () => {
    const pageInitializer = new PageInitializer();
    pageInitializer.initialize();
    
    // Aggressive cleanup of any scroll indicators
    const removeAllIndicators = () => {
        if (pageInitializer) {
            pageInitializer.removeAllScrollIndicators();
        }
        
        if (window.scrollProgressController && 
            typeof window.scrollProgressController.removeAllScrollIndicators === 'function') {
            window.scrollProgressController.removeAllScrollIndicators();
        }
        
        // Direct element removal
        const selectors = [
            '.scroll-indicator-quantum',
            '.scroll-line',
            '.scroll-beam',
            '.scroll-quantum-indicator',
            '[class*="scroll-indicator"]'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el && el.parentNode) {
                    try {
                        el.parentNode.removeChild(el);
                    } catch (e) {
                        // Silently ignore errors
                    }
                }
            });
        });
    };
    
    // Initial cleanup
    removeAllIndicators();
    
    // Repeat cleanup multiple times to catch any dynamically added elements
    setTimeout(removeAllIndicators, 500);
    setTimeout(removeAllIndicators, 1000);
    setTimeout(removeAllIndicators, 2000);
    
    // Fallback for non-loaded headers after timeout
    setTimeout(() => {
        const header = document.querySelector('.quantum-header');
        if (header && window.getComputedStyle(header).display === 'none') {
            console.warn('Header visibility fix applied after timeout');
            header.style.display = 'block';
            header.style.visibility = 'visible';
            header.style.opacity = '1';
        }
    }, 1000);
    
    // Initialize MutationObserver to watch for new elements
    if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            // Process in batches
            let shouldRemove = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // Check if any added nodes might be scroll indicators
                    Array.from(mutation.addedNodes).forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const className = node.className || '';
                            if (typeof className === 'string' && (
                                className.includes('scroll') || 
                                className.includes('indicator') || 
                                className.includes('slide')
                            )) {
                                shouldRemove = true;
                            }
                        }
                    });
                }
            });
            
            // Run cleanup if needed
            if (shouldRemove) {
                removeAllIndicators();
            }
        });
        
        // Observe the entire document
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
});