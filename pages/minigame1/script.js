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
  const bollekeReward = document.getElementById('bollekeReward');
  
  // Debug: check of bollekeReward element bestaat
  console.log('bollekeReward element bij initialisatie:', bollekeReward);
  console.log('bollekeReward element HTML:', bollekeReward ? bollekeReward.outerHTML : 'niet gevonden');
  
  // Modal components
  let hintModal = null;
  let answerModal = null;
  
  // Dialogue system
  let dialogueSystem = null;
  
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
      secondaryButtonText: null,
      customContent: `
        <div class="modal-text">
          <p>Wat was de oorspronkelijke functie van Den Engel?</p>
        </div>
      `,
      onPrimaryClick: (value) => {
        submitAnswer(value);
      }
    });
    
    // Initialiseer dialoog systeem
    dialogueSystem = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      autoAdvance: false,
      skipTypingOnTouch: true
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
      console.log('Modal gesloten, ga naar showSuccess...');
      showSuccess();
    } else {
      console.log('Fout antwoord');
      answerModal.showError('Dat is niet het juiste antwoord. Probeer het nog eens!');
    }
  }
  
  // Update speler data (bier gevonden)
  function updatePlayerData() {
    const playerData = window.PlayerData.getData();
    playerData.beersFound = Math.min(playerData.beersFound + 1, 4);
    window.PlayerData.saveData(playerData);
    console.log('Bier gevonden! Totaal:', playerData.beersFound);
  }
  
  // Toon success dialoog
  function showSuccess() {
    console.log('Toon success dialoog...');
    
    // Update speler data (bier gevonden)
    updatePlayerData();
    
    // Verberg game interface
    gameInterface.style.display = 'none';
    
    // Toon dialoog met bestaande dialoog systeem
    const successDialogues = [
      {
        character: 'Barvrouw',
        text: 'Je hebt het goed!',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'Het was inderdaad een drogisterij. Al sinds 1740!',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'Hier neem dit',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'ik heb het gevonden tussen de oude medicijn schappen.',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    // Gebruik het bestaande dialoog systeem
    console.log('DialogueSystem beschikbaar:', !!window.DialogueSystem);
    
    // Maak een nieuwe dialoog instance met de callback
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        console.log('Dialoog voltooid, toon bolleke beloning...');
        showBollekeReward();
      }
    });
    
    dialogueInstance.startDialogue(successDialogues);
  }
  
  // Toon bolleke beloning animatie
  function showBollekeReward() {
    console.log('Toon bolleke beloning...');
    console.log('bollekeReward element:', bollekeReward);
    
    if (!bollekeReward) {
      console.error('bollekeReward element niet gevonden!');
      alert('bollekeReward element niet gevonden!');
      continueToNext();
      return;
    }
    
    // Toon bolleke reward interface
    bollekeReward.style.display = 'flex';
    bollekeReward.style.position = 'absolute';
    bollekeReward.style.top = '0';
    bollekeReward.style.left = '0';
    bollekeReward.style.width = '100%';
    bollekeReward.style.height = '100%';
    bollekeReward.style.zIndex = '40';
    bollekeReward.style.background = 'rgba(0, 0, 0, 0.7)';
    bollekeReward.style.opacity = '0';
    bollekeReward.style.transition = 'opacity 0.5s ease';
    
    console.log('Bolleke reward display set naar flex');
    console.log('Bolleke reward style.display:', bollekeReward.style.display);
    
    // Trigger animatie
    setTimeout(() => {
      bollekeReward.style.opacity = '1';
      console.log('Bolleke reward opacity set naar 1');
      console.log('Bolleke reward style.opacity:', bollekeReward.style.opacity);
      
      // Test CSS properties
      const computedStyle = window.getComputedStyle(bollekeReward);
      console.log('Bolleke reward computed opacity:', computedStyle.opacity);
      console.log('Bolleke reward computed display:', computedStyle.display);
      console.log('Bolleke reward computed z-index:', computedStyle.zIndex);
    }, 100);
    
    // Event listener voor klikken om verder te gaan
    bollekeReward.addEventListener('click', handleBollekeClick, { once: true });
    console.log('Click event listener toegevoegd aan bollekeReward');
    
    // Voeg een hint toe dat de speler moet klikken
    setTimeout(() => {
      const hintText = document.createElement('div');
      hintText.textContent = 'Klik op de bolleke om verder te gaan';
      hintText.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-family: 'm6x11plus', 'Courier New', 'Courier', monospace;
        font-size: 20px;
        text-align: center;
        z-index: 50;
        animation: pulse 1.5s infinite;
      `;
      document.body.appendChild(hintText);
      
      // Verwijder hint na 5 seconden
      setTimeout(() => {
        if (hintText.parentNode) {
          hintText.parentNode.removeChild(hintText);
        }
      }, 5000);
    }, 2000);
  }
  
  // Handle bolleke klik
  function handleBollekeClick() {
    console.log('Bolleke geklikt, toon vervolg dialoog...');
    
    // Voeg een klik effect toe
    bollekeReward.style.transform = 'scale(0.95)';
    
    // Fade out bolleke reward
    setTimeout(() => {
      bollekeReward.style.opacity = '0';
      console.log('Bolleke reward fade out gestart');
    }, 100);
    
    setTimeout(() => {
      bollekeReward.style.display = 'none';
      showFollowUpDialogue();
    }, 600);
  }
  
  // Toon vervolg dialoog na bolleke animatie
  function showFollowUpDialogue() {
    console.log('Toon vervolg dialoog...');
    
    // Vervolg dialoog van de barvrouw
    const followUpDialogues = [
      {
        character: 'Barvrouw',
        text: 'Nu heb je je eerste bolleke!',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'Er zijn nog drie andere cafés waar Dracohol bieren heeft verstopt.',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'Ga naar de Grote Markt om je volgende uitdaging te vinden!',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    // Gebruik het bestaande dialoog systeem
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        console.log('Vervolg dialoog voltooid, ga naar navigatie...');
        continueToNext();
      }
    });
    
    dialogueInstance.startDialogue(followUpDialogues);
  }
  
  // Ga verder naar volgende pagina
  function continueToNext() {
    console.log('Ga verder...');
    
    // Sla volgende pagina op in localStorage
    localStorage.setItem('nextPage', '../stop2/index.html');
    localStorage.setItem('coordinates', '51.2194,4.4025'); // Grote Markt Antwerpen
    localStorage.setItem('locationName', 'Grote Markt Antwerpen');
    
    // Start transition out
    transitionOverlay.transitionOut(() => {
      // Navigeer naar navigatie pagina
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