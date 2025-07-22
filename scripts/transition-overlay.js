// TransitionOverlay Component
class TransitionOverlay {
  constructor(config = {}) {
    this.config = {
      duration: config.duration || 1500,
      color: config.color || '#A0303F',
      direction: config.direction || 'left-to-right', // 'left-to-right' of 'right-to-left'
      zIndex: config.zIndex || 9999,
      onComplete: config.onComplete || null,
      ...config
    };
    
    this.element = null;
    this.overlay = null;
    this.startTime = null;
  }

  // Maak het overlay element
  createElement() {
    if (this.element) return this.element;

    // Main container
    this.element = document.createElement('div');
    this.element.className = 'transition-overlay-container';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: ${this.config.zIndex};
      pointer-events: none;
      opacity: 0;
    `;

    // Overlay element
    this.overlay = document.createElement('div');
    this.overlay.className = 'transition-overlay-element';
    this.overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${this.config.color};
      clip-path: polygon(-100% 0%, -100% 0%, -100% 100%, -100% 100%);
    `;

    this.element.appendChild(this.overlay);
    return this.element;
  }

  // Start een "out" overgang (pagina verlaten)
  transitionOut(navigationCallback) {
    return new Promise((resolve) => {
      const element = this.createElement();
      document.body.appendChild(element);
      
      // Maak zichtbaar
      element.style.opacity = '1';
      
      // Start animatie
      const animationDuration = this.config.duration;
      const navigationPoint = Math.floor(animationDuration * 0.6); // 60% punt
      
      this.overlay.style.animation = `diagonalWipeIn ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
      
      // Sla timing op voor volgende pagina
      this.startTime = Date.now();
      sessionStorage.setItem('transitionStartTime', this.startTime.toString());
      sessionStorage.setItem('transitionDuration', animationDuration.toString());
      
      // Navigeer op het juiste moment
      setTimeout(() => {
        if (navigationCallback) {
          navigationCallback();
        }
      }, navigationPoint);
      
      // Resolve wanneer animatie klaar is
      setTimeout(() => {
        resolve();
        if (this.config.onComplete) {
          this.config.onComplete();
        }
      }, animationDuration);
    });
  }

  // Start een "in" overgang (pagina binnenkomen)
  transitionIn() {
    return new Promise((resolve) => {
      const element = this.createElement();
      document.body.appendChild(element);
      
      // Start met volledig rood scherm
      this.overlay.style.clipPath = 'polygon(100% 0%, -100% 0%, -100% 100%, 100% 100%)';
      element.style.opacity = '1';
      
      // Bereken timing gebaseerd op vorige overgang
      const startTime = sessionStorage.getItem('transitionStartTime');
      const duration = sessionStorage.getItem('transitionDuration');
      const now = Date.now();
      
      let waitTime = 300; // Iets langere fallback voor stabiliteit
      
      if (startTime && duration) {
        const elapsed = now - parseInt(startTime);
        const totalDuration = parseInt(duration);
        const targetWaitTime = totalDuration - elapsed;
        
        // Zorg voor minimale en maximale wachttijd
        waitTime = Math.max(100, Math.min(targetWaitTime, totalDuration * 0.7));
        
        console.log('TransitionIn - Elapsed:', elapsed, 'Wait time:', waitTime, 'Target:', targetWaitTime);
      }
      
      // Start wipe-out na berekende tijd
      setTimeout(() => {
        // Gebruik dezelfde easing curve als transitionOut voor consistentie
        const outDuration = Math.floor(this.config.duration * 0.8); // 80% van de out-duration
        this.overlay.style.animation = `diagonalWipeOut ${outDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
        
        // Cleanup sessionstorage
        sessionStorage.removeItem('transitionStartTime');
        sessionStorage.removeItem('transitionDuration');
        
        // Remove element na animatie
        setTimeout(() => {
          if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
          }
          resolve();
          if (this.config.onComplete) {
            this.config.onComplete();
          }
        }, outDuration);
      }, waitTime);
    });
  }

  // Cleanup
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.overlay = null;
  }
}

// CSS Keyframes toevoegen aan document
function addTransitionStyles() {
  if (document.getElementById('transition-overlay-styles')) return;
  
  const styleSheet = document.createElement('style');
  styleSheet.id = 'transition-overlay-styles';
  styleSheet.textContent = `
    @keyframes diagonalWipeIn {
      0% {
        clip-path: polygon(-100% 0%, -100% 0%, -100% 100%, -100% 100%);
      }
      55% {
        clip-path: polygon(100% 0%, -100% 0%, -100% 100%, 100% 100%);
      }
      100% {
        clip-path: polygon(100% 0%, -100% 0%, -100% 100%, 100% 100%);
      }
    }
    
    @keyframes diagonalWipeOut {
      0% {
        clip-path: polygon(100% 0%, -100% 0%, -100% 100%, 100% 100%);
      }
      100% {
        clip-path: polygon(-100% 0%, -100% 0%, -100% 100%, -100% 100%);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

// Auto-initialiseer styles
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addTransitionStyles);
} else {
  addTransitionStyles();
}

// Export voor gebruik
window.TransitionOverlay = TransitionOverlay; 