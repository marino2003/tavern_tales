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
      // Start transitie
      if (window.TransitionOverlay) {
        const transition = new window.TransitionOverlay({
          duration: 1500,
          color: '#A0303F',
          direction: 'left-to-right'
        });
        
        transition.transitionOut(() => {
          // Voeg dummy coördinaten toe voor testing
          const dummyCoordinates = '51.2194,4.4025'; // Antwerpen centrum
          const dummyLocationName = 'De Koninck Brouwerij';
          const dummyNextPage = 'stop1';
          
          // Sla dummy data op in localStorage
          localStorage.setItem('coordinates', dummyCoordinates);
          localStorage.setItem('locationName', dummyLocationName);
          localStorage.setItem('nextPage', dummyNextPage);
          
          window.location.href = `../navigate/index.html?coordinates=${dummyCoordinates}&locationName=${encodeURIComponent(dummyLocationName)}&nextPage=${dummyNextPage}`;
        });
      } else {
        // Voeg dummy coördinaten toe voor testing
        const dummyCoordinates = '51.2194,4.4025'; // Antwerpen centrum
        const dummyLocationName = 'De Koninck Brouwerij';
        const dummyNextPage = 'stop1';
        
        // Sla dummy data op in localStorage
        localStorage.setItem('coordinates', dummyCoordinates);
        localStorage.setItem('locationName', dummyLocationName);
        localStorage.setItem('nextPage', dummyNextPage);
        
        window.location.href = `../navigate/index.html?coordinates=${dummyCoordinates}&locationName=${encodeURIComponent(dummyLocationName)}&nextPage=${dummyNextPage}`;
      }
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
       text: "{PLAYER}, je komst is een zegen… en onze enige hoop.",
       portrait: window.DialogueSystem.Characters.NPC
    },

    {
      text: "Eeuwenlang lag hij te slapen, diep onder onze straten. Nu … is Dracohol ontwaakt.",
      portrait: window.DialogueSystem.Characters.NPC
   },

   {
    text: "Verzamel de Vier Legendarische Bieren van De Koninck.... Alleen zij kunnen de draak keren.",
      portrait: window.DialogueSystem.Characters.NPC
   },

   {
    text: "Als ik daarna tenminste een pintje krijg…",
    portrait: window.DialogueSystem.Characters.HERP,
    isLast: true // Dit is het laatste dialoog
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
        
        // Toon continue button na alle dialogen
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
          continueBtn.style.display = 'block';
          console.log('Continue button wordt getoond');
        } else {
          console.error('Continue button niet gevonden!');
        }
      },
      onNext: (dialogue, index) => {
        console.log(`Cutscene dialoog ${index + 1} gestart`);
        
        // Check of dit het laatste dialoog was
        if (dialogue.isLast) {
          console.log('Laatste dialoog gestart - button wordt getoond na voltooiing');
          
          // Toon button na een korte delay met animatie
          setTimeout(() => {
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn) {
              continueBtn.style.display = 'block';
              continueBtn.style.opacity = '0';
              continueBtn.style.transform = 'translateX(-50%) scale(0.8) translateY(20px)';
              
              // Animate in
              setTimeout(() => {
                continueBtn.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                continueBtn.style.opacity = '1';
                continueBtn.style.transform = 'translateX(-50%) scale(1) translateY(0)';
              }, 100);
              
              console.log('Continue button wordt getoond na laatste dialoog');
            }
          }, 1000);
        }
      }
    });
    
    console.log('showDialogue aangeroepen succesvol');
  } catch (error) {
    console.error('Fout bij het starten van dialoog:', error);
  }
} 