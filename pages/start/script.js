// Simple splash screen - click to continue to start menu
function goToStartMenu() {
  location.assign('../startmenu/index.html');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const splashScreen = document.querySelector('.splash-screen');
  
  // Click anywhere to continue
  splashScreen.addEventListener('click', goToStartMenu);
  splashScreen.addEventListener('touchstart', goToStartMenu);
  
  // Keyboard support 
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      goToStartMenu();
    }
  });
});
