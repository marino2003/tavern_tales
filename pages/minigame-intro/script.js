document.addEventListener('DOMContentLoaded', function() {
  
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
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
  
  const dialogueSystem = initDialogueSystem({
    typingSpeed: 50,
    autoAdvance: false,
    onComplete: function() {
      startMinigame();
    }
  });
  
  function startMinigame() {
    transitionOverlay.transitionOut(() => {
      window.location.href = '../minigame1/index.html';
    });
  }
  
  function backToNavigation() {
    transitionOverlay.transitionOut(() => {
      window.location.href = '../navigate/index.html';
    });
  }
  
  function initializeScene() {
    setTimeout(() => {
      dialogueSystem.startDialogue(minigameIntroDialogues);
    }, 500);
  }
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      backToNavigation();
    }
  });
  
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
        backToNavigation();
      }
    }
  }
  
  initializeScene();
  
}); 