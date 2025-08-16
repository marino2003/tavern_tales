
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


  transitionOut(navigationCallback) {
    return new Promise((resolve) => {
      const element = this.createElement();
      document.body.appendChild(element);
      

      element.style.opacity = '1';
      

      const animationDuration = this.config.duration;
      const navigationPoint = Math.floor(animationDuration * 0.6); // 60% punt
      
      this.overlay.style.animation = `diagonalWipeIn ${animationDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
      

      this.startTime = Date.now();
      sessionStorage.setItem('transitionStartTime', this.startTime.toString());
      sessionStorage.setItem('transitionDuration', animationDuration.toString());
      

      setTimeout(() => {
        if (navigationCallback) {
          navigationCallback();
        }
      }, navigationPoint);
      

      setTimeout(() => {
        resolve();
        if (this.config.onComplete) {
          this.config.onComplete();
        }
      }, animationDuration);
    });
  }


  transitionIn() {
    return new Promise((resolve) => {
      const element = this.createElement();
      document.body.appendChild(element);
      

      this.overlay.style.clipPath = 'polygon(100% 0%, -100% 0%, -100% 100%, 100% 100%)';
      element.style.opacity = '1';
      

      const startTime = sessionStorage.getItem('transitionStartTime');
      const duration = sessionStorage.getItem('transitionDuration');
      const now = Date.now();
      
      let waitTime = 300; // Iets langere fallback voor stabiliteit
      
      if (startTime && duration) {
        const elapsed = now - parseInt(startTime);
        const totalDuration = parseInt(duration);
        const targetWaitTime = totalDuration - elapsed;
        

        waitTime = Math.max(100, Math.min(targetWaitTime, totalDuration * 0.7));
        
        console.log('TransitionIn - Elapsed:', elapsed, 'Wait time:', waitTime, 'Target:', targetWaitTime);
      }
      

      setTimeout(() => {

        const outDuration = Math.floor(this.config.duration * 0.8); // 80% van de out-duration
        this.overlay.style.animation = `diagonalWipeOut ${outDuration}ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
        

        sessionStorage.removeItem('transitionStartTime');
        sessionStorage.removeItem('transitionDuration');
        

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


  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.overlay = null;
  }
}


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


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addTransitionStyles);
} else {
  addTransitionStyles();
}


window.TransitionOverlay = TransitionOverlay; 