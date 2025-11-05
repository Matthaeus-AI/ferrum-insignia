/**
 * language.js - Ferrum Insignia Internationalization System
 * 
 * Ein hochoptimiertes Internationalisierungsmodul, das:
 * 1. Sprachumschaltung mit Persistenz über LocalStorage implementiert
 * 2. Übersetzungsdateien asynchron lädt
 * 3. DOM-Elemente mit minimaler Reflow-Operation aktualisiert
 * 4. Browserkompatibel arbeitet und das System-Locale berücksichtigt
 */

class LanguageController {
    /**
     * Initialisiert das Sprachsystem mit optimaler Konfiguration
     * @constructor
     */
    constructor() {
        // Kerneigenschaften
        this.currentLanguage = 'de'; // Default Deutsch
        this.supportedLanguages = ['de', 'en']; // Unterstützte Sprachen
        this.translations = new Map(); // Map für bessere Lookup-Performance
        this.loadingPromises = new Map(); // Aktive Lade-Operationen cachen
        this.initialized = false;
        this.dataAttributeName = 'data-i18n'; // DOM-Selector für Übersetzungselemente
        
        // Performance-Optimierungen
        this.cacheDOM = true; // DOM-Caching für bessere Performance
        this.domCache = null; // Speichert übersetzte Elemente
        this.batchDOMUpdates = true; // Batching von DOM-Updates für Reflow-Optimierung
        this.useRequestAnimationFrame = true; // Nutzt requestAnimationFrame für DOM-Updates
        
        // Konfiguration
        this.storageKey = 'ferrum-language'; // LocalStorage-Schlüssel
        this.autoLoadTranslations = true; // Automatisches Laden von Übersetzungen
        this.fallbackLanguage = 'de'; // Fallback bei fehlenden Übersetzungen
        this.debug = false; // Debug-Logging
    }
    
