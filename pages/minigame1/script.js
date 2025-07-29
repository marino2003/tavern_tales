// Minigame 1 - Complete UI Herwerking
document.addEventListener('DOMContentLoaded', function() {
  
  // Transition overlay initialiseren
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
  // Elementen ophalen
  const minigameScrollOverlay = document.getElementById('minigameScrollOverlay');
  const startMinigameButton = document.getElementById('startMinigameButton');
  const gameInterface = document.getElementById('gameInterface');
  const hintButton = document.getElementById('hintButton');
  const answerButton = document.getElementById('answerButton');
  
  // Modal components
  let hintModal = null;
  let answerModal = null;
  let successModal = null;
  
  // Game state
  let gameStarted = false;
  
  // Initialiseer alle modals
  function initModals() {
    // Hint modal - Toont hints
    hintModal = new ModalComponent({
      id: 'hintModal',
      title: '- HINT -',
      showCloseButton: true,
      showInput: false,
      showActions: true,
      primaryButtonText: 'Sluiten',
      secondaryButtonText: null,
      customContent: `
        <div class="modal-text">
          <p>Stap buiten en kijk naar de gevel van Den Engel. Wat voor soort winkel zie je daar?</p>
          <p>Let op de details in de gevel en de historische elementen.</p>
        </div>
      `,
      onPrimaryClick: () => {
        hintModal.close();
      }
    });
    
    // Answer modal - Voor antwoord invoer
    answerModal = new ModalComponent({
      id: 'answerModal',
      title: '- ANTWOORD -',
      showCloseButton: true,
      showInput: true,
      inputPlaceholder: 'Type hier je antwoord...',
      inputMaxLength: 20,
      showActions: true,
      primaryButtonText: 'Indienen',
      secondaryButtonText: 'Annuleren',
      customContent: `
        <div class="modal-text">
          <p>Wat was de oorspronkelijke functie van Den Engel?</p>
        </div>
      `,
      onPrimaryClick: (value) => {
        submitAnswer(value);
      },
      onSecondaryClick: () => {
        answerModal.close();
      }
    });
    
    // Success modal - Beloning
    successModal = new ModalComponent({
      id: 'successModal',
      title: '- GEFELICITEERD -',
      showCloseButton: false,
      showInput: false,
      showActions: true,
      primaryButtonText: 'Verder',
      secondaryButtonText: null,
      customContent: `
        <div class="success-content">
          <div class="success-icon">🎉</div>
          <div class="modal-text">
            <p>Je hebt het geheim van Den Engel ontdekt! Het was inderdaad een drogisterij.</p>
            <p>Dracohol heeft hier een van de verloren bieren verstopt.</p>
          </div>
          <div class="success-reward">
            <div class="beer-icon">🍺</div>
            <span class="reward-text">+1 Bier gevonden!</span>
          </div>
        </div>
      `,
      onPrimaryClick: () => {
        continueToNext();
      }
    });
  }
  
  // Start de game
  function startGame() {
    console.log('Start minigame...');
    
    // Fade out scroll overlay
    minigameScrollOverlay.style.opacity = '0';
    minigameScrollOverlay.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      minigameScrollOverlay.style.display = 'none';
      gameStarted = true;
      gameInterface.style.display = 'flex';
      
      // Fade in game interface
      gameInterface.style.opacity = '0';
      gameInterface.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        gameInterface.style.opacity = '1';
        gameInterface.style.transform = 'translateY(0)';
      }, 100);
    }, 300);
  }
  
  // Toon hint
  function showHint() {
    console.log('Toon hint...');
    hintModal.show();
  }
  
  // Toon answer modal
  function showAnswerModal() {
    console.log('Toon answer modal...');
    answerModal.show();
  }
  
  // Antwoord indienen
  function submitAnswer(userAnswer) {
    const correctAnswers = ['drogisterij', 'drogist', 'apotheek', 'pharmacy'];
    
    console.log('Antwoord ingediend:', userAnswer);
    
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = correctAnswers.some(answer => 
      normalizedAnswer.includes(answer) || answer.includes(normalizedAnswer)
    );
    
    if (isCorrect) {
      console.log('Correct antwoord!');
      answerModal.close();
      showSuccess();
    } else {
      console.log('Fout antwoord');
      answerModal.showError('Dat is niet het juiste antwoord. Probeer het nog eens!');
    }
  }
  
  // Toon success
  function showSuccess() {
    console.log('Toon success...');
    successModal.show();
  }
  
  // Ga verder naar volgende pagina
  function continueToNext() {
    console.log('Ga verder...');
    
    // Start transition out
    transitionOverlay.transitionOut(() => {
      // Navigeer naar volgende pagina
      window.location.href = '../navigate/index.html';
    }).then(() => {
      console.log('Transition out voltooid');
    });
  }
  
  // Event listeners
  if (startMinigameButton) {
    startMinigameButton.addEventListener('click', startGame);
  }
  
  if (hintButton) {
    hintButton.addEventListener('click', showHint);
  }
  
  if (answerButton) {
    answerButton.addEventListener('click', showAnswerModal);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (gameStarted) {
        // Terug naar navigatie
        continueToNext();
      } else {
        // Terug naar navigatie
        continueToNext();
      }
    }
  });
  
  // Touch events voor mobile
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', function(event) {
    touchStartY = event.touches[0].clientY;
  });
  
  document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe omhoog - geen actie
      } else {
        // Swipe omlaag - geen actie
      }
    }
  }
  
  // Initialiseer modals
  initModals();
  
  // Start met scroll overlay zichtbaar
  minigameScrollOverlay.style.opacity = '1';
  minigameScrollOverlay.style.transform = 'scale(1)';
  minigameScrollOverlay.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  
  console.log('Minigame 1 pagina geladen');
}); 