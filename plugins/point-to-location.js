/*

Gebruik:

Maak een image aan met een pijl die naar boven wijst.
Op computer zal kompas altijd het noorden aanwijzen, dus rekeninghoudend met een normale kaart-oriëntatie.
Op telefoon zal deze rekening houden met het kompas van de telefoon zelf.

Je zal ook een bericht moeten verzien dat je kan tonen/verbergen om permissies op te vragen. Dit gaat enkel nodig zijn voor iOS,
dus dat bericht moet by default verborgen zijn. (vandaag dat het voorbeeld al meteen onHideRequestPermissions() oproept ook)

Eerste argument: lat van gps
Tweede argument: lon van gps
Derde argument: lat van gewenste locatie
Vierde argument: lon van gewenste locatie
Vijfde argument: selector voor de image van de pijl
Zesde argument: selector voor de button om permissie te geven
Zevende argument: de onShow functie voor de permissies
Achtste argument: de onHide functie voor de permissies


//
// .html
//

// head:

<script defer src="../../scripts/get-distance.js"></script>
<script defer src="../../plugins/point-to-location.js"></script>

// body:

<img src="path/to/arrow.svg" alt="volg mij" id="point-to-location"/>
<div id="request-permissions">
  Mogen we je kompas gebruiken om je naar de juiste locatie te gidsen?
  <button id="request-permissions-button">Geef goedkeuring</button>
</div>

//
// .js
//

const requestPermissionsElement = document.querySelector('#request-permissions')
function onShowRequestPermissions() {
  requestPermissionsElement.style.display = 'block';
}

function onHideRequestPermissions() {
  requestPermissionsElement.style.display = 'none';
}
onHideRequestPermissions();

function success(postion) {
  pointToLocation(position.coords.latitude, position.coords.longitude, coordinates.latitude, coordinates.longitude, '#point-to-location', '#request-permissions-button', onShowRequestPermissions, onHideRequestPermissions);
}

...

navigator.geolocation.watchPosition(success, error, options);

*/

/* Source: https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi */

const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
const isAndroid = /Android/.test(navigator.userAgent);
const isMobile = isIOS || isAndroid;

let compassStarted = false;
let compassStartedViaClick = false;
let compass = null;
let direction = null;
let pointerElement = null;
let requestPermissionsButtonElement = null;
let showRequestPermissions = null;
let hideRequestPermissions = null;

function startCompass() {
  if (!compassStarted) {
    compassStarted = true;
    console.log('Starting compass... Mobile:', isMobile, 'iOS:', isIOS, 'Android:', isAndroid);
    
    if (!isMobile) {
      // Desktop - gebruik deviceorientationabsolute
      window.addEventListener("deviceorientationabsolute", handler, true);
      console.log('Desktop compass started');
    } else if (isIOS) {
      // iOS - specifieke behandeling
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === "granted") {
              window.addEventListener("deviceorientation", handler, true);
              console.log('iOS compass started with permission');
            } else {
              console.log('iOS compass permission denied, using fallback');
              alert("Zonder kompas wordt het lastig. Richtingaanwijzing via het noorden.");
            }
          })
          .catch((error) => {
            console.warn('iOS compass permission error:', error);
            if (compassStartedViaClick) {
              alert("Kompas niet beschikbaar. Richtingaanwijzing via het noorden.")
            } else {
              showRequestPermissions();
              requestPermissionsButtonElement.onclick = () => {
                compassStartedViaClick = true;
                compassStarted = false;
                hideRequestPermissions();
                startCompass();
              }
            }
          });
      } else {
        // Fallback voor oudere iOS versies
        window.addEventListener("deviceorientation", handler, true);
        console.log('iOS compass started (fallback)');
      }
    } else if (isAndroid) {
      // Android - probeer verschillende event types
      try {
        window.addEventListener("deviceorientationabsolute", handler, true);
        console.log('Android compass started (absolute)');
      } catch (e) {
        try {
          window.addEventListener("deviceorientation", handler, true);
          console.log('Android compass started (relative)');
        } catch (e2) {
          console.warn('Android compass not available:', e2);
          alert("Kompas niet beschikbaar. Richtingaanwijzing via het noorden.")
        }
      }
    }
  }
}

function handler(e) {
  // Verbeterde compass heading berekening
  let heading = null;
  
  if (e.webkitCompassHeading !== undefined) {
    // iOS Safari
    heading = e.webkitCompassHeading;
  } else if (e.alpha !== undefined) {
    // Android en andere browsers
    heading = Math.abs(e.alpha - 360);
  }
  
  if (heading !== null) {
    compass = -heading; // Negatief voor correcte rotatie
    console.log('Compass heading:', heading, 'degrees');
    onChange();
  }
}

function onChange() {
  if (pointerElement !== null) {
    if (direction === null) {
      pointerElement.style.visibility = 'hidden';
      console.log('Wijzer verborgen - geen richting beschikbaar');
    } else {
      pointerElement.style.visibility = 'visible';
      if (compass === null) {
        const rotation = direction;
        pointerElement.style.transform = `rotate(${rotation}deg)`;
        console.log('Wijzer roteert naar richting:', rotation, 'graden (zonder kompas)');
      } else {
        const rotation = compass + direction;
        pointerElement.style.transform = `rotate(${rotation}deg)`;
        console.log('Wijzer roteert naar richting:', rotation, 'graden (kompas:', compass, '+ richting:', direction, ')');
      }
    }
  } else {
    console.log('Wijzer element niet gevonden');
  }
}

function pointToLocation(lat1, lon1, lat2, lon2, pointerSelector, requestPermissionsButtonSelector, onShowRequestPermissions, onHideRequestPermissions) {
  console.log('pointToLocation aangeroepen met:');
  console.log('Huidige locatie:', lat1, lon1);
  console.log('Doel locatie:', lat2, lon2);
  console.log('Wijzer selector:', pointerSelector);
  console.log('Mobile:', isMobile, 'iOS:', isIOS, 'Android:', isAndroid);
  
  showRequestPermissions = onShowRequestPermissions;
  hideRequestPermissions = onHideRequestPermissions;

  requestPermissionsButtonElement = document.querySelector(requestPermissionsButtonSelector);
  pointerElement = document.querySelector(pointerSelector);
  
  console.log('Wijzer element gevonden:', pointerElement);

  direction = getDistance(lat1, lon1, lat2, lon2).directionInDegrees;
  console.log('Berekende richting:', direction, 'graden');

  startCompass();
  onChange();
}
