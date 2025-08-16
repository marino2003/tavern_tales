function openCharacterModal() {
  const modal = document.getElementById('characterModal');
  const gameContainer = document.querySelector('.game-container');
  
  if (modal && gameContainer) {
    modal.classList.add('active');
    gameContainer.classList.add('modal-active');
  }
}

function closeCharacterModal() {
  const modal = document.getElementById('characterModal');
  const gameContainer = document.querySelector('.game-container');
  
  if (modal && gameContainer) {
    modal.classList.remove('active');
    gameContainer.classList.remove('modal-active');
  }
}

// Input field functionaliteit
function updateInputUnderscores() {
  const input = document.getElementById('playerName');
  const underscores = document.querySelectorAll('.underscore');
  
  if (!input || !underscores.length) return;
  
  const value = input.value.toUpperCase();
  const maxLength = 6;
  
  // Update input value to uppercase
  if (input.value !== value) {
    input.value = value;
  }
  
  underscores.forEach((underscore, index) => {
    if (index < value.length) {
      // Verberg streepjes waar letters zijn getypt
      underscore.style.opacity = '0';
    } else if (index < maxLength) {
      // Toon streepjes voor resterende posities
      underscore.style.opacity = '1';
      underscore.classList.remove('filled');
    }
  });
}

// Knop functies
function startNewGame() {
  console.log('startNewGame function called');
  openCharacterModal();
}

function showValidationError() {
  const input = document.getElementById('playerName');
  const errorMessage = document.getElementById('errorMessage');
  
  // Voeg error styling toe aan input
  input.classList.add('error');
  
  // Toon error message
  errorMessage.classList.add('show');
  
  // Focus op input veld
  input.focus();
  
  // Verwijder error styling na 3 seconden
  setTimeout(() => {
    hideValidationError();
  }, 3000);
}

function hideValidationError() {
  const input = document.getElementById('playerName');
  const errorMessage = document.getElementById('errorMessage');
  
  input.classList.remove('error');
  errorMessage.classList.remove('show');
}

function proceedToGame() {
  const playerName = document.getElementById('playerName').value.trim();
  
  if (playerName.length === 0) {
    // Toon error styling en bericht
    showValidationError();
    return;
  }
  
  // Verberg eventuele error berichten
  hideValidationError();
  
  // Sla speler naam op via PlayerData systeem
  if (window.PlayerData) {
    window.PlayerData.setName(playerName);
  } else {
    localStorage.setItem('playerName', playerName);
  }
  
  // Start diagonale overgangsanimatie
  startDiagonalTransition();
}

function startDiagonalTransition() {
  // Sluit eerst de modal
  closeCharacterModal();
  
  // Maak nieuwe overgang instance
  const transition = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F'
  });
  
  // Start overgang met navigatie callback
  transition.transitionOut(() => {
    location.assign('../cutscene/index.html');
  });
}

function continueGame() {
  // Logic for continuing saved game
  console.log('Continue game clicked');
  // TODO: Implementeer continue game functionaliteit
}

// Touch/Click feedback voor knoppen
function addButtonFeedback(button) {
  // Voor mobile touch events - ZONDER preventDefault om clicks te behouden
  button.addEventListener('touchstart', () => {
    button.classList.add('pressed');
  }, { passive: true });
  
  button.addEventListener('touchend', () => {
    setTimeout(() => {
      button.classList.remove('pressed');
    }, 100);
  }, { passive: true });
  
  // Voor desktop mouse events
  button.addEventListener('mousedown', () => {
    button.classList.add('pressed');
  });
  
  button.addEventListener('mouseup', () => {
    button.classList.remove('pressed');
  });
  
  // Cleanup als muis buiten knop gaat
  button.addEventListener('mouseleave', () => {
    button.classList.remove('pressed');
  });
}

// Event listeners toevoegen wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  const newGameBtn = document.getElementById('newGameBtn');
  const continueBtn = document.getElementById('continueBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const continueModalBtn = document.getElementById('continueModalBtn');
  const playerNameInput = document.getElementById('playerName');
  const modalOverlay = document.getElementById('characterModal');
  
  if (newGameBtn) {
    let isProcessing = false;
    
    const handleNewGame = (eventType) => {
      if (isProcessing) return;
      isProcessing = true;
      
      startNewGame();
      
      setTimeout(() => {
        isProcessing = false;
      }, 500);
    };
    
    newGameBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleNewGame('CLICK');
    });
    
    newGameBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleNewGame('TOUCHEND');
    }, { passive: false });
    
    addButtonFeedback(newGameBtn);
  }
  
  if (continueBtn) {
    continueBtn.addEventListener('click', continueGame);
    addButtonFeedback(continueBtn);
  }
  
  // Modal event listeners
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeCharacterModal);
  }
  
  if (continueModalBtn) {
    continueModalBtn.addEventListener('click', proceedToGame);
    addButtonFeedback(continueModalBtn);
  }
  
  if (playerNameInput) {
    playerNameInput.addEventListener('input', () => {
      updateInputUnderscores();
      hideValidationError();
    });
    
    // Focus op input wanneer modal opent
    playerNameInput.addEventListener('focus', () => {
      updateInputUnderscores();
    });
    
    // Auto-focus op input wanneer modal opent
    const modal = document.getElementById('characterModal');
    if (modal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (modal.classList.contains('active')) {
              setTimeout(() => {
                playerNameInput.focus();
              }, 300);
            }
          }
        });
      });
      observer.observe(modal, { attributes: true });
    }
  }
  
  // Sluit modal bij klik op overlay
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeCharacterModal();
      }
    });
  }
  
  // Escape key om modal te sluiten
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCharacterModal();
    }
  });
}); 