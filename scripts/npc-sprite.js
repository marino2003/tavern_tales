
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


function getScaleClass(scale) {
    const scaleMap = {
        2: 'npc-sprite--small',
        3: 'npc-sprite--normal', 
        4: 'npc-sprite--large',
        6: 'npc-sprite--xlarge'
    };
    return scaleMap[scale] || null;
}


class NPCSpriteController {
    constructor(element) {
        this.element = element;
        this.isPlaying = !element.classList.contains('npc-sprite--paused');
    }
    

    play() {
        this.element.classList.remove('npc-sprite--paused');
        this.isPlaying = true;
        return this;
    }
    

    pause() {
        this.element.classList.add('npc-sprite--paused');
        this.isPlaying = false;
        return this;
    }
    

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
        return this;
    }
    

    setSpeed(speed) {
        this.element.style.animationDuration = `${speed}s`;
        return this;
    }
    

    fast() {
        this.element.classList.add('npc-sprite--fast');
        return this;
    }
    

    slow() {
        this.element.classList.add('npc-sprite--slow');
        return this;
    }
    

    normalSpeed() {
        this.element.classList.remove('npc-sprite--fast', 'npc-sprite--slow');
        this.element.style.animationDuration = '';
        return this;
    }
    

    setScale(scale) {

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
    

    remove() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}


function createControlledNPCSprite(options = {}) {
    const sprite = createNPCSprite(options);
    return new NPCSpriteController(sprite);
}


function initializeNPCSprites(selector = '.npc-sprite') {
    const sprites = document.querySelectorAll(selector);
    return Array.from(sprites).map(sprite => new NPCSpriteController(sprite));
}


window.NPCSprite = {
    create: createNPCSprite,
    createControlled: createControlledNPCSprite,
    Controller: NPCSpriteController,
    initialize: initializeNPCSprites
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeNPCSprites();
    });
} else {
    initializeNPCSprites();
} 