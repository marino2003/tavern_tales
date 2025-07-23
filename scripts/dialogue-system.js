/**
 * Herbruikbaar Dialoogsysteem
 * Modulair en efficiënt systeem voor dialoog weergave
 */

class DialogueSystem {
    constructor(options = {}) {
        // Configuratie
        this.typingSpeed = options.typingSpeed || 50;
        this.autoAdvance = options.autoAdvance || false;
        this.skipTypingOnTouch = options.skipTypingOnTouch !== false;
        
        // State
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.currentPage = 0;
        this.isTyping = false;
        this.isShowing = false;
        
        // Text pagination
        this.currentTextPages = [];
        this.maxCharsPerPage = 150; // Aanpasbaar
        
        // Callbacks
        this.onComplete = options.onComplete || null;
        this.onNext = options.onNext || null;
        
        // Initialisatie
        this.initializeElements();
        this.bindEvents();
    }
    
    /**
     * Maak DOM elementen aan
     */
    initializeElements() {
        // Maak overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'dialogue-overlay';
        
        // HTML structuur
        this.overlay.innerHTML = `
            <div class="dialogue-box">
                <div class="dialogue-portrait"></div>
                <div class="dialogue-content">
                    <p class="dialogue-text"></p>
                    <div class="dialogue-continue"></div>
                    <div class="dialogue-pages"></div>
                </div>
            </div>
        `;
        
        // Voeg toe aan body
        document.body.appendChild(this.overlay);
        
        // Referenties naar elementen
        this.box = this.overlay.querySelector('.dialogue-box');
        this.portrait = this.overlay.querySelector('.dialogue-portrait');
        this.textElement = this.overlay.querySelector('.dialogue-text');
        this.continueIndicator = this.overlay.querySelector('.dialogue-continue');
        this.pagesIndicator = this.overlay.querySelector('.dialogue-pages');
    }
    
