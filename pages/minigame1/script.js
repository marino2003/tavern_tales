// Minigame 1 pagina script
document.addEventListener('DOMContentLoaded', function() {
  
  // Transition overlay initialiseren
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
  // Elementen ophalen
  const tutorialModal = document.getElementById('tutorialModal');
  const startMinigameBtn = document.getElementById('startMinigameBtn');
  const questSummary = document.getElementById('questSummary');
  const hintButton = document.getElementById('hintButton');
  const hintModal = document.getElementById('hintModal');
  const closeHintBtn = document.getElementById('closeHintBtn');
  
  // Tutorial modal verbergen en quest summary + hint button tonen
  function startMinigame() {
    console.log('Start minigame...');
    
    // Tutorial modal verbergen
    tutorialModal.style.display = 'none';
    
    // Quest summary tonen
    questSummary.style.display = 'block';
    
    // Hint button tonen
    hintButton.style.display = 'flex';
    
    console.log('Tutorial verborgen, quest summary en hint button getoond');
  }
  
  // Hint modal tonen
  function showHint() {
    console.log('Toon hint...');
    hintModal.style.display = 'flex';
  }
  
  // Hint modal verbergen
  function hideHint() {
    console.log('Verberg hint...');
    hintModal.style.display = 'none';
  }
  
  // Terug naar navigatie functie
  function backToNavigation() {
    console.log('Terug naar navigatie...');
    
    // Start transition out
    transitionOverlay.transitionOut(() => {
      // Navigeer terug naar navigatie pagina
      window.location.href = '../navigate/index.html';
    }).then(() => {
      console.log('Transition out voltooid');
    });
  }
  
  // Event listeners
  if (startMinigameBtn) {
    startMinigameBtn.addEventListener('click', startMinigame);
  }
  
  if (hintButton) {
    hintButton.addEventListener('click', showHint);
  }
  
  if (closeHintBtn) {
    closeHintBtn.addEventListener('click', hideHint);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // Escape verbergt hint modal of gaat terug
      event.preventDefault();
      if (hintModal.style.display === 'flex') {
        hideHint();
      } else {
        backToNavigation();
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
    const swipeThreshold = 50;
    const swipeDistance = touchEndY - touchStartY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance < 0) {
        // Swipe naar boven - ga terug
        backToNavigation();
      }
    }
  }
  
  // Auto-focus op start button voor accessibility
  setTimeout(() => {
    if (startMinigameBtn) {
      startMinigameBtn.focus();
    }
  }, 1000);
  
  console.log('Minigame 1 pagina geladen');
  
}); 