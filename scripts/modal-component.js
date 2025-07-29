/**
 * Modal Component - Herbruikbare modal component
 * Gebaseerd op het character modal van de startmenu
 */
class ModalComponent {
  constructor(options = {}) {
    this.options = {
      id: 'modal',
      title: 'Modal',
      showCloseButton: true,
      showInput: false,
      inputPlaceholder: '',
      inputMaxLength: 6,
      inputValue: '',
      showActions: true,
      primaryButtonText: 'OK',
      secondaryButtonText: 'Annuleren',
      customContent: null,
      onPrimaryClick: null,
      onSecondaryClick: null,
      onClose: null,
      onInputChange: null,
      ...options
    };
    
    this.isActive = false;
    this.modalElement = null;
    this.inputElement = null;
    this.errorElement = null;
    
    this.init();
  }
  
  /**
   * Initialiseer de modal
   */
  init() {
    this.createModal();
    this.bindEvents();
  }
  
  /**
   * Maak de modal HTML
   */
  createModal() {
    // Maak modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = this.options.id;
    
    // Modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    // Close button
    if (this.options.showCloseButton) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close-btn';
      closeBtn.id = `${this.options.id}CloseBtn`;
      
      const closeBtnBg = document.createElement('div');
      closeBtnBg.className = 'close-btn-bg';
      
      const closeIcon = document.createElement('div');
      closeIcon.className = 'close-icon';
      closeIcon.textContent = '×';
      
      closeBtn.appendChild(closeBtnBg);
      closeBtn.appendChild(closeIcon);
      modalContainer.appendChild(closeBtn);
    }
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    // Title
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = this.options.title;
    modalContent.appendChild(title);
    
    // Custom content (komt nu vóór input)
    if (this.options.customContent) {
      const customContentDiv = document.createElement('div');
      customContentDiv.className = 'modal-custom-content';
      customContentDiv.innerHTML = this.options.customContent;
      modalContent.appendChild(customContentDiv);
    }
    
    // Input container
    if (this.options.showInput) {
      const inputContainer = document.createElement('div');
      inputContainer.className = 'input-container';
      
      // Input field
      this.inputElement = document.createElement('input');
      this.inputElement.type = 'text';
      this.inputElement.className = 'modal-input';
      this.inputElement.id = `${this.options.id}Input`;
      this.inputElement.maxLength = this.options.inputMaxLength;
      this.inputElement.placeholder = this.options.inputPlaceholder;
      this.inputElement.value = this.options.inputValue;
      
      // Input underscores
      const underscores = document.createElement('div');
      underscores.className = 'input-underscores';
      
      for (let i = 0; i < this.options.inputMaxLength; i++) {
        const underscore = document.createElement('div');
        underscore.className = 'underscore';
        underscores.appendChild(underscore);
      }
      
      inputContainer.appendChild(this.inputElement);
      inputContainer.appendChild(underscores);
      modalContent.appendChild(inputContainer);
      
      // Error message
      this.errorElement = document.createElement('div');
      this.errorElement.className = 'error-message';
      this.errorElement.textContent = 'Vul eerst je antwoord in!';
      modalContent.appendChild(this.errorElement);
    }
    
    // Actions
    if (this.options.showActions) {
      const actions = document.createElement('div');
      actions.className = 'modal-actions';
      
      // Primary button (eerst voor betere hiërarchie)
      const primaryBtn = document.createElement('button');
      primaryBtn.className = 'pixel-button primary modal-btn';
      primaryBtn.id = `${this.options.id}PrimaryBtn`;
      
      const primarySvg = document.createElement('img');
      primarySvg.src = '../../assets/ui/button_svg.svg';
      primarySvg.alt = '';
      primarySvg.className = 'pixel-button-svg';
      
      const primaryText = document.createElement('span');
      primaryText.className = 'pixel-button-text';
      primaryText.textContent = this.options.primaryButtonText;
      
      primaryBtn.appendChild(primarySvg);
      primaryBtn.appendChild(primaryText);
      actions.appendChild(primaryBtn);
      
      // Secondary button (tweede voor ondersteunende rol)
      if (this.options.secondaryButtonText) {
        const secondaryBtn = document.createElement('button');
        secondaryBtn.className = 'pixel-button secondary modal-btn';
        secondaryBtn.id = `${this.options.id}SecondaryBtn`;
        
        const secondarySvg = document.createElement('img');
        secondarySvg.src = '../../assets/ui/button_svg.svg';
        secondarySvg.alt = '';
        secondarySvg.className = 'pixel-button-svg';
        
        const secondaryText = document.createElement('span');
        secondaryText.className = 'pixel-button-text';
        secondaryText.textContent = this.options.secondaryButtonText;
        
        secondaryBtn.appendChild(secondarySvg);
        secondaryBtn.appendChild(secondaryText);
        actions.appendChild(secondaryBtn);
      }
      
      modalContent.appendChild(actions);
    }
    
