
function createHeroSprite(options = {}) {
    const {
        scale = 4,                    // Vergrotingsfactor
        speed = 0.8,                  // Animatie snelheid in seconden
        paused = false,               // Start gepauzeerd
        className = '',               // Extra CSS klasses
        container = null              // Container om sprite aan toe te voegen
    } = options;

    // Creëer sprite element
    const sprite = document.createElement('div');
    sprite.classList.add('hero-sprite');
    
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
        sprite.classList.add('hero-sprite--paused');
    }
    
    // Voeg toe aan container
    if (container) {
        container.appendChild(sprite);
    }
    
    return sprite;
}


function getScaleClass(scale) {
    const scaleMap = {
        2: 'hero-sprite--small',
        3: 'hero-sprite--normal', 
        4: 'hero-sprite--large',
        6: 'hero-sprite--xlarge'
    };
    return scaleMap[scale] || null;
}


class HeroSpriteController {
    constructor(element) {
        this.element = element;
        this.isPlaying = !element.classList.contains('hero-sprite--paused');
    }
    

    play() {
        this.element.classList.remove('hero-sprite--paused');
        this.isPlaying = true;
        return this;
    }
    

    pause() {
        this.element.classList.add('hero-sprite--paused');
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
        this.element.classList.add('hero-sprite--fast');
        return this;
    }
    

    slow() {
        this.element.classList.add('hero-sprite--slow');
        return this;
    }
    

    normalSpeed() {
        this.element.classList.remove('hero-sprite--fast', 'hero-sprite--slow');
        this.element.style.animationDuration = '';
        return this;
    }
    

    setScale(scale) {

        this.element.classList.remove(
            'hero-sprite--small', 
            'hero-sprite--normal',
            'hero-sprite--large', 
            'hero-sprite--xlarge'
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


function createControlledHeroSprite(options = {}) {
    const sprite = createHeroSprite(options);
    return new HeroSpriteController(sprite);
}


function initializeHeroSprites(selector = '.hero-sprite') {
    const sprites = document.querySelectorAll(selector);
    return Array.from(sprites).map(sprite => new HeroSpriteController(sprite));
}


window.HeroSprite = {
    create: createHeroSprite,
    createControlled: createControlledHeroSprite,
    Controller: HeroSpriteController,
    initialize: initializeHeroSprites
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeHeroSprites();
    });
} else {
    initializeHeroSprites();
} 