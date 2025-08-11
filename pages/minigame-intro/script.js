// Minigame Intro pagina script
document.addEventListener('DOMContentLoaded', function() {
  
  // Transition overlay initialiseren
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
  // Dialoog data voor minigame intro
  const minigameIntroDialogues = [
    {
      character: "Barvrouw",
      text: "Dus jij bent de beruchte ‘viltjesjager’!",
      portrait: "../../assets/character_port/npc.png"
    },
    {
      character: "Barvrouw",
      text: "Dracohol liet hier iets achter, maar niet waar je ’t verwacht",
      portrait: "../../assets/character_port/npc.png"
    },
    {
      character: "Barvrouw",
      text: "Dit was geen kroeg. Kijk om je heen. Wat zie je?",
      portrait: "../../assets/character_port/npc.png"
    }
  ];
  
  // Dialoog systeem initialiseren
  const dialogueSystem = initDialogueSystem({
    typingSpeed: 50,
    autoAdvance: false,
    onComplete: function() {
      console.log('Dialoog voltooid, start minigame...');
      startMinigame();
    }
  });
  
  // Start minigame functie
  function startMinigame() {
    console.log('Start minigame 1...');
    
    // Start transition out
    transitionOverlay.transitionOut(() => {
      // Navigeer naar de minigame 1 pagina
      window.location.href = '../minigame1/index.html';
    }).then(() => {
      console.log('Transition out voltooid');
    });
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
  
  // Initialiseer scene en start dialoog
  function initializeScene() {
    // Start dialoog na korte vertraging
    setTimeout(() => {
      // Start dialoog
      dialogueSystem.startDialogue(minigameIntroDialogues);
    }, 500);
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      // Escape gaat terug
      event.preventDefault();
      backToNavigation();
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
  
  // Start de scene
  initializeScene();
  
  console.log('Minigame intro pagina geladen');
  
}); 