    modalContainer.appendChild(modalContent);
    modalOverlay.appendChild(modalContainer);
    
    // Voeg toe aan body
    document.body.appendChild(modalOverlay);
    
    this.modalElement = modalOverlay;
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Close button
    const closeBtn = document.getElementById(`${this.options.id}CloseBtn`);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Overlay click
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });
    
    // Primary button
    const primaryBtn = document.getElementById(`${this.options.id}PrimaryBtn`);
    if (primaryBtn && this.options.onPrimaryClick) {
      primaryBtn.addEventListener('click', () => {
        if (this.options.showInput) {
          const value = this.inputElement.value.trim();
          if (value.length === 0) {
            this.showError();
            return;
          }
          this.hideError();
          this.options.onPrimaryClick(value);
        } else {
          this.options.onPrimaryClick();
        }
      });
    }
    
    // Secondary button
    const secondaryBtn = document.getElementById(`${this.options.id}SecondaryBtn`);
    if (secondaryBtn && this.options.onSecondaryClick) {
      secondaryBtn.addEventListener('click', () => {
        this.options.onSecondaryClick();
      });
    }
    
    // Input events
    if (this.inputElement) {
      this.inputElement.addEventListener('input', () => {
        this.updateUnderscores();
        this.hideError();
        
        if (this.options.onInputChange) {
          this.options.onInputChange(this.inputElement.value);
        }
      });
      
      this.inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const primaryBtn = document.getElementById(`${this.options.id}PrimaryBtn`);
          if (primaryBtn) {
            primaryBtn.click();
          }
        }
      });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.isActive && e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }
  
  /**
   * Toon de modal
   */
  show() {
    this.isActive = true;
    this.modalElement.classList.add('active');
    document.querySelector('.game-container').classList.add('modal-active');
    
    // Focus op input als die bestaat
    if (this.inputElement) {
      setTimeout(() => {
        this.inputElement.focus();
        this.updateUnderscores();
      }, 300);
    }
  }
  
  /**
   * Verberg de modal
   */
  close() {
    this.isActive = false;
    this.modalElement.classList.remove('active');
    document.querySelector('.game-container').classList.remove('modal-active');
    
    if (this.options.onClose) {
      this.options.onClose();
    }
  }
  
  /**
   * Update input underscores
   */
  updateUnderscores() {
    if (!this.inputElement) return;
    
    const underscores = this.modalElement.querySelectorAll('.underscore');
    const value = this.inputElement.value;
    
    // Don't force uppercase - let user type naturally
    underscores.forEach((underscore, index) => {
      if (index < value.length) {
        underscore.style.opacity = '0.3';
        underscore.classList.add('filled');
      } else if (index < this.options.inputMaxLength) {
        underscore.style.opacity = '1';
        underscore.classList.remove('filled');
      }
    });
  }
  
  /**
   * Toon error message
   */
  showError(message = 'Fout antwoord') {
    if (this.errorElement) {
      this.errorElement.textContent = message;
      this.errorElement.classList.add('show');
      this.inputElement.classList.add('error');
      
      setTimeout(() => {
        this.hideError();
      }, 3000);
    }
  }
  
  /**
   * Verberg error message
   */
  hideError() {
    if (this.errorElement) {
      this.errorElement.classList.remove('show');
      this.inputElement.classList.remove('error');
    }
  }
  
  /**
   * Verwijder de modal
   */
  destroy() {
    if (this.modalElement && this.modalElement.parentNode) {
      this.modalElement.parentNode.removeChild(this.modalElement);
    }
  }
}

// Export voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalComponent;
} else {
  window.ModalComponent = ModalComponent;
}

/*
 * VOORBEELD GEBRUIK:
 * 
 * // Eenvoudige modal zonder input
 * const simpleModal = new ModalComponent({
 *   id: 'simpleModal',
 *   title: 'BEVESTIGING',
 *   showInput: false,
 *   primaryButtonText: 'OK',
 *   secondaryButtonText: 'Annuleren',
 *   onPrimaryClick: () => {
 *     console.log('OK geklikt');
 *     simpleModal.close();
 *   },
 *   onSecondaryClick: () => {
 *     console.log('Annuleren geklikt');
 *     simpleModal.close();
 *   }
 * });
 * 
 * // Modal met input (zoals character creation)
 * const characterModal = new ModalComponent({
 *   id: 'characterModal',
 *   title: '- Character -',
 *   showInput: true,
 *   inputPlaceholder: '',
 *   inputMaxLength: 6,
 *   primaryButtonText: 'Ga Verder',
 *   secondaryButtonText: null, // Geen secondary button
 *   onPrimaryClick: (value) => {
 *     console.log('Character naam:', value);
 *     // Sla op en ga verder
 *     characterModal.close();
 *   }
 * });
 * 
 * // Modal tonen
 * simpleModal.show();
 * characterModal.show();
 */ 