    /**
     * Initialisiert das Sprachsystem mit automatischer Erkennung
     * @returns {Promise<void>}
     */
    async initialize() {
        // Verhindere Mehrfachinitialisierung
        if (this.initialized) return;
        
        try {
            // 1. Gespeicherte Sprache aus LocalStorage prüfen
            const savedLanguage = localStorage.getItem(this.storageKey);
            
            if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
                this.currentLanguage = savedLanguage;
            } else {
                // 2. Browser-Einstellung prüfen
                const browserLang = navigator.language || navigator.userLanguage;
                const langCode = browserLang.split('-')[0].toLowerCase();
                
                if (this.supportedLanguages.includes(langCode)) {
                    this.currentLanguage = langCode;
                }
            }
            
            // 3. HTML-lang-Attribut setzen
            document.documentElement.setAttribute('lang', this.currentLanguage);
            
            // 4. Übersetzungsdatei laden
            if (this.autoLoadTranslations) {
                await this.loadTranslations(this.currentLanguage);
            }
            
            // 5. DOM aktualisieren
            this.updateDOM();
            
            // 6. Event-Handler für Sprachumschaltung einrichten
            this.bindLanguageToggle();
            
            // 7. Event-Listener für dynamisch geladene Inhalte
            document.addEventListener('templateLoaded', () => this.updateDOM());
            
            this.initialized = true;
            this.logDebug(`Sprachsystem initialisiert mit ${this.currentLanguage}`);
            
            // 8. Sprachumschaltungsbuttons aktualisieren
            this.updateLanguageButtons();
        } catch (error) {
            console.error('[LanguageController] Initialisierungsfehler:', error);
        }
    }
    
    /**
     * Lädt Übersetzungsdateien mit effizienter Caching-Strategie
     * @param {string} language - Sprachcode
     * @returns {Promise<object>} - Übersetzungsdaten
     */
    async loadTranslations(language) {
        // Prüfe ob bereits im Cache
        if (this.translations.has(language)) {
            return this.translations.get(language);
        }
        
        // Prüfe ob bereits am Laden
        if (this.loadingPromises.has(language)) {
            return this.loadingPromises.get(language);
        }
        
        // Lade Übersetzungen asynchron
        const loadPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`assets/i18n/${language}.json?v=${Date.now()}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const translations = await response.json();
                this.translations.set(language, translations);
                
                // Entfernen aus loading-Tracker
                this.loadingPromises.delete(language);
                
                this.logDebug(`Übersetzungen für ${language} geladen`);
                resolve(translations);
            } catch (error) {
                this.logDebug(`Fehler beim Laden der Übersetzungen für ${language}:`, error);
                this.loadingPromises.delete(language);
                reject(error);
            }
        });
        
        // Loading-Promise cachen
        this.loadingPromises.set(language, loadPromise);
        return loadPromise;
    }
    
    /**
     * Wechselt die Sprache mit optimierter DOM-Aktualisierung
     * @param {string} language - Neuer Sprachcode
     * @returns {Promise<boolean>} - Erfolg der Umschaltung
     */
    async changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            this.logDebug(`Sprache ${language} wird nicht unterstützt`);
            return false;
        }
        
        if (language === this.currentLanguage) {
            this.logDebug(`Sprache ist bereits ${language}`);
            return true;
        }
        
        try {
            // 1. Übersetzungen laden
            await this.loadTranslations(language);
            
            // 2. Sprache im DOM aktualisieren
            this.currentLanguage = language;
            document.documentElement.setAttribute('lang', language);
            
            // 3. DOM-Elemente aktualisieren
            this.updateDOM();
            
            // 4. Sprache im LocalStorage speichern
            localStorage.setItem(this.storageKey, language);
            
            // 5. Language-Buttons aktualisieren
            this.updateLanguageButtons();
            
            // 6. Benutzerdefiniertes Event auslösen
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language }
            }));
            
            this.logDebug(`Sprache geändert auf ${language}`);
            return true;
        } catch (error) {
            console.error(`[LanguageController] Fehler beim Ändern der Sprache auf ${language}:`, error);
            return false;
        }
    }
    
    /**
     * Aktualisiert DOM-Elemente mit optimalen Batching-Techniken
     */
    updateDOM() {
        // Prüfe ob Übersetzungen verfügbar sind
        if (!this.translations.has(this.currentLanguage)) {
            this.logDebug(`Keine Übersetzungen für ${this.currentLanguage} verfügbar`);
            return;
        }
        
        const translations = this.translations.get(this.currentLanguage);
        
        // Performante DOM-Aktualisierung mit RAF
        if (this.useRequestAnimationFrame) {
            window.requestAnimationFrame(() => this._processDOMUpdate(translations));
        } else {
            this._processDOMUpdate(translations);
        }
    }
    
    /**
     * Prozessiert DOM-Updates mit Optimierungen für Layout-Thrashing
     * @param {object} translations - Übersetzungsobjekt
     * @private
     */
    _processDOMUpdate(translations) {
        // Finde alle übersetzbaren Elemente
        const elements = document.querySelectorAll(`[${this.dataAttributeName}]`);
        
        // DOM-Caching für bessere Performance
        if (this.cacheDOM && !this.domCache) {
            this.domCache = Array.from(elements);
        }
        
        const elementsToUpdate = this.cacheDOM ? this.domCache : elements;
        
        // Batch DOM-Operationen
        let readOperations = [];
        let writeOperations = [];
        
        // 1. Lese-Phase (DOM-Metriken, Attribute)
        elementsToUpdate.forEach(element => {
            const key = element.getAttribute(this.dataAttributeName);
            if (!key) return;
            
            readOperations.push({
                element,
                key,
                currentText: element.textContent
            });
        });
        
        // 2. Schreib-Phase (DOM-Änderungen)
        readOperations.forEach(op => {
            const translationText = this.getTranslation(op.key, translations);
            if (translationText && translationText !== op.currentText) {
                writeOperations.push(() => {
                    element.textContent = translationText;
                });
            }
        });
        
        // 3. Ausführen der Schreiboperationen
        if (this.batchDOMUpdates) {
            // Alle Schreiboperationen in einem einzigen Frame
            writeOperations.forEach(writeOp => writeOp());
        } else {
            // Verteile Operationen auf mehrere Frames für sanftere Übergänge
            this._scheduleWriteOperations(writeOperations);
        }
    }
    
    /**
     * Verteilt Schreiboperationen auf mehrere Frames für progressives DOM-Update
     * @param {Function[]} operations - Array von Schreiboperationen
     * @private
     */
    _scheduleWriteOperations(operations) {
        const batchSize = 5; // Optimale Batch-Größe
        
        for (let i = 0; i < operations.length; i += batchSize) {
            const batch = operations.slice(i, i + batchSize);
            
            setTimeout(() => {
                window.requestAnimationFrame(() => {
                    batch.forEach(op => op());
                });
            }, Math.floor(i / batchSize) * 16); // ~16ms pro Frame (60fps)
        }
    }
    
    /**
     * Ermittelt die Übersetzung für einen Schlüssel mit Dot-Notation-Support
     * @param {string} key - Übersetzungsschlüssel mit Dot-Notation
     * @param {object} translations - Übersetzungsobjekt
     * @returns {string|null} - Übersetzer Text oder null wenn nicht gefunden
     */
    getTranslation(key, translations) {
        // Dot-Notation-Support: 'nav.home' -> translations.nav.home
        const parts = key.split('.');
        let result = translations;
        
        for (const part of parts) {
            if (result && typeof result === 'object' && part in result) {
                result = result[part];
            } else {
                // Fallback auf Standardsprache versuchen
                if (this.fallbackLanguage !== this.currentLanguage && 
                    this.translations.has(this.fallbackLanguage)) {
                    
                    return this.getTranslationFromFallback(key);
                }
                
                this.logDebug(`Übersetzungsschlüssel nicht gefunden: ${key}`);
                return null;
            }
        }
        
        return typeof result === 'string' ? result : null;
    }
    
    /**
     * Versucht eine Übersetzung aus der Fallback-Sprache zu laden
     * @param {string} key - Übersetzungsschlüssel
     * @returns {string|null} - Übersetzung aus Fallback oder null
     * @private
     */
    getTranslationFromFallback(key) {
        const fallbackTranslations = this.translations.get(this.fallbackLanguage);
        if (!fallbackTranslations) return null;
        
        const parts = key.split('.');
        let result = fallbackTranslations;
        
        for (const part of parts) {
            if (result && typeof result === 'object' && part in result) {
                result = result[part];
            } else {
                return null;
            }
        }
        
        return typeof result === 'string' ? result : null;
    }
    
    /**
     * Bindet Event-Handler für die Sprachumschaltung
     */
    bindLanguageToggle() {
        // Desktop-Sprachumschalter
        const headerLanguageButtons = document.querySelectorAll('.header-language-toggle .language-btn');
        
        headerLanguageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const language = button.getAttribute('data-language');
                this.changeLanguage(language);
            });
        });
        
        // Mobile-Sprachumschalter
        const mobileLanguageButtons = document.querySelectorAll('.mobile-language-toggle .language-btn');
        
        mobileLanguageButtons.forEach(button => {
            button.addEventListener('click', () => {
                const language = button.getAttribute('data-language');
                this.changeLanguage(language);
            });
        });
    }
    
    /**
     * Aktualisiert den Status der Sprachumschaltungsbuttons
     */
    updateLanguageButtons() {
        // Desktop-Sprachumschalter
        document.querySelectorAll('.language-btn').forEach(btn => {
            const buttonLang = btn.getAttribute('data-language');
            
            if (buttonLang === this.currentLanguage) {
                btn.setAttribute('data-active', 'true');
            } else {
                btn.setAttribute('data-active', 'false');
            }
        });
    }
    
    /**
     * Debug-Logging-Methode zur Fehleranalyse
     * @param {string} message - Debug-Nachricht
     * @param {*} [data] - Optionale Debug-Daten
     * @private
     */
    logDebug(message, data) {
        if (this.debug) {
            if (data) {
                console.debug(`[LanguageController] ${message}`, data);
            } else {
                console.debug(`[LanguageController] ${message}`);
            }
        }
    }
}

// Initialisiere einzelne Instanz für bessere Ressourcennutzung
window.languageController = new LanguageController();

// Initialisierung nach DOM-Ready
document.addEventListener('DOMContentLoaded', () => {
    window.languageController.initialize();
});