function initHomePage() {
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      setupSlider(data);
      populateGameBoxes(data);
      populateFillerGames(data);
    })
    .catch(error => console.error('Error loading games.json:', error));
}

function setupSlider(data) {
  const choossen = [202, 211, 219, 230];
  const container = document.getElementById("slide-container");

  choossen.forEach(id => {
    const game = data.find(g => g.gameID === id);
    if (game) {
      const slide = document.createElement('div');
      slide.className = "slide";
      slide.style.backgroundImage = `url(${game.Background})`;
      slide.innerHTML = `
        <div class="slide-text">
          <button onclick="loadGame(${game.gameID})">
            <i class="fa-solid fa-play fa-xl" style="color: #fcfcfc;"></i> Play Now!
          </button>
        </div>
      `;
      container.appendChild(slide);
    }
  });

  showSlides(slideIndex);
  startAutoSlide();
}

// --- Slider Logic ---
let slideIndex = 1;
let slideTimer;

function plusSlides(n) {
  showSlides(slideIndex += n);
  restartAutoSlide();
}

function currentSlide(n) {
  showSlides(slideIndex = n);
  restartAutoSlide();
}

function showSlides(n) {
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  for (let slide of slides) slide.style.display = "none";
  for (let dot of dots) dot.className = dot.className.replace(" active", "");

  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
  }
}

function startAutoSlide() {
  slideTimer = setInterval(() => plusSlides(1), 4000);
}

function restartAutoSlide() {
  clearInterval(slideTimer);
  startAutoSlide();
}

window.plusSlides = plusSlides;
window.currentSlide = currentSlide;

// --- Game Boxes ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function populateGameBoxes(data) {
  const boxIds = ['box1', 'box2', 'box3', 'box4', 'box5', 'box6', 'box7', 'box8', 'box9', 'trd-box'];
  boxIds.forEach(boxId => {
    const box = document.getElementById(boxId);
    if (!box) return;

    const shuffledGames = shuffleArray([...data]);
    shuffledGames.forEach(game => {
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
      box.appendChild(card);
    });
  });
}

// --- Filler Games ---
function populateFillerGames(data) {
  const choossen = [206, 212, 216];
  const fillbox = document.getElementById("fillbox");

  choossen.forEach(id => {
    const game = data.find(g => g.gameID === id);
    if (game) {
      const card = document.createElement('div');
      card.className = 'filler-games';
      card.addEventListener('click', () => loadGame(game.gameID));

      card.innerHTML = `
        <img src="${game.Background}" alt="${game.Title}">
        <h2>${game.Title}: ${game.SecondTitle}</h2>
        <p>${game.SmallTitle}</p>
      `;
      fillbox.appendChild(card);
    }
  });
}

function scrollCards(boxId, direction) {
  const box = document.getElementById(boxId);
  const scrollAmount = 300;
  if (box) {
    box.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}

// Make functions available globally
window.initHomePage = initHomePage;
window.loadGame = loadGame;
window.scrollCards = scrollCards;
