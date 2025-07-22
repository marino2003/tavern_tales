// Start Menu Logic
console.log('Start Menu loaded');

// Knop functies
function startNewGame() {
  const coordinates = '51.203275,4.450912';
  const locationName = 'Boelaerpark';
  const nextPage = 'stop1';
  
  location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`);
}

function continueGame() {
  // Logic for continuing saved game
  console.log('Continue game clicked');
  // TODO: Implementeer continue game functionaliteit
}

// Touch/Click feedback voor knoppen
function addButtonFeedback(button) {
  // Voor mobile touch events
  button.addEventListener('touchstart', (e) => {
    e.preventDefault();
    button.classList.add('pressed');
  }, { passive: false });
  
  button.addEventListener('touchend', (e) => {
    e.preventDefault();
    button.classList.remove('pressed');
  }, { passive: false });
  
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
  
  if (newGameBtn) {
    newGameBtn.addEventListener('click', startNewGame);
    addButtonFeedback(newGameBtn);
  }
  
  if (continueBtn) {
    continueBtn.addEventListener('click', continueGame);
    addButtonFeedback(continueBtn);
  }
}); 