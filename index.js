// ---------- MODAL HANDLING ----------
function openModal() {
  document.getElementById("loginModal").style.display = "flex";
  document.body.classList.add("modal-open");
  showLogin(); // Default to login tab
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.body.classList.remove("modal-open");
}

function showRegister() {
  document.getElementById("loginCard").style.display = "none";
  document.getElementById("registerCard").style.display = "flex";
}

function showLogin() {
  document.getElementById("registerCard").style.display = "none";
  document.getElementById("loginCard").style.display = "flex";
}

// Close modal when clicking outside content
window.onclick = function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    closeModal();
  }
};

// ---------- PAGE NAVIGATION ----------
const loadedScripts = new Set();

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function navigate(page) {
  window.location.hash = page;

  fetch(`pages/${page}.html`)
    .then(response => {
      if (!response.ok) throw new Error("Page not found");
      return response.text();
    })
    .then(html => {
      document.getElementById("index-container").innerHTML = html;

      const scriptPath = `pages/${page}.js`;

      if (!loadedScripts.has(scriptPath)) {
        const script = document.createElement("script");
        script.src = scriptPath;
        script.defer = true;
        script.onload = () => {
          const initFunc = window[`init${capitalize(page)}Page`] || window[`init${capitalize(page)}`];
          if (typeof initFunc === "function") {
            initFunc();
          }
        };
        document.body.appendChild(script);
        loadedScripts.add(scriptPath);
      } else {
        const initFunc = window[`init${capitalize(page)}Page`] || window[`init${capitalize(page)}`];
        if (typeof initFunc === "function") {
          initFunc();
        }
      }
    })
    .catch(err => {
      document.getElementById("index-container").innerHTML = "<h1>404</h1><p>Page not found.</p>";
      console.error(err);
    });
}

// On initial load
window.addEventListener("DOMContentLoaded", () => {
  const page = window.location.hash ? window.location.hash.slice(1) : "home";
  navigate(page);
});

// ---------- HEADER SCROLL HIDE/SHOW ----------
let lastScrollTop = 0;
const header = document.getElementById("nav");

window.addEventListener("scroll", function () {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  header.style.top = currentScroll > lastScrollTop ? "-68px" : "0";
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// ---------- SCROLL TO SECTION ----------
function scrollToSection() {
  const target = document.getElementById("Gamesrc");
  if (target) target.scrollIntoView({ behavior: "smooth" });
}

function scrollToSection2(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    observeSection(section); // Optional, define this if needed
  }
}

// ---------- STAR RATING FUNCTIONALITY ----------
let currentRating = 0;
let isSubmitted = false;

function setRating(rating) {
  currentRating = rating;
  const displayRating = document.getElementById("displayRating");
  if (displayRating) displayRating.textContent = rating;

  const stars = document.querySelectorAll(".rating-star");
  stars.forEach((s, i) => {
    s.classList.toggle("active", i < rating);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".rating-star");
  const submitBtn = document.getElementById("submitBtn");
  const changeBtn = document.getElementById("changeBtn");
  const resultMessage = document.getElementById("resultMessage");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      if (isSubmitted) return;
      setRating(index + 1);
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      if (currentRating > 0) {
        resultMessage.textContent = `Thanks for rating star(s).`;
        isSubmitted = true;
        document.getElementById("ratingBox").style.pointerEvents = "none";
        changeBtn.style.display = "inline-block";
      } else {
        resultMessage.textContent = "Please select a rating before submitting.";
      }
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      isSubmitted = false;
      currentRating = 0;
      setRating(0);
      resultMessage.textContent = "You can now change your rating.";
      changeBtn.style.display = "none";
      document.getElementById("ratingBox").style.pointerEvents = "auto";
    });
  }

  const ratingEl = document.querySelector('.rating');
  if (ratingEl) setRating(parseFloat(ratingEl.dataset.rating));
});

