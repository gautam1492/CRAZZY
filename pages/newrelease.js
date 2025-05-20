function initNewreleasePage() {
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      populateNewReleaseBox('new-games', data);
    })
    .catch(error => console.error('Error loading new release games:', error));
}
function shuffleNewReleaseGames(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function populateNewReleaseBox(boxId, data) {
  const shuffledData = shuffleNewReleaseGames([...data]);

  const container = document.getElementById(boxId);
  if (!container) return;

  container.innerHTML = ''; // Clear existing cards if any

  shuffledData.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.addEventListener('click', () => {
      loadGame(game.gameID);
      location.hash = `home/${encodeURIComponent(game.Title)}`;
    });

    card.innerHTML = `
      <img src="${game.Background}" alt="${game.Title}">
      <h4>${game.Title}: ${game.SecondTitle}</h4>
    `;

    container.appendChild(card);
  });
}
