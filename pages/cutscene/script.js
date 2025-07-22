// Cutscene Logic
console.log('Cutscene loaded');

// Event listeners toevoegen wanneer DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
  console.log('Cutscene DOM Content Loaded');
  
  const heroContainer = document.getElementById('heroSpriteContainer');
  const warriorContainer = document.getElementById('warriorSpriteContainer');
  
  console.log('Containers gevonden:', {
    heroContainer: !!heroContainer,
    warriorContainer: !!warriorContainer,
    HeroSprite: !!window.HeroSprite,
    WarriorSprite: !!window.WarriorSprite
  });
  
  // Maak hero sprite
  if (heroContainer && window.HeroSprite) {
    const heroSprite = window.HeroSprite.create({
      scale: 4,
      speed: 0.8,
      container: heroContainer,
      className: 'hero-sprite--xlarge'
    });
    
    console.log('Hero sprite toegevoegd aan cutscene', heroSprite);
  } else {
    console.error('Hero container of HeroSprite niet gevonden', { 
      heroContainer: !!heroContainer, 
      HeroSprite: !!window.HeroSprite 
    });
  }
  
  // Maak warrior sprite
  if (warriorContainer && window.WarriorSprite) {
    console.log('Creating warrior sprite met parameters:', {
      scale: 4,
      speed: 1.0,
      container: warriorContainer,
      className: 'cutscene-warrior',
      mirrored: true
    });
    
    const warriorSprite = window.WarriorSprite.create({
      scale: 4,
      speed: 1.0,
      container: warriorContainer,
      className: 'cutscene-warrior',
      mirrored: true
    });
    
    console.log('Warrior sprite toegevoegd aan cutscene', warriorSprite);
    console.log('Warrior sprite dataset:', warriorSprite.dataset);
    console.log('Warrior sprite mirrored animation:', warriorSprite._mirroredAnimation);
    
    // Check na 1 seconde of de animatie draait
    setTimeout(() => {
      console.log('1 seconde later - warrior sprite status:', {
        backgroundPosition: warriorSprite.style.backgroundPosition,
        dataset: warriorSprite.dataset,
        hasAnimation: !!warriorSprite._mirroredAnimation
      });
    }, 1000);
  } else {
    console.error('Warrior container of WarriorSprite niet gevonden', { 
      warriorContainer: !!warriorContainer, 
      WarriorSprite: !!window.WarriorSprite 
    });
  }
  
  // Start inkomende overgang
  const transition = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F'
  });
  
  transition.transitionIn();
  
  // Test dialoog systeem direct na laden
  setTimeout(() => {
    console.log('Test dialoog systeem...');
    
    // Check of DialogueSystem geladen is
    if (window.DialogueSystem) {
      console.log('DialogueSystem gevonden, testen met eenvoudige dialoog...');
      
      // Test met eenvoudige dialoog zonder portret
      window.DialogueSystem.showDialogue([
        {
          text: "Test dialoog - werkt het systeem?",
          portrait: null
        }
      ], {
        onComplete: () => {
          console.log('Test dialoog voltooid! Starten echte cutscene...');
          // Na test, start echte cutscene
          setTimeout(() => {
            startCutsceneDialogue();
          }, 1000);
        }
      });
    } else {
      console.error('DialogueSystem niet beschikbaar!');
    }
  }, 2000);
  
  // Original cutscene dialoog als backup (na 5 seconden)
  setTimeout(() => {
    if (!window.DialogueSystem?.current?.isActive()) {
      console.log('Backup: proberen cutscene dialoog direct...');
      startCutsceneDialogue();
    }
  }, 5000);
});

// Cutscene dialoog sequentie
function startCutsceneDialogue() {
  console.log('Starten cutscene dialoog...');
  
  // Check of DialogueSystem beschikbaar is
  console.log('DialogueSystem check:', {
    available: !!window.DialogueSystem,
    showDialogue: !!window.DialogueSystem?.showDialogue,
    current: !!window.DialogueSystem?.current
  });
  
  if (!window.DialogueSystem) {
    console.error('DialogueSystem niet geladen!');
    return;
  }
  
  const cutsceneDialogues = [
    {
      text: "Eindelijk... na al die jaren heb ik je gevonden, {PLAYER}.",
      portrait: '../../assets/character_port/herp.png',
      speaker: "Warrior"
    },
    {
      text: "Wie ben jij? En waarom ken je mij?",
      portrait: '../../assets/spritesheets/hero_main/Combat Ready Idle.png',
      speaker: "Held"
    },
    {
      text: "Ik ben de laatste bewaker van de oude tradities. Dracohol heeft de heilige bieren gestolen!",
      portrait: '../../assets/spritesheets/npc_1/spritesheet.png',
      speaker: "Wijze Krijger"
    },
    {
      text: "{PLAYER}, de stad heeft jouw hulp nodig om de verloren bieren terug te vinden.",
      portrait: '../../assets/spritesheets/npc_1/spritesheet.png',
      speaker: "Wijze Krijger"
    },
    {
      text: "Waar moet ik beginnen met zoeken?",
      portrait: '../../assets/spritesheets/hero_main/Combat Ready Idle.png',
      speaker: "Held"
    },
    {
      text: "Begin bij de oude cafés in het centrum, {PLAYER}. Daar vind je de eerste aanwijzingen...",
      portrait: '../../assets/spritesheets/npc_1/spritesheet.png',
      speaker: "Wijze Krijger"
    }
  ];
  
  console.log('Dialogen klaar:', cutsceneDialogues);
  
  // Toon dialoog met custom opties
  try {
    window.DialogueSystem.showDialogue(cutsceneDialogues, {
      typingSpeed: 40, // Iets sneller voor cutscene
      onComplete: () => {
        console.log('Cutscene dialoog voltooid!');
        // Hier kun je naar de volgende pagina gaan of andere acties uitvoeren
        setTimeout(() => {
          // Bijvoorbeeld: ga naar navigate pagina
          // window.location.href = '../navigate/';
          console.log('Cutscene beëindigd - klaar voor gameplay!');
        }, 1500);
      },
      onNext: (dialogue, index) => {
        console.log(`Cutscene dialoog ${index + 1}: ${dialogue.speaker} spreekt`);
        
        // Optioneel: voeg speciale effecten toe per dialoog
        if (index === 0) {
          console.log('Eerste ontmoeting - dramatische muziek kan hier starten');
        }
        if (index === 2) {
          console.log('Onthulling over Dracohol - spanning opbouwen');
        }
      }
    });
    
    console.log('showDialogue aangeroepen succesvol');
  } catch (error) {
    console.error('Fout bij het starten van dialoog:', error);
  }
} 