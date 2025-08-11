// Player Data Management
// Functies voor het beheren van spelergegevens door de game

/**
 * Haalt de speler naam op uit localStorage
 * @returns {string} De speler naam of een fallback
 */
function getPlayerName() {
  const playerName = localStorage.getItem('playerName');
  return playerName || 'vriend'; // Fallback als er geen naam is
}

/**
 * Sla speler naam op in localStorage
 * @param {string} name - De naam om op te slaan
 */
function setPlayerName(name) {
  if (name && name.trim()) {
    localStorage.setItem('playerName', name.trim().toUpperCase());
  }
}

/**
 * Vervangt placeholder tekst in dialogen met de speler naam
 * @param {string} text - Tekst met {PLAYER} placeholders
 * @returns {string} Tekst met vervangen naam
 */
function personalizeDialogue(text) {
  const playerName = getPlayerName();
  return text.replace(/\{PLAYER\}/g, playerName);
}

/**
 * Update alle elementen met data-dialogue attribuut met gepersonaliseerde tekst
 */
function updateDialogueElements() {
  const dialogueElements = document.querySelectorAll('[data-dialogue]');
  
  dialogueElements.forEach(element => {
    const originalText = element.getAttribute('data-dialogue');
    element.textContent = personalizeDialogue(originalText);
  });
}

/**
 * Helper om direct tekst te personaliseren en in een element te zetten
 * @param {string} selector - CSS selector voor het element
 * @param {string} text - Tekst met {PLAYER} placeholder
 */
function setPersonalizedText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = personalizeDialogue(text);
  }
}

/**
 * Haalt speler data op uit localStorage
 * @returns {Object} Speler data object
 */
function getPlayerData() {
  const data = localStorage.getItem('playerData');
  if (data) {
    return JSON.parse(data);
  }
  
  // Default speler data
  return {
    beersFound: 0,
    currentLocation: null,
    visitedLocations: []
  };
}

/**
 * Sla speler data op in localStorage
 * @param {Object} playerData - Speler data object
 */
function savePlayerData(playerData) {
  localStorage.setItem('playerData', JSON.stringify(playerData));
}

// Export functies voor gebruik in andere scripts
window.PlayerData = {
  getName: getPlayerName,
  setName: setPlayerName,
  personalize: personalizeDialogue,
  updateElements: updateDialogueElements,
  setText: setPersonalizedText,
  getData: getPlayerData,
  saveData: savePlayerData
}; 