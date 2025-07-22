// Warrior Sprite Animation System
// Helper functies voor het maken en beheren van warrior sprite animaties

/**
 * Creëert een warrior sprite element met de juiste animatie
 * @param {Object} options - Configuratie opties
 * @returns {HTMLElement} Het gecreëerde sprite element
 */
function createWarriorSprite(options = {}) {
    const {
        scale = 4,                    // Vergrotingsfactor
        speed = 1.0,                  // Animatie snelheid in seconden
        paused = false,               // Start gepauzeerd
        className = '',               // Extra CSS klasses
        container = null,             // Container om sprite aan toe te voegen
        mirrored = true               // Voor gespiegelde spritesheet
    } = options;

    console.log('createWarriorSprite aangeroepen met opties:', { scale, speed, paused, className, container, mirrored });

    // Creëer sprite element
    const sprite = document.createElement('div');
    sprite.classList.add('warrior-sprite');
    
    console.log('Sprite element gecreëerd:', sprite);
    
    // Voeg extra klasses toe
    if (className) {
        sprite.classList.add(...className.split(' '));
        console.log('Klasses toegevoegd:', className);
    }
    
    // Pas schaal aan
    const scaleClass = getWarriorScaleClass(scale);
    if (scaleClass) {
        sprite.classList.add(scaleClass);
        console.log('Schaal klasse toegevoegd:', scaleClass);
    } else {
        sprite.style.transform = `scale(${scale})`;
        console.log('Custom schaal toegepast:', scale);
    }
    
    // Voor gespiegelde spritesheet: gebruik custom animatie
    if (mirrored) {
        console.log('Starten van gespiegelde animatie...');
        // Zet CSS animatie uit
        sprite.style.animation = 'none';
        
        // Start custom frame animatie
        startMirroredWarriorAnimation(sprite, speed, paused);
    } else {
        console.log('Normale CSS animatie gebruiken');
        // Pas animatie snelheid aan
        if (speed !== 1.0) {
            sprite.style.animationDuration = `${speed}s`;
        }
        
        // Start gepauzeerd als gevraagd
        if (paused) {
            sprite.classList.add('warrior-sprite--paused');
        }
    }
    
    // Voeg toe aan container
    if (container) {
        container.appendChild(sprite);
        console.log('Sprite toegevoegd aan container');
    }
    
    console.log('Warrior sprite volledig gecreëerd:', sprite);
    return sprite;
}

/**
 * Helper functie om de juiste schaal klasse te krijgen
 * @param {number} scale - Gewenste schaal
 * @returns {string|null} CSS klasse naam of null
 */
function getWarriorScaleClass(scale) {
    const scaleMap = {
        2: 'warrior-sprite--small',
        3: 'warrior-sprite--normal', 
        4: 'warrior-sprite--large',
        6: 'warrior-sprite--xlarge'
    };
    return scaleMap[scale] || null;
}

/**
 * Custom animatie voor gespiegelde warrior spritesheet
 */
function startMirroredWarriorAnimation(sprite, speed = 1.0, paused = false) {
    console.log('Startende gespiegelde warrior animatie:', { speed, paused });
    
    // Frame posities voor gespiegelde spritesheet (in correcte volgorde)
    const frames = [
        '-1px 0',      // Frame 1 (was oorspronkelijk frame 6)
        '-67px 0',     // Frame 2 (was oorspronkelijk frame 5)  
        '-133px 0',    // Frame 3 (was oorspronkelijk frame 4)
        '-199px 0',    // Frame 4 (was oorspronkelijk frame 3)
        '-265px 0',    // Frame 5 (was oorspronkelijk frame 2)
        '-331px 0'     // Frame 6 (was oorspronkelijk frame 1)
    ];
    
    let currentFrame = 0;
    let animationId = null;
    let lastTime = null; // Start met null zodat eerste frame direct wordt getekend
    const frameDuration = (speed * 1000) / 6; // Milliseconds per frame
    
    console.log('Frame duration:', frameDuration, 'ms');
    console.log('Frames array:', frames);
    
    function animate(currentTime) {
        // Initialiseer lastTime bij eerste run
        if (lastTime === null) {
            lastTime = currentTime;
            // Teken eerste frame direct
            sprite.style.backgroundPosition = frames[currentFrame];
            console.log(`Eerste frame getekend: ${currentFrame + 1}: ${frames[currentFrame]}`);
            currentFrame = (currentFrame + 1) % frames.length;
        }
        
        if (currentTime - lastTime >= frameDuration) {
            // Update background position
            sprite.style.backgroundPosition = frames[currentFrame];
            
            // Debug log eerste paar frames
            if (currentFrame < 6) {
                console.log(`Frame ${currentFrame + 1}: ${frames[currentFrame]}`);
            }
            
            // Ga naar volgende frame
            currentFrame = (currentFrame + 1) % frames.length;
            lastTime = currentTime;
        }
        
        // Continue animatie als niet gepauzeerd
        if (sprite.dataset.paused !== 'true') {
            animationId = requestAnimationFrame(animate);
        } else {
            console.log('Animatie gestopt - sprite is gepauzeerd');
        }
    }
    
    // Start animatie
    if (!paused) {
        sprite.dataset.paused = 'false';
        animationId = requestAnimationFrame(animate);
        console.log('Animatie gestart met requestAnimationFrame');
    } else {
        sprite.dataset.paused = 'true';
        console.log('Animatie gepauzeerd');
    }
    
    // Sla animatie data op voor controller
    sprite._mirroredAnimation = {
        frames,
        currentFrame: () => currentFrame,
        play: () => {
            sprite.dataset.paused = 'false';
            if (!animationId) {
                lastTime = null; // Reset timing
                animationId = requestAnimationFrame(animate);
                console.log('Animatie hervat');
            }
        },
        pause: () => {
            sprite.dataset.paused = 'true';
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
                console.log('Animatie gepauzeerd via controller');
            }
        },
        setSpeed: (newSpeed) => {
            speed = newSpeed;
            console.log('Animatie snelheid veranderd naar:', newSpeed);
        }
    };
    
    console.log('Mirrored animation object opgeslagen:', sprite._mirroredAnimation);
}

