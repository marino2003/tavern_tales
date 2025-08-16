function getPlayerName() {
  const playerName = localStorage.getItem('playerName');
  return playerName || 'vriend';
}

function setPlayerName(name) {
  if (name && name.trim()) {
    localStorage.setItem('playerName', name.trim().toUpperCase());
  }
}

function personalizeDialogue(text) {
  const playerName = getPlayerName();
  return text.replace(/\{PLAYER\}/g, playerName);
}


function updateDialogueElements() {
  const dialogueElements = document.querySelectorAll('[data-dialogue]');
  
  dialogueElements.forEach(element => {
    const originalText = element.getAttribute('data-dialogue');
    element.textContent = personalizeDialogue(originalText);
  });
}


function setPersonalizedText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = personalizeDialogue(text);
  }
}


function getPlayerData() {
  const data = localStorage.getItem('playerData');
  if (data) {
    return JSON.parse(data);
  }
  

  return {
    beersFound: 0,
    currentLocation: null,
    visitedLocations: []
  };
}


function savePlayerData(playerData) {
  localStorage.setItem('playerData', JSON.stringify(playerData));
}


window.PlayerData = {
  getName: getPlayerName,
  setName: setPlayerName,
  personalize: personalizeDialogue,
  updateElements: updateDialogueElements,
  setText: setPersonalizedText,
  getData: getPlayerData,
  saveData: savePlayerData
}; 