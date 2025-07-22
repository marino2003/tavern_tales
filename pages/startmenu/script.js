// Start Menu Logic met Pixel Art Buttons
console.log('🍺 Start Menu geladen met pixel art knoppen!');

// Wacht tot de pagina en CSS volledig geladen zijn
document.addEventListener('DOMContentLoaded', function() {
  // Zoek een geschikte plek voor de knoppen - of voeg een nieuwe container toe
  let buttonContainer = document.querySelector('.button-container');
  
  if (!buttonContainer) {
    // Creëer een container voor de knoppen als die nog niet bestaat
    buttonContainer = document.createElement('div');
    buttonContainer.className = 'menu-buttons-container';
    buttonContainer.style.cssText = `
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
    `;
    
    // Voeg de container toe aan de scene
    const scene = document.querySelector('.scene');
    if (scene) {
      scene.appendChild(buttonContainer);
    }
  }
  
  // Controleer of pixel button functies beschikbaar zijn
  if (typeof createPixelButton === 'function') {
    // Gebruik de nieuwe pixel art knoppen
    createStartMenuButtons(buttonContainer);
    console.log('✅ Pixel art knoppen succesvol geladen!');
  } else {
    // Fallback naar eenvoudige knoppen
    console.warn('⚠️ Pixel button script niet geladen, gebruik fallback knoppen');
    createFallbackButtons(buttonContainer);
  }
});

// Nieuw Spel functie
function startNewGame() {
  console.log('🍺 Nieuw spel gestart!');
  const coordinates = '51.203275,4.450912';
  const locationName = 'Boelaerpark';
  const nextPage = 'stop1';
  
  location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`);
}

// Doorgaan functie
function continueGame() {
  console.log('🍺 Spel hervatten...');
  
  // Controleer of er een opgeslagen spel is
  const savedGame = localStorage.getItem('koninck-game-save');
  
  if (savedGame) {
    try {
      const gameData = JSON.parse(savedGame);
      console.log('Opgeslagen game data gevonden:', gameData);
      
      // Navigeer naar de opgeslagen locatie
      if (gameData.coordinates && gameData.locationName && gameData.nextPage) {
        location.assign(`../navigate/index.html?coordinates=${gameData.coordinates}&locationName=${gameData.locationName}&nextPage=${gameData.nextPage}`);
      } else {
        // Als er geen geldige save data is, start nieuw spel
        alert('Geen geldig opgeslagen spel gevonden. Nieuw spel wordt gestart.');
        startNewGame();
      }
    } catch (error) {
      console.error('Fout bij laden van opgeslagen spel:', error);
      alert('Fout bij laden van opgeslagen spel. Nieuw spel wordt gestart.');
      startNewGame();
    }
  } else {
    // Geen opgeslagen spel, start nieuw spel
    alert('Geen opgeslagen spel gevonden. Nieuw spel wordt gestart.');
    startNewGame();
  }
}

// Fallback knoppen als pixel art CSS niet geladen is
function createFallbackButtons(container) {
  // Zorg dat de container de juiste styling heeft
  container.classList.add('menu-buttons-container');
  
  const buttonStyle = `
    color: white;
    border: 2px solid black;
    padding: 15px 30px;
    font-size: 24px;
    font-family: monospace;
    cursor: pointer;
    width: 284px;
    height: 76px;
    margin: 0;
    transition: transform 0.15s ease, filter 0.15s ease;
  `;
  
  // Nieuw Spel knop (rood)
  const newGameButton = document.createElement('button');
  newGameButton.textContent = 'Nieuw Spel';
  newGameButton.onclick = startNewGame;
  newGameButton.style.cssText = buttonStyle + 'background: #AB363A;';
  
  // Doorgaan knop (grijs)
  const continueButton = document.createElement('button');
  continueButton.textContent = 'Doorgaan';
  continueButton.onclick = continueGame;
  continueButton.style.cssText = buttonStyle + 'background: #4A4A4A;';
  
  // Instellingen knop (lichtblauw)
  const settingsButton = document.createElement('button');
  settingsButton.textContent = 'Instellingen';
  settingsButton.onclick = () => alert('Instellingen nog niet geïmplementeerd');
  settingsButton.style.cssText = buttonStyle + 'background: #4A90A4;';
  
  // Hover effecten toevoegen
  [newGameButton, continueButton, settingsButton].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.02)';
      btn.style.filter = 'brightness(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
      btn.style.filter = 'brightness(1)';
    });
  });
  
  container.appendChild(newGameButton);
  container.appendChild(continueButton);
  container.appendChild(settingsButton);
}

// Game save functie (voor later gebruik)
function saveGameProgress(coordinates, locationName, nextPage) {
  const gameData = {
    coordinates: coordinates,
    locationName: locationName,
    nextPage: nextPage,
    timestamp: Date.now(),
    // Voeg hier meer game state toe indien nodig
  };
  
  localStorage.setItem('koninck-game-save', JSON.stringify(gameData));
  console.log('🍺 Game progress opgeslagen!', gameData);
} 