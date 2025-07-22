// Dialoog Systeem voor Mobile Game
// Ondersteunt typing animatie, portretten en mobile interactie

class DialogueSystem {
    constructor(options = {}) {
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.isTyping = false;
        this.isShowing = false;
        this.typingSpeed = options.typingSpeed || 50; // milliseconden per karakter
        this.autoAdvance = options.autoAdvance || false;
        this.skipTypingOnTouch = options.skipTypingOnTouch !== false;
        
        // Callbacks
        this.onComplete = options.onComplete || null;
        this.onNext = options.onNext || null;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        console.log('DialogueSystem: Initializing elements...');
        
        // Maak dialoog overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'dialogue-overlay';
        this.overlay.innerHTML = `
            <div class="dialogue-box">
                <div class="dialogue-portrait"></div>
                <div class="dialogue-content">
                    <p class="dialogue-text"></p>
                    <div class="dialogue-continue"></div>
                </div>
            </div>
        `;
        
        console.log('DialogueSystem: Overlay element created');
        
        // Voeg toe aan body
        if (document.body) {
            document.body.appendChild(this.overlay);
            console.log('DialogueSystem: Overlay added to body');
        } else {
            console.error('DialogueSystem: document.body not available!');
            return;
        }
        
        // Referenties naar elementen
        this.box = this.overlay.querySelector('.dialogue-box');
        this.portrait = this.overlay.querySelector('.dialogue-portrait');
        this.textElement = this.overlay.querySelector('.dialogue-text');
        this.continueIndicator = this.overlay.querySelector('.dialogue-continue');
        
        console.log('DialogueSystem: Element references created', {
            box: !!this.box,
            portrait: !!this.portrait,
            textElement: !!this.textElement,
            continueIndicator: !!this.continueIndicator
        });
    }
    
    bindEvents() {
        // Klik/touch events voor doorgang
        this.overlay.addEventListener('click', (e) => this.handleInteraction(e));
        this.overlay.addEventListener('touchend', (e) => this.handleInteraction(e));
        
        // Keyboard ondersteuning
        document.addEventListener('keydown', (e) => {
            if (this.isShowing && (e.key === 'Space' || e.key === 'Enter')) {
                e.preventDefault();
                this.handleInteraction(e);
            }
        });
    }
    
    handleInteraction(event) {
        if (!this.isShowing) return;
        
        event.preventDefault();
        
        // Als we aan het typen zijn, skip typing
        if (this.isTyping && this.skipTypingOnTouch) {
            this.completeCurrentText();
            return;
        }
        
        // Anders ga naar volgende dialoog
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
        
        // Toon overlay met animatie
        this.overlay.classList.add('show');
        
        // Start eerste dialoog
        this.showCurrentDialogue();
    }
    
    showCurrentDialogue() {
        if (!this.currentDialogue || this.currentIndex >= this.currentDialogue.length) {
            this.completeDialogue();
            return;
        }
        
        const dialogue = this.currentDialogue[this.currentIndex];
        
        // Update portret
        if (dialogue.portrait) {
            this.portrait.style.backgroundImage = `url(${dialogue.portrait})`;
            this.portrait.style.display = 'block';
        } else {
            this.portrait.style.display = 'none';
        }
        
        // Personaliseer de tekst door {PLAYER} te vervangen met de speler naam
        let personalizedText = dialogue.text;
        if (window.PlayerData && typeof window.PlayerData.personalize === 'function') {
            personalizedText = window.PlayerData.personalize(dialogue.text);
        }
        
        // Start typing animatie met gepersonaliseerde tekst
        this.typeText(personalizedText);
        
        // Callback voor nieuwe dialoog
        if (this.onNext) {
            this.onNext(dialogue, this.currentIndex);
        }
    }
    
