function initTrending() {
  function shuffleArray(array) {
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadGamesIntoBox(boxId, data) {
    const shuffledData = shuffleArray([...data]); // Copy and shuffle

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

      document.getElementById(boxId).appendChild(card);
    });
  }

  // Fetch JSON once, then shuffle separately for each box
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      loadGamesIntoBox('trending-games', data);
      loadGamesIntoBox('trending-games', data);
    })
    .catch(error => console.error('Error loading JSON:', error));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initTrending);
