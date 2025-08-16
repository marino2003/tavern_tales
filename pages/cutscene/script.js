document.addEventListener('DOMContentLoaded', () => {
  if (window.HeroSprite) {
    const heroElement = document.getElementById('heroSprite');
    if (heroElement) {
      window.heroController = new HeroSprite.Controller(heroElement);
    }
  }

  if (window.NPCSprite) {
    const npcElement = document.getElementById('npcSprite');
    if (npcElement) {
      window.npcController = new NPCSprite.Controller(npcElement);
    }
  }

  setTimeout(() => {
    startCutsceneDialogue();
  }, 2000);

  const continueBtn = document.getElementById('continueBtn');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (window.TransitionOverlay) {
        const transition = new window.TransitionOverlay({
          duration: 1500,
          color: '#A0303F',
          direction: 'left-to-right'
        });
        
        transition.transitionOut(() => {
          window.location.href = '../navigate/?coordinates=51.2194,4.4025&locationName=Test%20Cafe&nextPage=stop1';
        });
      } else {
        window.location.href = '../navigate/?coordinates=51.2194,4.4025&locationName=Test%20Cafe&nextPage=stop1';
      }
    });
  }
});

function startCutsceneDialogue() {
  
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

        
        // Toon continue button na alle dialogen
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
          continueBtn.style.display = 'block';

        } else {
          console.error('Continue button niet gevonden!');
        }
      },
      onNext: (dialogue, index) => {

        
        // Check of dit het laatste dialoog was
        if (dialogue.isLast) {

          
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
              

            }
          }, 1000);
        }
      }
    });
    

  } catch (error) {
    console.error('Fout bij het starten van dialoog:', error);
  }
} 