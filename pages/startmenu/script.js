// Start Menu Logic - buttons will be added later
console.log('Start Menu loaded');

// Future button handlers will go here
function startNewGame() {
  const coordinates = '51.203275,4.450912';
  const locationName = 'Boelaerpark';
  const nextPage = 'stop1';
  
  location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`);
}

function continueGame() {
  // Logic for continuing saved game
  console.log('Continue game clicked');
}

// Event listeners will be added when buttons are implemented 