    /**
     * Bind events
     */
    bindEvents() {
        // Touch en click events voor mobile optimalisatie
        const events = ['click', 'touchstart'];
        
        events.forEach(eventType => {
            this.overlay.addEventListener(eventType, (event) => {
                this.handleInteraction(event);
            }, { passive: false });
        });
        
        // Voorkom ongewenste scroll op mobile
        this.overlay.addEventListener('touchmove', (event) => {
            event.preventDefault();
        }, { passive: false });
        
        // Voorkom zoom op double tap
        let lastTouchEnd = 0;
        this.overlay.addEventListener('touchend', (event) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    /**
     * Verwerk gebruikersinteractie
     */
    handleInteraction(event) {
        if (!this.isShowing) return;
        
        event.preventDefault();
        
        // Skip typing als bezig
        if (this.isTyping) {
            this.completeCurrentText();
            return;
        }
        
        // Ga naar volgende dialoog
        this.nextDialogue();
    }
    
    /**
     * Start een dialoog reeks
     * @param {Array} dialogues - Array van dialoog objecten
     */
    startDialogue(dialogues) {
        if (!Array.isArray(dialogues) || dialogues.length === 0) {
            console.warn('Geen geldige dialogen meegegeven');
            return;
        }
        
        this.currentDialogue = dialogues;
        this.currentIndex = 0;
        this.isShowing = true;
        
        // Toon overlay
        this.overlay.classList.add('show');
        
        // Start eerste dialoog
        this.showCurrentDialogue();
    }
    
    /**
     * Toon huidige dialoog
     */
    showCurrentDialogue() {
        if (!this.currentDialogue || this.currentIndex >= this.currentDialogue.length) {
            this.completeDialogue();
            return;
        }
        
        const dialogue = this.currentDialogue[this.currentIndex];
        
        // Update portret
        this.updatePortrait(dialogue.portrait);
        
        // Personaliseer tekst
        let text = dialogue.text;
        if (window.PlayerData && typeof window.PlayerData.personalize === 'function') {
            text = window.PlayerData.personalize(dialogue.text);
        }
        
        // Split tekst in pagina's
        this.currentTextPages = this.splitTextIntoPages(text);
        this.currentPage = 0;
        
        // Start typing animatie voor eerste pagina
        this.typeCurrentPage();
        
        // Callback
        if (this.onNext) {
            this.onNext(dialogue, this.currentIndex);
        }
    }
    
    /**
     * Update character portret
     * @param {string} portraitPath - Pad naar portret afbeelding
     */
    updatePortrait(portraitPath) {
        if (portraitPath) {
            // Zorg ervoor dat het pad correct is
            const fullPath = portraitPath.startsWith('assets/') ? `../../${portraitPath}` : portraitPath;
            this.portrait.style.backgroundImage = `url(${fullPath})`;
            this.portrait.style.display = 'block';
        } else {
            this.portrait.style.display = 'none';
        }
    }
    
    /**
     * Split tekst in pagina's op basis van beschikbare ruimte
     * @param {string} text - Volledige tekst
     * @returns {Array} Array van tekst pagina's
     */
    splitTextIntoPages(text) {
        const pages = [];
        const words = text.split(' ');
        let currentPage = '';
        
        // Bereken maximale karakters per pagina op basis van beschikbare ruimte
        const maxCharsPerPage = this.calculateMaxCharsPerPage();
        
        for (let word of words) {
            // Check of dit woord past op huidige pagina
            if ((currentPage + ' ' + word).length <= maxCharsPerPage) {
                currentPage += (currentPage ? ' ' : '') + word;
            } else {
                // Start nieuwe pagina
                if (currentPage) {
                    pages.push(currentPage.trim());
                }
                currentPage = word;
            }
        }
        
        // Voeg laatste pagina toe
        if (currentPage) {
            pages.push(currentPage.trim());
        }
        
        return pages.length > 0 ? pages : [text];
    }
    
    /**
     * Bereken maximale karakters per pagina op basis van beschikbare ruimte
     * @returns {number} Maximaal aantal karakters per pagina
     */
    calculateMaxCharsPerPage() {
        // Schatting op basis van box grootte en font
        const boxWidth = this.box.offsetWidth - 120; // Ruimte voor portrait en padding
        const fontSize = parseInt(window.getComputedStyle(this.textElement).fontSize);
        const charsPerLine = Math.floor(boxWidth / (fontSize * 0.6)); // Geschatte karakter breedte
        const linesPerPage = 3; // Maximaal 3 regels per pagina
        
        return charsPerLine * linesPerPage;
    }
    
    /**
     * Update pagina indicator
     */
    updatePagesIndicator() {
        // Verberg pagination volledig
        this.pagesIndicator.style.display = 'none';
    }
    
    /**
     * Type huidige pagina
     */
    typeCurrentPage() {
        if (this.currentPage >= this.currentTextPages.length) {
            this.completeCurrentText();
            return;
        }
        
        const pageText = this.currentTextPages[this.currentPage];
        this.typeText(pageText);
        
        // Update pagina indicator
        this.updatePagesIndicator();
    }
    
    /**
     * Type tekst animatie
     * @param {string} text - Te tonen tekst
     */
    typeText(text) {
        this.isTyping = true;
        this.textElement.textContent = '';
        this.textElement.classList.add('typing');
        this.continueIndicator.style.display = 'none';
        
        let currentChar = 0;
        let displayedText = '';
        
        const typeNextChar = () => {
            if (currentChar < text.length) {
                displayedText += text[currentChar];
                this.textElement.textContent = displayedText;
                currentChar++;
                
                // Scroll naar beneden
                this.textElement.scrollTop = this.textElement.scrollHeight;
                
                this.typingInterval = setTimeout(typeNextChar, this.typingSpeed);
            } else {
                this.completeCurrentPage();
            }
        };
        
        typeNextChar();
    }
    
    /**
     * Voltooi huidige pagina
     */
    completeCurrentPage() {
        // Stop typing animatie als bezig
        if (this.typingInterval) {
            clearTimeout(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.isTyping = false;
        this.textElement.classList.remove('typing');
        
        // Toon volledige tekst van huidige pagina
        this.textElement.textContent = this.currentTextPages[this.currentPage];
        
        // Toon continue indicator
        this.continueIndicator.style.display = 'block';
    }
    
    /**
     * Voltooi huidige tekst (alle pagina's)
     */
    completeCurrentText() {
        // Stop typing animatie als bezig
        if (this.typingInterval) {
            clearTimeout(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.isTyping = false;
        this.textElement.classList.remove('typing');
        
        // Toon volledige tekst van huidige pagina
        this.textElement.textContent = this.currentTextPages[this.currentPage];
        
        // Toon continue indicator (subtiele visuele indicator)
        this.continueIndicator.style.display = 'block';
        
        // Verberg op laatste dialoog
        if (this.currentIndex >= this.currentDialogue.length - 1) {
            this.continueIndicator.style.display = 'none';
            
            // Auto close
            if (this.autoAdvance) {
                setTimeout(() => this.completeDialogue(), 2000);
            }
        }
    }
    
    /**
     * Ga naar volgende pagina of dialoog
     */
    nextDialogue() {
        if (this.isTyping) return;
        
        // Check of er meer pagina's zijn in huidige dialoog
        if (this.currentPage < this.currentTextPages.length - 1) {
            this.currentPage++;
            this.typeCurrentPage();
            return;
        }
        
        // Ga naar volgende dialoog
        this.currentIndex++;
        this.showCurrentDialogue();
    }
    
    /**
     * Voltooi dialoog reeks
     */
    completeDialogue() {
        this.isShowing = false;
        this.overlay.classList.remove('show');
        
        // Callback
        if (this.onComplete) {
            this.onComplete();
        }
        
        // Reset
        setTimeout(() => {
            this.currentDialogue = null;
            this.currentIndex = 0;
            this.currentPage = 0;
            this.currentTextPages = [];
        }, 300);
    }
    
    /**
     * Stop dialoog
     */
    stopDialogue() {
        // Stop typing animatie als bezig
        if (this.typingInterval) {
            clearTimeout(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.isShowing = false;
        this.overlay.classList.remove('show');
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.currentPage = 0;
        this.currentTextPages = [];
    }
    
    /**
     * Check of dialoog actief is
     */
    isActive() {
        return this.isShowing;
    }
    
    /**
     * Stel typing snelheid in
     */
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
    }
    
    /**
     * Vernietig systeem
     */
    destroy() {
        // Stop typing animatie als bezig
        if (this.typingInterval) {
            clearTimeout(this.typingInterval);
            this.typingInterval = null;
        }
        
        this.stopDialogue();
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

/**
 * Globale instance
 */
let gameDialogue = null;

/**
 * Initialiseer dialoog systeem
 */
function initDialogueSystem(options = {}) {
    if (gameDialogue) {
        gameDialogue.destroy();
    }
    
    gameDialogue = new DialogueSystem(options);
    return gameDialogue;
}

/**
 * Toon dialoog (helper functie)
 * @param {Array|Object} dialogues - Dialoog data
 * @param {Object} options - Extra opties
 */
function showDialogue(dialogues, options = {}) {
    // Maak nieuwe instance als er geen bestaat of als er opties zijn
    if (!gameDialogue || Object.keys(options).length > 0) {
        initDialogueSystem(options);
    }
    
    // Converteer enkele dialoog naar array
    if (!Array.isArray(dialogues)) {
        dialogues = [dialogues];
    }
    
    gameDialogue.startDialogue(dialogues);
    return gameDialogue;
}

/**
 * Maak dialoog object (helper)
 * @param {string} character - Character naam
 * @param {string} text - Dialoog tekst
 * @param {string} portrait - Portret pad (optioneel)
 */
function createDialogue(character, text, portrait = null) {
    return {
        character: character,
        text: text,
        portrait: portrait
    };
}

/**
 * Vooraf gedefinieerde characters
 */
const Characters = {
    HERO: '../../assets/spritesheets/hero_main/Combat Ready Idle.png',
    WARRIOR: '../../assets/spritesheets/npc_1/spritesheet.png',
    HERP: '../../assets/character_port/herp.png',
    NPC: '../../assets/character_port/npc.png'
};

// Export voor gebruik in andere scripts
window.DialogueSystem = {
    DialogueSystem,
    initDialogueSystem,
    showDialogue,
    createDialogue,
    Characters,
    
    // Toegang tot actieve instance
    get current() {
        return gameDialogue;
    }
};

// Auto-initialiseer als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Alleen initialiseren als er nog geen instance is
        if (!gameDialogue) {
            initDialogueSystem();
        }
    });
} else {
    // Alleen initialiseren als er nog geen instance is
    if (!gameDialogue) {
        initDialogueSystem();
    }
} 