async function loadGame(gameId) {
  const response = await fetch('games.json');
  const games = await response.json();
  const game = games.find(g => g.gameID == gameId);

  if (!game) {
    document.getElementById("index-container").innerHTML = "<p>Game not found.</p>";
    return;
  }

  document.getElementById("index-container").innerHTML = `
    <div class="gametemp-wrapper" id="Gameinfo">
      <div class="game-info">
        <div style="display:flex; gap:20px;">
          <img src="${game.Background}" alt="${game.Title}">
          <div class="game-details">
            <h1>${game.Title}</h1>
            <h2>${game.SecondTitle}</h2>
            <div class="rating" data-rating="${game.Rating}">
              <p style="margin-top:8px;">Rating (${game.Rating}★):</p>
              <div class="star-rating">
                <div class="star-rating-top" style="width: 72%;">★★★★★</div>
                <div class="star-rating-bottom">★★★★★</div>
              </div>
            </div>
            <button class="play-btn" onclick="scrollToSection()">Play Now!</button>
          </div>
        </div>

        <div class="game-box">
          <h2>Description:</h2>
          <p style="text-align:justify; font-size:large; margin-top:26px;">
            ${game.Description}
          </p>
        </div>

        <div class="game-box">
          <h2>Genre:</h2>
          <p style="text-transform:capitalize; font-size:x-large; margin-top:26px;">
            ${game.Genre}
          </p>
        </div>

        <div class="game-box">
          <div class="game-rating">
            <h2>Rating:</h2>
            <div class="rating-box" id="ratingBox">
              ${[1,2,3,4,5].map(n => `<span class="rating-star" data-star="${n}"></span>`).join('')}
            </div>
            <span class="selected-rating">(<span id="displayRating">0</span>)</span>
            <button id="submitBtn">Submit Rating</button>
            <button id="changeBtn" style="display: none;">Change Rating</button>
            <span id="resultMessage" style="margin-left: 10px;"></span>
          </div>
        </div>

        <div class="game-box" style="gap: 30px; padding-top:100px;" id="Gamesrc">
          <div style="width: 70%;">
            <h1>${game.Title} ${game.SecondTitle}</h1>
            <iframe src="${game.EmbedLink}" frameborder="1" height="400px" width="100%" allowfullscreen style="border-radius:8px;"></iframe>
          </div>
          <div style="width: 30%; padding:10px;">
            <h2 style="margin-top: 40px;">How to Play</h2>
            <p>${game.HTP}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  scrollToSection2("Gameinfo");
}

// Handle sign-up
document.querySelector('#registerCard form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = this.fullname.value.trim();
    const Mnumber = this.Mnumber.value.trim();
    const email = this.email.value.trim();
    const username = this.username.value.trim();
    const password = this.password.value.trim();

    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists');
        return;
    }

    // Add new user
    users.push({ fullname, Mnumber, email, username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');

    showLogin();
});

// Handle login
document.querySelector('#loginCard form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = this.username.value.trim();
    const password = this.password.value.trim();

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        alert('Invalid username or password');
    } else {
        alert(`Welcome, ${user.fullname}!`);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        updateLoginButton();
        document.querySelector('#loginCard form').reset();
        document.querySelector('#registerCard form').reset();
        closeModal();
        // You can now redirect to another page or load game section
    }
});


function updateLoginButton() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginBtn = document.getElementById('login');

    if (user) {
        loginBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket fa-lg" style="color: #9ac84c;"></i> Logout`;
        loginBtn.onclick = function () {
            if (confirm("Do you want to log out?")) {
                localStorage.removeItem('loggedInUser');
                updateLoginButton();
                alert("Logged out successfully!");
            }
        };
    } else {
        loginBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket fa-lg" style="color: #9ac84c;"></i> login/sign-up`;
        loginBtn.onclick = openModal;
    }
}

// ---------- EXPORT FOR OTHER FILES ----------
window.navigate = navigate;
window.scrollToSection = scrollToSection;
window.scrollToSection2 = scrollToSection2;
window.addEventListener('DOMContentLoaded', () => {
    updateLoginButton();
});

