// Cutscene Logic
console.log('Cutscene loaded');

// Event listeners toevoegen wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  // Initialiseer hero sprite
  if (window.HeroSprite) {
    const heroElement = document.getElementById('heroSprite');
    if (heroElement) {
      window.heroController = new HeroSprite.Controller(heroElement);
      console.log('🎮 Hero sprite controller geladen voor cutscene!');
    }
  }

  // Initialiseer NPC sprite
  if (window.NPCSprite) {
    const npcElement = document.getElementById('npcSprite');
    if (npcElement) {
      window.npcController = new NPCSprite.Controller(npcElement);
      console.log('⚔️ NPC sprite controller geladen voor cutscene!');
    }
  }

  // Start cutscene dialoog na 2 seconden
  setTimeout(() => {
    startCutsceneDialogue();
  }, 2000);

  // Continue button functionaliteit
  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      console.log('Cutscene voltooid - navigeren naar volgende pagina');
      window.location.href = '../navigate/';
    });
  }
});

// Cutscene dialoog sequentie
function startCutsceneDialogue() {
  console.log('Starten cutscene dialoog...');
  
  if (!window.DialogueSystem) {
    console.error('DialogueSystem niet geladen!');
    return;
  }
  
  // Voeg hier je eigen dialoogregels toe:
  const cutsceneDialogues = [
    {
       text: "Jouw dialoogregel hier...",
       portrait: window.DialogueSystem.Characters.HERO
    },
  ];
  
  if (cutsceneDialogues.length === 0) {
    console.warn('cutsceneDialogues is leeg. Voeg je eigen dialoog toe!');
    return;
  }

  // Toon dialoog met custom opties
  try {
    window.DialogueSystem.showDialogue(cutsceneDialogues, {
      typingSpeed: 40, // Iets sneller voor cutscene
      onComplete: () => {
        console.log('Cutscene dialoog voltooid!');
        // Toon continue button na dialoog
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
          continueBtn.style.display = 'block';
        }
      },
      onNext: (dialogue, index) => {
        console.log(`Cutscene dialoog ${index + 1} gestart`);
      }
    });
    
    console.log('showDialogue aangeroepen succesvol');
  } catch (error) {
    console.error('Fout bij het starten van dialoog:', error);
  }
} 