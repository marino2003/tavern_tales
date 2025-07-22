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
}); 