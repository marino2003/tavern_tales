// neem html elementen vast
const locationNameElement = document.querySelector('#location-name');
const distanceElement = document.querySelector('#distance');

// definieer radius waarbinnen doelen gevonden mogen worden
const successRadiusInMeter = 20;

// haal alle query parameters op
const coordinatesParam = getQueryParam('coordinates').split(',');
const coordinates = {
  latitude: parseFloat(coordinatesParam[0]),
  longitude: parseFloat(coordinatesParam[1]),
}

const locationName = getQueryParam('locationName');
locationNameElement.textContent = locationName;

const nextPage = getQueryParam('nextPage');

// sla gegevens op in localStorage om later de draad terug op te kunnen pikken
localStorage.setItem('coordinates', coordinatesParam);
localStorage.setItem('locationName', locationName);
localStorage.setItem('nextPage', nextPage);

// permissions for compass and location
const requestPermissionsElement = document.querySelector('#request-permissions')
const gameContainer = document.querySelector('.game-container')

// Detect mobile browsers
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

function onShowRequestPermissions() {
  requestPermissionsElement.classList.add('active');
  gameContainer.classList.add('modal-active');
}

function onHideRequestPermissions() {
  requestPermissionsElement.classList.remove('active');
  gameContainer.classList.remove('modal-active');
}

// deze functie wordt opgeroepen elke keer een nieuwe locatie doorkomt
function success(position) {
  console.log('GPS positie ontvangen:', position.coords);
  console.log('Doel coördinaten:', coordinates);
  console.log('Accuracy:', position.coords.accuracy, 'meter');
  
  // point to location via compass - dit roteert je wijzer!
  pointToLocation(
    position.coords.latitude, 
    position.coords.longitude, 
    coordinates.latitude, 
    coordinates.longitude, 
    '#point-to-location', // je wijzer element
    '#request-permissions-button', 
    onShowRequestPermissions, 
    onHideRequestPermissions
  );

  // bereken afstand tussen mijn locatie en die van mijn doel
  const distance = getDistance(position.coords.latitude, position.coords.longitude, coordinates.latitude, coordinates.longitude).distance;
  console.log('Afstand tot doel:', distance, 'meter');
  // laat die afstand zien
  distanceElement.textContent = Math.round(distance);

  // de afstand tussen mijn locatie en die van mijn doel is minder dan 20 meter, rekeninghoudend met de accuraatheid van gps?
  if (distance < successRadiusInMeter + Math.min(position.coords.accuracy/2, successRadiusInMeter)) {
    // navigeer naar de pagina die getoond moet worden als ik in 20 meter van locatie ben
    location.assign(`../${nextPage}/index.html`)
  }
}

// wanneer geen gps beschikbaar is
function error(err) {
  console.warn('GPS Error (' + err.code + '): ' + err.message);
  
  let errorMessage = '';
  switch(err.code) {
    case 1:
      errorMessage = 'Locatie toegang geweigerd. Sta toe dat de browser je locatie kan gebruiken.';
      break;
    case 2:
      errorMessage = 'Locatie niet beschikbaar. Controleer je GPS instellingen.';
      break;
    case 3:
      errorMessage = 'Timeout bij het ophalen van locatie. Probeer het opnieuw.';
      break;
    default:
      errorMessage = 'Er is een fout opgetreden bij het ophalen van je locatie.';
  }
  
  console.log('Error message:', errorMessage);
  
  // Toon permissie request als locatie niet beschikbaar is
  onShowRequestPermissions();
}

// iOS specifieke compass permissie functie
async function requestCompassPermission() {
  if (isIOS && typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      console.log('Compass permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.warn('Compass permission error:', error);
      return false;
    }
  }
  return true; // Niet iOS, geen speciale permissie nodig
}

// check if page lives in the test iframe
if (isInIframe()) {

  // get map gps positions
  function handleMessage (evt) {
  	success({coords: {latitude: evt.data.lat, longitude: evt.data.lng, accuracy: 35}});
  }
  // listen to messages from test-iframe
  window.addEventListener("message", handleMessage, false);
  parent.postMessage({message: "navigate-init"}, "*");
  parent.postMessage({message: "navigate-localstorage", coordinates: coordinatesParam, locationName, nextPage}, "*");

} else {

  // Toon permissie request bij het laden van de pagina
  onShowRequestPermissions();

  // Event listener voor de permissie button
  document.querySelector('#request-permissions-button').addEventListener('click', async function() {
    console.log('Permissie button geklikt - start GPS tracking');
    console.log('Mobile:', isMobile, 'iOS:', isIOS, 'Safari:', isSafari);
    
    // Vraag compass permissie voor iOS
    if (isIOS) {
      const compassGranted = await requestCompassPermission();
      if (!compassGranted) {
        console.log('Compass permissie geweigerd, maar GPS wordt nog steeds geprobeerd');
      }
    }
    
    onHideRequestPermissions();
    
    // options for geolocation - geoptimaliseerd voor mobile
    const options = {
      enableHighAccuracy: true,
      timeout: 30000, // Langere timeout voor mobile
      maximumAge: 10000 // Cache locatie voor 10 seconden
    };

    // Check of geolocation beschikbaar is
    if (!navigator.geolocation) {
      console.error('Geolocation niet ondersteund door deze browser');
      error({code: 2, message: 'Geolocation niet ondersteund'});
      return;
    }

    // access real gps data
    try {
      navigator.geolocation.watchPosition(success, error, options);
    } catch (e) {
      console.error('Error starting GPS tracking:', e);
      error({code: 2, message: 'GPS tracking kon niet gestart worden'});
    }
  });
}
