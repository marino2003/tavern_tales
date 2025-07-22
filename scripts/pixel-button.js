/**
 * Pixel Art Button Helper voor De Koninck Game
 * 
 * Gebruik: createPixelButton('Nieuw Spel', () => startGame())
 */

/**
 * Creëert een pixel art button gebaseerd op het Figma ontwerp
 * @param {string} text - De tekst op de knop
 * @param {function} onClick - De functie die uitgevoerd wordt bij klik
 * @param {string} variant - 'primary' (rood), 'secondary' (grijs), of 'tertiary' (lichtblauw)
 * @returns {HTMLButtonElement} - De gecreëerde button element
 */
function createPixelButton(text, onClick, variant = 'primary') {
  const button = document.createElement('button');
  let className = 'figma-pixel-button';
  
  if (variant === 'secondary') className += ' secondary';
  else if (variant === 'tertiary') className += ' tertiary';
  
  button.className = className;
  button.onclick = onClick;
  
  // Alle pixel art elementen van de Figma knop
  button.innerHTML = `
    <!-- Zwarte border elementen -->
    <div style="width: 260.28px; height: 2.93px; left: 12.16px; top: 0px; position: absolute; background: black"></div>
    <div style="width: 260.28px; height: 2.93px; left: 12.16px; top: 73.26px; position: absolute; background: black"></div>
    <div style="width: 4.87px; height: 2.93px; left: 272.45px; top: 2.93px; position: absolute; background: black"></div>
    <div style="width: 4.87px; height: 2.93px; left: 12.16px; top: 5.86px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 277.32px; top: 5.86px; position: absolute; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 7.30px; top: 8.79px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 279.74px; top: 8.79px; position: absolute; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 4.87px; top: 11.72px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 2.43px; height: 52.75px; left: 282.17px; top: 11.72px; position: absolute; background: black"></div>
    <div style="width: 2.43px; height: 52.75px; left: 2.43px; top: 64.47px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 279.74px; top: 64.47px; position: absolute; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 4.87px; top: 67.40px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 277.32px; top: 67.41px; position: absolute; background: black"></div>
    <div style="width: 2.43px; height: 2.93px; left: 7.30px; top: 70.34px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    <div style="width: 4.87px; height: 2.93px; left: 272.45px; top: 70.33px; position: absolute; background: black"></div>
    <div style="width: 4.87px; height: 2.93px; left: 12.16px; top: 73.26px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: black"></div>
    
    <!-- Donkere rode fill (#AB363A) -->
    <div style="width: 260.28px; height: 70.33px; left: 12.16px; top: 2.93px; position: absolute; background: #AB363A"></div>
    <div style="width: 4.87px; height: 64.47px; left: 272.45px; top: 5.86px; position: absolute; background: #AB363A"></div>
    <div style="width: 2.43px; height: 58.61px; left: 277.32px; top: 8.79px; position: absolute; background: #AB363A"></div>
    <div style="width: 2.43px; height: 52.75px; left: 279.74px; top: 11.72px; position: absolute; background: #AB363A"></div>
    <div style="width: 2.43px; height: 52.75px; left: 2.43px; top: 11.72px; position: absolute; background: #AB363A"></div>
    <div style="width: 2.43px; height: 58.61px; left: 4.87px; top: 8.79px; position: absolute; background: #AB363A"></div>
    <div style="width: 4.87px; height: 64.47px; left: 7.30px; top: 5.86px; position: absolute; background: #AB363A"></div>
    
    <!-- Lichtere rode highlight (#E75F64) -->
    <div style="width: 247.99px; height: 2.41px; left: 18.09px; top: 6.50px; position: absolute; background: #E75F64"></div>
    <div style="width: 247.99px; height: 2.41px; left: 18.09px; top: 66.83px; position: absolute; background: #E75F64"></div>
    <div style="width: 4.64px; height: 2.41px; left: 266.06px; top: 8.92px; position: absolute; background: #E75F64"></div>
    <div style="width: 4.64px; height: 2.41px; left: 18.09px; top: 11.33px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 270.70px; top: 11.32px; position: absolute; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 13.45px; top: 13.74px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 273.02px; top: 13.74px; position: absolute; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 11.14px; top: 16.15px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 2.32px; height: 43.44px; left: 275.34px; top: 16.15px; position: absolute; background: #E75F64"></div>
    <div style="width: 2.32px; height: 43.44px; left: 8.82px; top: 59.60px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 273.02px; top: 59.59px; position: absolute; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 11.14px; top: 62px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 270.70px; top: 62.01px; position: absolute; background: #E75F64"></div>
    <div style="width: 2.32px; height: 2.41px; left: 13.45px; top: 64.42px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    <div style="width: 4.64px; height: 2.41px; left: 266.06px; top: 64.42px; position: absolute; background: #E75F64"></div>
    <div style="width: 4.64px; height: 2.41px; left: 18.09px; top: 66.84px; position: absolute; transform: rotate(180deg); transform-origin: top left; background: #E75F64"></div>
    
    <!-- Main content area (#E2665B) -->
    <div style="width: 247.99px; height: 57.92px; left: 18.09px; top: 8.92px; position: absolute; background: #E2665B"></div>
    <div style="width: 4.64px; height: 53.09px; left: 266.06px; top: 11.32px; position: absolute; background: #E2665B"></div>
    <div style="width: 2.32px; height: 48.27px; left: 270.70px; top: 13.74px; position: absolute; background: #E2665B"></div>
    <div style="width: 2.32px; height: 43.44px; left: 273.02px; top: 16.15px; position: absolute; background: #E2665B"></div>
    <div style="width: 2.32px; height: 43.44px; left: 8.82px; top: 16.15px; position: absolute; background: #E2665B"></div>
    <div style="width: 2.32px; height: 48.27px; left: 11.14px; top: 13.74px; position: absolute; background: #E2665B"></div>
    <div style="width: 4.64px; height: 53.09px; left: 13.45px; top: 11.32px; position: absolute; background: #E2665B"></div>
    
    <!-- Knop tekst -->
    <div class="button-text">${text}</div>
  `;
  
  return button;
}

