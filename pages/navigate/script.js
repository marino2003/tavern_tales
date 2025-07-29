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
  
  // Transition overlay initialiseren
  const transitionOverlay = new TransitionOverlay({
    duration: 1500,
    color: '#A0303F',
    direction: 'left-to-right'
  });
  
  // Den Engel locatie coördinaten (Antwerpen)
  const targetLocation = {
    name: 'Den Engel',
    lat: 51.2194, // Den Engel café in Antwerpen
    lon: 4.4025,
    collectedBeers: 2,
    totalBeers: 4,
    hasArrived: false
  };
  
  // UI updaten met locatie data
  function updateNavigationUI() {
    locationNameElement.textContent = targetLocation.name;
    beerCountElement.textContent = `${targetLocation.collectedBeers}/${targetLocation.totalBeers}`;
    
    // Kleine bier teller updaten
    if (beerCountSmallElement) {
      beerCountSmallElement.textContent = `${targetLocation.collectedBeers}/${targetLocation.totalBeers}`;
    }
  }
  
  // Afstand berekenen en updaten
  function updateDistanceToTarget(userLat, userLon) {
    if (userLat && userLon) {
      const result = getDistance(userLat, userLon, targetLocation.lat, targetLocation.lon);
      const distanceInMeters = result.distance;
      
      // Format afstand voor weergave
      let displayDistance;
      if (distanceInMeters >= 1000) {
        displayDistance = `${(distanceInMeters / 1000).toFixed(1)}km`;
      } else {
        displayDistance = `${distanceInMeters}m`;
      }
      
      distanceElement.textContent = displayDistance;
    
    // Check of gebruiker is aangekomen (binnen 50 meter)
      if (distanceInMeters <= 50 && !targetLocation.hasArrived) {
        targetLocation.hasArrived = true;
      triggerArrivalTransition();
      }
    }
  }
  
  // Locatie tracking starten
  function startLocationTracking() {
    if (navigator.geolocation) {
      // Eerste positie ophalen
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const { latitude, longitude } = position.coords;
          updateDistanceToTarget(latitude, longitude);
        },
        function(error) {
          console.error('Locatie error:', error);
          // Toon fallback afstand
          distanceElement.textContent = 'Locatie niet beschikbaar';
        }
      );
      
      // Continue tracking (elke 10 seconden)
      const watchId = navigator.geolocation.watchPosition(
        function(position) {
          const { latitude, longitude } = position.coords;
          updateDistanceToTarget(latitude, longitude);
        },
        function(error) {
          console.error('Locatie tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000
        }
      );
      
      // Cleanup functie
      window.stopLocationTracking = function() {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }
  
  // Trigger overgang wanneer gebruiker aankomt
  function triggerArrivalTransition() {
    console.log('Gebruiker is aangekomen bij Den Engel! Start overgang...');
    
    // Stop locatie tracking
    if (window.stopLocationTracking) {
      window.stopLocationTracking();
    }
    
    // Start transition out
    transitionOverlay.transitionOut(() => {
      // Navigeer naar de minigame intro pagina
      window.location.href = '../minigame-intro/index.html';
    }).then(() => {
      console.log('Transition out voltooid');
    });
  }
  
  // Locatie permissies aanvragen
  function requestLocationPermissions() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // Succes - modal sluiten
          requestPermissionsModal.classList.remove('active');
          gameContainer.classList.remove('modal-active');
          
          // Start locatie tracking
          startLocationTracking();
          
          console.log('Locatie toegang verleend');
        },
        function(error) {
          console.error('Locatie error:', error);
          // Toon error message aan gebruiker
          distanceElement.textContent = 'Locatie toegang geweigerd';
        }
      );
    } else {
      console.error('Geolocation niet ondersteund');
      distanceElement.textContent = 'Geolocation niet ondersteund';
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
  } else {
    // Niet in iframe - start direct locatie tracking
    startLocationTracking();
  }
  
  // UI initialiseren
  updateNavigationUI();
  
  // Expose functies voor andere scripts
  window.updateDistanceToTarget = updateDistanceToTarget;
  window.targetLocation = targetLocation;
  
});