/**
 * Beheert warrior sprite animaties
 */
class WarriorSpriteController {
    constructor(element) {
        this.element = element;
        this.isMirrored = element._mirroredAnimation !== undefined;
        this.isPlaying = !element.classList.contains('warrior-sprite--paused') && 
                        element.dataset.paused !== 'true';
    }
    
    // Start animatie
    play() {
        if (this.isMirrored) {
            this.element._mirroredAnimation.play();
        } else {
            this.element.classList.remove('warrior-sprite--paused');
        }
        this.isPlaying = true;
        return this;
    }
    
    // Pauzeer animatie
    pause() {
        if (this.isMirrored) {
            this.element._mirroredAnimation.pause();
        } else {
            this.element.classList.add('warrior-sprite--paused');
        }
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
        if (this.isMirrored) {
            this.element._mirroredAnimation.setSpeed(speed);
        } else {
            this.element.style.animationDuration = `${speed}s`;
        }
        return this;
    }
    
    // Snelle animatie
    fast() {
        if (this.isMirrored) {
            this.element._mirroredAnimation.setSpeed(0.8);
        } else {
            this.element.classList.add('warrior-sprite--fast');
        }
        return this;
    }
    
    // Langzame animatie
    slow() {
        if (this.isMirrored) {
            this.element._mirroredAnimation.setSpeed(1.4);
        } else {
            this.element.classList.add('warrior-sprite--slow');
        }
        return this;
    }
    
    // Reset naar normale snelheid
    normalSpeed() {
        if (this.isMirrored) {
            this.element._mirroredAnimation.setSpeed(1.0);
        } else {
            this.element.classList.remove('warrior-sprite--fast', 'warrior-sprite--slow');
            this.element.style.animationDuration = '';
        }
        return this;
    }
    
    // Verander schaal
    setScale(scale) {
        // Verwijder alle schaal klasses
        this.element.classList.remove(
            'warrior-sprite--small', 
            'warrior-sprite--normal',
            'warrior-sprite--large', 
            'warrior-sprite--xlarge'
        );
        
        const scaleClass = getWarriorScaleClass(scale);
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
 * Convenience functie om direct een gecontroleerde warrior sprite te maken
 * @param {Object} options - Configuratie opties
 * @returns {WarriorSpriteController} Controller voor de sprite
 */
function createControlledWarriorSprite(options = {}) {
    const sprite = createWarriorSprite(options);
    return new WarriorSpriteController(sprite);
}

/**
 * Initialiseer alle bestaande warrior sprites op een pagina
 * @param {string} selector - CSS selector voor sprites (default: '.warrior-sprite')
 * @returns {WarriorSpriteController[]} Array van controllers
 */
function initializeWarriorSprites(selector = '.warrior-sprite') {
    const sprites = document.querySelectorAll(selector);
    return Array.from(sprites).map(sprite => new WarriorSpriteController(sprite));
}

// Export functies voor gebruik in andere scripts
window.WarriorSprite = {
    create: createWarriorSprite,
    createControlled: createControlledWarriorSprite,
    Controller: WarriorSpriteController,
    initialize: initializeWarriorSprites
};

// Auto-initialiseer als DOM geladen is
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeWarriorSprites();
    });
} else {
    initializeWarriorSprites();
} 