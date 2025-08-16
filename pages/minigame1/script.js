document.addEventListener('DOMContentLoaded', function() {
  
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
  const minigameScrollOverlay = document.getElementById('minigameScrollOverlay');
  const startMinigameButton = document.getElementById('startMinigameButton');
  const gameInterface = document.getElementById('gameInterface');
  const hintButton = document.getElementById('hintButton');
  const answerButton = document.getElementById('answerButton');
  const bollekeReward = document.getElementById('bollekeReward');
  
  let hintModal = null;
  let answerModal = null;
  let dialogueSystem = null;
  let gameStarted = false;
  
  function initModals() {
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
    
    dialogueSystem = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      autoAdvance: false,
      skipTypingOnTouch: true
    });
  }
  
  function startGame() {
    minigameScrollOverlay.style.opacity = '0';
    minigameScrollOverlay.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      minigameScrollOverlay.style.display = 'none';
      gameStarted = true;
      gameInterface.style.display = 'flex';
      gameInterface.style.opacity = '0';
      gameInterface.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        gameInterface.style.opacity = '1';
        gameInterface.style.transform = 'translateY(0)';
      }, 100);
    }, 300);
  }
  
  function showHint() {
    hintModal.show();
  }
  
  function showAnswerModal() {
    answerModal.show();
  }
  
  function submitAnswer(userAnswer) {
    const correctAnswers = ['drogisterij', 'drogist', 'apotheek', 'pharmacy'];
    
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isCorrect = correctAnswers.some(answer => 
      normalizedAnswer.includes(answer) || answer.includes(normalizedAnswer)
    );
    
    if (isCorrect) {
      answerModal.close();
      showSuccess();
    } else {
      answerModal.showError('Dat is niet het juiste antwoord. Probeer het nog eens!');
    }
  }
  
  function updatePlayerData() {
    const playerData = window.PlayerData.getData();
    playerData.beersFound = Math.min(playerData.beersFound + 1, 4);
    window.PlayerData.saveData(playerData);
  }
  
  function showSuccess() {
    updatePlayerData();
    
    gameInterface.style.display = 'none';
    
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
    
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        showBollekeReward();
      }
    });
    
    dialogueInstance.startDialogue(successDialogues);
  }
  
  function showBollekeReward() {
    if (!bollekeReward) {
      alert('bollekeReward element niet gevonden!');
      continueToNext();
      return;
    }
    
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
    
    setTimeout(() => {
      bollekeReward.style.opacity = '1';
    }, 100);
    
    bollekeReward.addEventListener('click', handleBollekeClick, { once: true });
    setTimeout(() => {
      const hintText = document.createElement('div');
      hintText.className = 'hint-text';
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
  
  function handleBollekeClick() {
    const hintText = document.querySelector('.hint-text');
    if (hintText) {
      hintText.classList.add('fade-out');
      setTimeout(() => {
        hintText.remove();
      }, 300);
    }
    
    bollekeReward.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      bollekeReward.style.opacity = '0';
    }, 100);
    
    setTimeout(() => {
      bollekeReward.style.display = 'none';
      showFollowUpDialogue();
    }, 600);
  }
  
  function showFollowUpDialogue() {
    
    // Vervolg dialoog van de barvrouw
    const followUpDialogues = [
      {
        character: 'Barvrouw',
        text: 'Wat wil je nu doen?',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        showChoiceDialog();
      }
    });
    dialogueInstance.startDialogue(followUpDialogues);
  }
  
  function showChoiceDialog() {
    const choiceDialogues = [
      {
        character: 'Barvrouw',
        text: 'Moet je geljk door, of heb je nog tijd voor een pintje?',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        showChoiceButtons();
      }
    });
    
    dialogueInstance.startDialogue(choiceDialogues);
  }
  
  function showChoiceButtons() {
    
    // Maak keuze interface
    const choiceInterface = document.createElement('div');
    choiceInterface.id = 'choiceInterface';
    choiceInterface.className = 'choice-interface';
    choiceInterface.innerHTML = `
      <div class="choice-buttons">
        <button class="pixel-button primary choice-button" id="continueButton">
          <img src="../../assets/ui/button_svg.svg" alt="" class="pixel-button-svg">
          <span class="pixel-button-text">Ga naar de volgende locatie</span>
        </button>
        <button class="pixel-button secondary choice-button" id="stayButton">
          <img src="../../assets/ui/button_svg.svg" alt="" class="pixel-button-svg">
          <span class="pixel-button-text">Ik blijf nog even hangen</span>
        </button>
      </div>
    `;
    
    // Voeg toe aan body
    document.body.appendChild(choiceInterface);
    
    // Event listeners
    document.getElementById('stayButton').addEventListener('click', handleStayChoice);
    document.getElementById('continueButton').addEventListener('click', handleContinueChoice);
  }
  
  // Handle "blijf hangen" keuze
  function handleStayChoice() {
    console.log('Speler kiest om te blijven...');
    
    // Verwijder keuze interface
    const choiceInterface = document.getElementById('choiceInterface');
    if (choiceInterface) {
      choiceInterface.remove();
    }
    
    // Toon "blijf hangen" dialoog
    const stayDialogues = [
      {
        character: 'Barvrouw',
        text: 'Ik schenk hem voor je in! Neem zolang als je wilt.',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        console.log('Blijf dialoog voltooid, toon quest interface...');
        showStayQuestInterface();
      }
    });
    
    dialogueInstance.startDialogue(stayDialogues);
  }
  
  // Handle "ga verder" keuze
  function handleContinueChoice() {
    console.log('Speler kiest om verder te gaan...');
    
    // Verwijder keuze interface
    const choiceInterface = document.getElementById('choiceInterface');
    if (choiceInterface) {
      choiceInterface.remove();
    }
    
    // Toon "ga verder" dialoog
    const continueDialogues = [
      {
        character: 'Barvrouw',
        text: 'Bedankt {PLAYER},',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'je bent de enige die opstaat tegen Dracohol.',
        portrait: '../../assets/character_port/npc.png'
      },
      {
        character: 'Barvrouw',
        text: 'Kom gerust nog eens langs, tot ziens!',
        portrait: '../../assets/character_port/npc.png'
      }
    ];
    
    const dialogueInstance = window.DialogueSystem.initDialogueSystem({
      typingSpeed: 50,
      onComplete: () => {
        console.log('Ga verder dialoog voltooid, navigeer...');
        continueToNext();
      }
    });
    
    dialogueInstance.startDialogue(continueDialogues);
  }
  
  // Toon quest interface voor "blijf hangen"
  function showStayQuestInterface() {
    console.log('Toon quest interface...');
    
    // Maak quest bericht
    const questMessage = document.createElement('div');
    questMessage.id = 'questMessage';
    questMessage.className = 'quest-message';
    questMessage.innerHTML = `
      <div class="quest-content">
        <img src="../../assets/ui/vergroot_glas.png" alt="Quest icon" class="quest-icon">
        <div class="quest-text">Blijf gerust nog wat langer in Den Engel. Tik op "Ga verder" wanneer je klaar bent om te vertrekken.</div>
      </div>
    `;
    
    // Maak "ga verder" knop
    const continueButton = document.createElement('button');
    continueButton.id = 'finalContinueButton';
    continueButton.className = 'pixel-button primary final-continue-button';
    continueButton.innerHTML = `
      <img src="../../assets/ui/button_svg.svg" alt="" class="pixel-button-svg">
      <span class="pixel-button-text">Ga naar de volgende locatie</span>
    `;
    
    // Voeg toe aan body
    document.body.appendChild(questMessage);
    document.body.appendChild(continueButton);
    
    // Event listener
    continueButton.addEventListener('click', () => {
      console.log('Final continue button geklikt...');
      
      // Verwijder quest interface
      questMessage.remove();
      continueButton.remove();
      
      // Toon afscheid dialoog
      const farewellDialogues = [
        {
          character: 'Barvrouw',
          text: 'Tot ziens! Veel succes met je zoektocht.',
          portrait: '../../assets/character_port/npc.png'
        }
      ];
      
      const dialogueInstance = window.DialogueSystem.initDialogueSystem({
        typingSpeed: 50,
        onComplete: () => {
          console.log('Afscheid dialoog voltooid, navigeer...');
          continueToNext();
        }
      });
      
      dialogueInstance.startDialogue(farewellDialogues);
    });
  }
  
  // Ga verder naar volgende pagina
  function continueToNext() {
    localStorage.setItem('nextPage', '../stop2/index.html');
    localStorage.setItem('coordinates', '51.2194,4.4025');
    localStorage.setItem('locationName', 'Grote Markt Antwerpen');
    
    transitionOverlay.transitionOut(() => {
      window.location.href = '../navigate/index.html';
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