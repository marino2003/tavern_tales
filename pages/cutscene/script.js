// Cutscene Logic
console.log('Cutscene loaded');

// Touch/Click feedback voor knoppen
function addButtonFeedback(button) {
  // Voor mobile touch events
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
  
  button.addEventListener('mouseleave', () => {
    button.classList.remove('pressed');
  });
}

function startAdventure() {
  console.log('Begin avontuur clicked');
  
  // Ga naar navigate pagina om naar eerste locatie te gaan
  const coordinates = '51.203275,4.450912';
  const locationName = 'Boelaerpark';
  const nextPage = 'stop1';
  
  location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`);
}

// Event listeners toevoegen wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  console.log('Cutscene DOM Content Loaded');
  
  const continueBtn = document.getElementById('continueBtn');
  
  if (continueBtn) {
    continueBtn.addEventListener('click', startAdventure);
    addButtonFeedback(continueBtn);
  } else {
    console.error('Continue button not found!');
  }
  
  // Start inkomende overgang
  const transition = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F'
  });
  
  transition.transitionIn();
}); 