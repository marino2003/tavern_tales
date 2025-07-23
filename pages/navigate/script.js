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
  distanceElement.textContent = distance;

  // de afstand tussen mijn locatie en die van mijn doel is minder dan 20 meter, rekeninghoudend met de accuraatheid van gps?
  if (distance < successRadiusInMeter + Math.min(position.coords.accuracy/2, successRadiusInMeter)) {
    // navigeer naar de pagina die getoond moet worden als ik in 20 meter van locatie ben
    location.assign(`../${nextPage}/index.html`)
  }
}

// wanneer geen gps beschikbaar is
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
  // Toon permissie request als locatie niet beschikbaar is
  onShowRequestPermissions();
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
  document.querySelector('#request-permissions-button').addEventListener('click', function() {
    console.log('Permissie button geklikt - start GPS tracking');
    onHideRequestPermissions();
    
    // options for geolocation
    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    // access real gps data
    navigator.geolocation.watchPosition(success, error, options);
  });
}
