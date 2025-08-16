class DialogueSystem {
    constructor(options = {}) {
        this.typingSpeed = options.typingSpeed || 50;
        this.autoAdvance = options.autoAdvance || false;
        this.skipTypingOnTouch = options.skipTypingOnTouch !== false;
        
        this.currentDialogue = null;
        this.currentIndex = 0;
        this.currentPage = 0;
        this.isTyping = false;
        this.isShowing = false;
        
        this.currentTextPages = [];
        this.maxCharsPerPage = 150;
        
        this.onComplete = options.onComplete || null;
        this.onNext = options.onNext || null;
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'dialogue-overlay';
        
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
    
    bindEvents() {
        // Klik/touch events
        this.overlay.addEventListener('click', (e) => this.handleInteraction(e));
        this.overlay.addEventListener('touchend', (e) => this.handleInteraction(e));
        
        // Keyboard ondersteuning
        document.addEventListener('keydown', (e) => {
            if (this.isShowing && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                this.handleInteraction(e);
            }
        });
    }
    
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
        
        // Split tekst direct zonder layout dependency
        this.currentTextPages = this.splitTextIntoPages(text);
        this.currentPage = 0;
        
        // Start typing animatie voor eerste pagina
        this.typeCurrentPage();
        
        // Callback
        if (this.onNext) {
            this.onNext(dialogue, this.currentIndex);
        }
    }
    
    updatePortrait(portraitPath) {
        if (portraitPath) {
            const fullPath = portraitPath.startsWith('assets/') ? `../../${portraitPath}` : portraitPath;
            this.portrait.style.backgroundImage = `url(${fullPath})`;
            this.portrait.style.backgroundSize = 'contain';
            this.portrait.style.backgroundPosition = 'center';
            this.portrait.style.backgroundRepeat = 'no-repeat';
            this.portrait.style.display = 'block';
            this.portrait.style.visibility = 'visible';
        } else {
            this.portrait.style.display = 'none';
        }
    }
    
    splitTextIntoPages(text) {
        const maxCharsPerPage = this.calculateMaxCharsPerPage();
        
        if (text.length <= maxCharsPerPage) {
            return [text];
        }
        
        const pages = [];
        const chunks = this.createSmartChunks(text);
        let currentPage = '';
        
        for (const chunk of chunks) {
            const potentialPage = currentPage + (currentPage ? ' ' : '') + chunk;
            
            if (potentialPage.length <= maxCharsPerPage) {
                currentPage = potentialPage;
            } else {
                if (currentPage.trim()) {
                    pages.push(currentPage.trim());
                }
                
                if (chunk.length <= maxCharsPerPage) {
                    currentPage = chunk;
                } else {
                    const words = chunk.split(' ');
                    let tempPage = '';
                    
                    for (const word of words) {
                        if ((tempPage + (tempPage ? ' ' : '') + word).length <= maxCharsPerPage) {
                            tempPage += (tempPage ? ' ' : '') + word;
                        } else {
                            if (tempPage.trim()) {
                                pages.push(tempPage.trim());
                            }
                            tempPage = word;
                        }
                    }
                    currentPage = tempPage;
                }
            }
        }
        
        if (currentPage.trim()) {
            pages.push(currentPage.trim());
        }
        
        return pages.length > 0 ? pages : [text];
    }
    
    createSmartChunks(text) {
        const breakPoints = [
            /([.!?]+\s+)/g,
            /(,\s+)/g,
            /(\s+en\s+)/g,
            /(\s+maar\s+)/g,
            /(\s+dus\s+)/g,
            /(\s+want\s+)/g,
            /(\s+omdat\s+)/g,
            /(\s+terwijl\s+)/g,
            /(\s+zodat\s+)/g
        ];
        
        let chunks = [text];
        
        for (const regex of breakPoints) {
            const newChunks = [];
            for (const chunk of chunks) {
                const parts = chunk.split(regex);
                let currentPart = '';
                
                for (const part of parts) {
                    if (regex.test(part)) {
                        currentPart += part;
                        if (currentPart.trim()) {
                            newChunks.push(currentPart.trim());
                        }
                        currentPart = '';
                    } else {
                        currentPart += part;
                    }
                }
                
                if (currentPart.trim()) {
                    newChunks.push(currentPart.trim());
                }
            }
            chunks = newChunks.filter(chunk => chunk.trim());
        }
        
        return chunks.length > 0 ? chunks : [text];
    }
    
    calculateMaxCharsPerPage() {
        const screenWidth = window.innerWidth;
        let availableWidth, maxHeight, fontSize;
        
        if (screenWidth <= 480) {
            availableWidth = screenWidth - 20 - 24 - 80 - 12;
            maxHeight = 120;
            fontSize = 24;
        } else if (screenWidth <= 768) {
            availableWidth = screenWidth - 30 - 32 - 90 - 16;
            maxHeight = 130;
            fontSize = 28;
        } else {
            availableWidth = screenWidth - 40 - 40 - 100 - 20;
            maxHeight = 150;
            fontSize = 32;
        }
        
        const avgCharWidth = fontSize * 0.65;
        const lineHeight = fontSize * 1.2;
        
        const charsPerLine = Math.floor(availableWidth / avgCharWidth);
        const maxLines = Math.floor(maxHeight / lineHeight);
        
        return Math.max(50, charsPerLine * maxLines);
    }
    
    updatePagesIndicator() {
        // Verberg pagination volledig
            this.pagesIndicator.style.display = 'none';
    }
    
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
    
    isActive() {
        return this.isShowing;
    }
    
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
    }
    
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

let gameDialogue = null;

function initDialogueSystem(options = {}) {
    if (gameDialogue) {
        gameDialogue.destroy();
    }
    
    gameDialogue = new DialogueSystem(options);
    return gameDialogue;
}

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



const Characters = {
    HERO: '../../assets/character_port/herp.png',
    WARRIOR: '../../assets/character_port/npc.png',
    HERP: '../../assets/character_port/herp.png',
    NPC: '../../assets/character_port/npc.png'
};


window.DialogueSystem = {
    DialogueSystem,
    initDialogueSystem,
    showDialogue,

    Characters,
    
    // Toegang tot actieve instance
    get current() {
        return gameDialogue;
    }
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {

        if (!gameDialogue) {
            initDialogueSystem();
        }
    });
} else {

    if (!gameDialogue) {
        initDialogueSystem();
    }
} 