function getNextPage() {

  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    localStorage.clear();
  }


  const nextPage = localStorage.getItem('nextPage');
  const coordinates = localStorage.getItem('coordinates');
  const locationName = localStorage.getItem('locationName');


  if (nextPage) {

    return `./pages/navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`;
  }


  return './pages/start/index.html';
};