    typeText(text) {
        this.isTyping = true;
        this.textElement.textContent = '';
        this.textElement.classList.add('typing');
        this.continueIndicator.style.display = 'none';
        
        let currentChar = 0;
        
        const typeNextChar = () => {
            if (currentChar < text.length) {
                this.textElement.textContent += text[currentChar];
                currentChar++;
                
                // Scroll naar beneden als nodig
                this.textElement.scrollTop = this.textElement.scrollHeight;
                
                setTimeout(typeNextChar, this.typingSpeed);
            } else {
                // Typing voltooid
                this.completeCurrentText();
            }
        };
        
        typeNextChar();
    }
    
    completeCurrentText() {
        this.isTyping = false;
        this.textElement.classList.remove('typing');
        this.continueIndicator.style.display = 'block';
        
        // Als dit de laatste dialoog is, verberg continue indicator
        if (this.currentIndex >= this.currentDialogue.length - 1) {
            this.continueIndicator.style.display = 'none';
            
            // Auto close na laatste dialoog
            if (this.autoAdvance) {
                setTimeout(() => this.completeDialogue(), 2000);
            }
        }
    }
    
    nextDialogue() {
        if (this.isTyping) return;
        
        this.currentIndex++;
        this.showCurrentDialogue();
    }
    
    completeDialogue() {
        this.isShowing = false;
        this.overlay.classList.remove('show');
        
        // Callback voor voltooide dialoog
        if (this.onComplete) {
            this.onComplete();
        }
        
        // Reset voor volgende keer
        setTimeout(() => {
            this.currentDialogue = null;
            this.currentIndex = 0;
        }, 300);
    }
    
    /**
     * Stop de huidige dialoog voortijdig
     */
    stopDialogue() {
        if (this.isShowing) {
            this.completeDialogue();
        }
    }
    
    /**
     * Check of dialoog momenteel actief is
     */
    isActive() {
        return this.isShowing;
    }
    
    /**
     * Verander typing snelheid
     */
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
    }
    
    /**
     * Vernietig de dialoog component
     */
    destroy() {
        if (this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

// Globale dialoog manager instance
let gameDialogue = null;

/**
 * Initialiseer het dialoog systeem
 */
function initDialogueSystem(options = {}) {
    if (gameDialogue) {
        gameDialogue.destroy();
    }
    
    gameDialogue = new DialogueSystem(options);
    
    console.log('Dialoog systeem geïnitialiseerd');
    return gameDialogue;
}

/**
 * Helper functie om snel een dialoog te starten
 * @param {Array|Object} dialogues - Dialoog data
 * @param {Object} options - Extra opties
 */
function showDialogue(dialogues, options = {}) {
    console.log('showDialogue aangeroepen met:', { dialogues, options });
    
    if (!gameDialogue) {
        console.log('Geen gameDialogue instance, initialiseren...');
        initDialogueSystem(options);
    }
    
    // Converteer enkele dialoog naar array
    if (!Array.isArray(dialogues)) {
        dialogues = [dialogues];
    }
    
    console.log('Dialogen voorbereid:', dialogues);
    console.log('gameDialogue instance:', gameDialogue);
    
    try {
        gameDialogue.startDialogue(dialogues);
        console.log('startDialogue succesvol aangeroepen');
    } catch (error) {
        console.error('Fout in startDialogue:', error);
    }
    
    return gameDialogue;
}

/**
 * Voorgedefinieerde karakters met portretten
 */
const Characters = {
    HERO: {
        name: 'Hero',
        portrait: 'assets/character_port/herp.png'
    },
    WARRIOR: {
        name: 'Warrior',
        portrait: '../../assets/spritesheets/npc_1/portrait.png' // Deze moet je nog maken
    },
    NARRATOR: {
        name: 'Narrator',
        portrait: null // Geen portret voor narrator
    }
};

/**
 * Helper functie om dialogen te maken met karakters
 */
function createDialogue(character, text) {
    return {
        text: text,
        portrait: character.portrait,
        speaker: character.name
    };
}

// Export voor gebruik in andere scripts
window.DialogueSystem = {
    DialogueSystem,
    initDialogueSystem,
    showDialogue,
    Characters,
    createDialogue,
    
    // Toegang tot actieve instance
    get current() {
        return gameDialogue;
    }
};

// Auto-initialiseer als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDialogueSystem();
    });
} else {
    initDialogueSystem();
} 