/**
 * Voegt een pixel art button toe aan een bestaand HTML element
 * @param {string|HTMLElement} container - CSS selector of HTML element waar de knop aan toegevoegd wordt
 * @param {string} text - De tekst op de knop
 * @param {function} onClick - De functie die uitgevoerd wordt bij klik
 * @param {string} variant - 'primary' (rood), 'secondary' (grijs), of 'tertiary' (lichtblauw)
 * @param {number} animationDelay - Delay in ms voor de animatie (optioneel)
 */
function addPixelButton(container, text, onClick, variant = 'primary', animationDelay = 0) {
  const containerElement = typeof container === 'string' ? document.querySelector(container) : container;
  
  if (!containerElement) {
    console.error('Container element niet gevonden:', container);
    return null;
  }
  
  const button = createPixelButton(text, onClick, variant);
  containerElement.appendChild(button);
  
  // Animeer de knop in na de gegeven delay
  if (animationDelay > 0) {
    setTimeout(() => {
      button.classList.add('animate-in');
    }, animationDelay);
  }
  
  return button;
}

/**
 * Speciaal voor het startmenu - creëert de hoofdknoppen met animaties
 * @param {HTMLElement} container - Container element
 */
function createStartMenuButtons(container) {
  // Zorg dat de container de juiste CSS class heeft
  container.classList.add('menu-buttons-container');
  
  // Logo animatie eindigt na 3.2s (1.2s delay + 2s animatie)
  const baseDelay = 3400; // Wacht 200ms extra na logo animatie
  
  // Nieuw Spel knop (primair - rood)
  const newGameButton = createPixelButton('Nieuw Spel', function() {
    console.log('🍺 Nieuw spel gestart!');
    const coordinates = '51.203275,4.450912';
    const locationName = 'Boelaerpark';
    const nextPage = 'stop1';
    
    location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`);
  }, 'primary');
  
  // Doorgaan knop (secundair - grijs)
  const continueButton = createPixelButton('Doorgaan', function() {
    console.log('🍺 Spel hervat!');
    // Hier zou je de opgeslagen game state laden
    alert('Doorgaan functie nog niet geïmplementeerd');
  }, 'secondary');
  
  // Instellingen knop (tertiair - lichtblauw)
  const settingsButton = createPixelButton('Instellingen', function() {
    console.log('🍺 Instellingen geopend!');
    alert('Instellingen functie nog niet geïmplementeerd');
  }, 'tertiary');
  
  // Voeg knoppen toe aan container
  container.appendChild(newGameButton);
  container.appendChild(continueButton);
  container.appendChild(settingsButton);
  
  // Animeer knoppen in met staggered timing
  setTimeout(() => {
    newGameButton.classList.add('animate-in');
  }, baseDelay);
  
  setTimeout(() => {
    continueButton.classList.add('animate-in');
  }, baseDelay + 200); // 200ms later
  
  setTimeout(() => {
    settingsButton.classList.add('animate-in');
  }, baseDelay + 400); // 400ms later
  
  return { newGameButton, continueButton, settingsButton };
}

/**
 * Utility functie om te controleren of de pixel button CSS geladen is
 */
function isPixelButtonStyleLoaded() {
  // Controleer of de CSS class beschikbaar is
  const testElement = document.createElement('div');
  testElement.className = 'figma-pixel-button';
  document.body.appendChild(testElement);
  
  const styles = window.getComputedStyle(testElement);
  const isLoaded = styles.position === 'relative';
  
  document.body.removeChild(testElement);
  return isLoaded;
}

/**
 * Wacht tot de pixel button CSS geladen is en voert dan callback uit
 * @param {function} callback - Functie om uit te voeren na laden
 */
function whenPixelButtonReady(callback) {
  if (isPixelButtonStyleLoaded()) {
    callback();
  } else {
    // Probeer het opnieuw na 100ms
    setTimeout(() => whenPixelButtonReady(callback), 100);
  }
}

// Exporteer functies voor gebruik in andere bestanden
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createPixelButton,
    addPixelButton,
    createStartMenuButtons,
    whenPixelButtonReady
  };
} 