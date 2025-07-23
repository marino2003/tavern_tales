// NPC Sprite Animation System
// Helper functies voor het maken en beheren van NPC sprite animaties

/**
 * Creëert een NPC sprite element met de juiste animatie
 * @param {Object} options - Configuratie opties
 * @returns {HTMLElement} Het gecreëerde sprite element
 */
function createNPCSprite(options = {}) {
    const {
        scale = 4,                    // Vergrotingsfactor
        speed = 0.8,                  // Animatie snelheid in seconden
        paused = false,               // Start gepauzeerd
        className = '',               // Extra CSS klasses
        container = null              // Container om sprite aan toe te voegen
    } = options;

    // Creëer sprite element
    const sprite = document.createElement('div');
    sprite.classList.add('npc-sprite');
    
    // Voeg extra klasses toe
    if (className) {
        sprite.classList.add(...className.split(' '));
    }
    
    // Pas schaal aan
    const scaleClass = getScaleClass(scale);
    if (scaleClass) {
        sprite.classList.add(scaleClass);
    } else {
        sprite.style.transform = `scale(${scale})`;
    }
    
    // Pas animatie snelheid aan
    if (speed !== 0.8) {
        sprite.style.animationDuration = `${speed}s`;
    }
    
    // Start gepauzeerd als gevraagd
    if (paused) {
        sprite.classList.add('npc-sprite--paused');
    }
    
    // Voeg toe aan container
    if (container) {
        container.appendChild(sprite);
    }
    
    return sprite;
}

/**
 * Helper functie om de juiste schaal klasse te krijgen
 * @param {number} scale - Gewenste schaal
 * @returns {string|null} CSS klasse naam of null
 */
function getScaleClass(scale) {
    const scaleMap = {
        2: 'npc-sprite--small',
        3: 'npc-sprite--normal', 
        4: 'npc-sprite--large',
        6: 'npc-sprite--xlarge'
    };
    return scaleMap[scale] || null;
}

/**
 * Beheert NPC sprite animaties
 */
class NPCSpriteController {
    constructor(element) {
        this.element = element;
        this.isPlaying = !element.classList.contains('npc-sprite--paused');
    }
    
    // Start animatie
    play() {
        this.element.classList.remove('npc-sprite--paused');
        this.isPlaying = true;
        return this;
    }
    
    // Pauzeer animatie
    pause() {
        this.element.classList.add('npc-sprite--paused');
        this.isPlaying = false;
        return this;
    }
    
    // Toggle play/pause
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this;
    }
    
    // Verander snelheid
    setSpeed(speed) {
        this.element.style.animationDuration = `${speed}s`;
        return this;
    }
    
    // Snelle animatie
    fast() {
        this.element.classList.add('npc-sprite--fast');
        return this;
    }
    
    // Langzame animatie
    slow() {
        this.element.classList.add('npc-sprite--slow');
        return this;
    }
    
    // Reset naar normale snelheid
    normalSpeed() {
        this.element.classList.remove('npc-sprite--fast', 'npc-sprite--slow');
        this.element.style.animationDuration = '';
        return this;
    }
    
    // Verander schaal
    setScale(scale) {
        // Verwijder alle schaal klasses
        this.element.classList.remove(
            'npc-sprite--small', 
            'npc-sprite--normal',
            'npc-sprite--large', 
            'npc-sprite--xlarge'
        );
        
        const scaleClass = getScaleClass(scale);
        if (scaleClass) {
            this.element.classList.add(scaleClass);
            this.element.style.transform = '';
        } else {
            this.element.style.transform = `scale(${scale})`;
        }
        return this;
    }
    
    // Verwijder sprite
    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

/**
 * Convenience functie om direct een gecontroleerde NPC sprite te maken
 * @param {Object} options - Configuratie opties
 * @returns {NPCSpriteController} Controller voor de sprite
 */
function createControlledNPCSprite(options = {}) {
    const sprite = createNPCSprite(options);
    return new NPCSpriteController(sprite);
}

/**
 * Initialiseer alle bestaande NPC sprites op een pagina
 * @param {string} selector - CSS selector voor sprites (default: '.npc-sprite')
 * @returns {NPCSpriteController[]} Array van controllers
 */
function initializeNPCSprites(selector = '.npc-sprite') {
    const sprites = document.querySelectorAll(selector);
    return Array.from(sprites).map(sprite => new NPCSpriteController(sprite));
}

// Export functies voor gebruik in andere scripts
window.NPCSprite = {
    create: createNPCSprite,
    createControlled: createControlledNPCSprite,
    Controller: NPCSpriteController,
    initialize: initializeNPCSprites
};

// Auto-initialiseer als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeNPCSprites();
    });
} else {
    initializeNPCSprites();
} 