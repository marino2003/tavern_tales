// Vereenvoudigde Navigatie pagina script
document.addEventListener('DOMContentLoaded', function() {
  
  // Elementen ophalen
  const locationNameElement = document.getElementById('location-name');
  const distanceElement = document.getElementById('distance');
  const beerCountElement = document.getElementById('beer-count');
  const beerCountSmallElement = document.getElementById('beer-count-small');
  const requestPermissionsModal = document.getElementById('request-permissions');
  const requestPermissionsButton = document.getElementById('request-permissions-button');
  const gameContainer = document.querySelector('.game-container');
  
  // Test data - in echte implementatie komt dit uit de game state
  const currentLocation = {
    name: 'Café Beveren',
    distance: 500,
    collectedBeers: 2,
    totalBeers: 4
  };
  
  // UI updaten met locatie data
  function updateNavigationUI() {
    locationNameElement.textContent = currentLocation.name;
    distanceElement.textContent = `${currentLocation.distance}m`;
    beerCountElement.textContent = `${currentLocation.collectedBeers}/${currentLocation.totalBeers}`;
    
    // Kleine bier teller updaten
    if (beerCountSmallElement) {
      beerCountSmallElement.textContent = `${currentLocation.collectedBeers}/${currentLocation.totalBeers}`;
    }
  }
  
  // Afstand updaten (wordt aangeroepen door get-distance.js)
  function updateDistance(newDistance) {
    currentLocation.distance = Math.round(newDistance);
    distanceElement.textContent = `${currentLocation.distance}m`;
  }
  
  // Locatie permissies aanvragen
  function requestLocationPermissions() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // Succes - modal sluiten
          requestPermissionsModal.classList.remove('active');
          gameContainer.classList.remove('modal-active');
          
          // Hier zou je de afstand kunnen berekenen en updaten
          console.log('Locatie toegang verleend');
        },
        function(error) {
          console.error('Locatie error:', error);
          // Toon error message aan gebruiker
        }
      );
    } else {
      console.error('Geolocation niet ondersteund');
    }
  }
  
  // Event listeners
  if (requestPermissionsButton) {
    requestPermissionsButton.addEventListener('click', requestLocationPermissions);
  }
  
  // Check of we in een iframe zitten
  if (window.isInIframe && window.isInIframe()) {
    // In iframe - toon permissie modal
    requestPermissionsModal.classList.add('active');
    gameContainer.classList.add('modal-active');
  }
  
  // UI initialiseren
  updateNavigationUI();
  
  // Expose functies voor andere scripts
  window.updateDistance = updateDistance;
  window.currentLocation = currentLocation;
  
});
