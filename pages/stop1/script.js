document.addEventListener('DOMContentLoaded', function() {
  // Personaliseer dialoog met speler naam
  if (window.PlayerData) {
    window.PlayerData.updateElements();
    
    const playerName = window.PlayerData.getName();
  }

  // Initialiseer hero sprite controller voor demo
  if (window.HeroSprite) {
    window.heroController = new HeroSprite.Controller(
      document.querySelector('.hero-sprite')
    );
  }

  const continueButton = document.querySelector('#continue-button');

  continueButton.onclick = () => {
    const coordinates = '51.197837,4.463655'
    const locationName = 'Boekenbergpark';
    const nextPage = 'stop2';
    location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`)
  }
});

// Hero control functies voor de demo buttons
let heroIsPlaying = true;

function toggleHero() {
  if (window.heroController) {
    window.heroController.toggle();
    heroIsPlaying = !heroIsPlaying;
    
    const btn = document.getElementById('heroToggleBtn');
    btn.textContent = heroIsPlaying ? '⏸️ Pauzeer Hero' : '▶️ Start Hero';
  }
}

function heroFast() {
  if (window.heroController) {
    window.heroController.fast();
    console.log('Hero animatie: snel (0.6s)');
  }
}

function heroNormal() {
  if (window.heroController) {
    window.heroController.normalSpeed();
    console.log('Hero animatie: normaal (0.8s)');
  }
}
