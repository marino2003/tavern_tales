let isTransitioning = false;

function goToStartMenu() {
  if (isTransitioning) return;
  isTransitioning = true;
  
  const splashScreen = document.querySelector('.splash-screen');
  
  // Trigger fade-out animation
  splashScreen.classList.add('fade-out');
  
  // Wait for animation to complete before navigating
  setTimeout(() => {
    location.assign('../startmenu/index.html');
  }, 800);
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
