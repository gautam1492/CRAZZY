function setRating(rating) {
  const percentage = (rating / 5) * 100;
  document.querySelector('.star-rating-top').style.width = `${percentage}%`;
}

function scrollToSection() {
  document.getElementById("Gamesrc").scrollIntoView({ behavior: "smooth" });
}


function scrollToSection() {
  document.getElementById("Gameinfo").scrollIntoView({ behavior: "smooth" });
}

const ratingEl = document.querySelector('.rating');
setRating(parseFloat(ratingEl.dataset.rating));



const stars = document.querySelectorAll(".rating-star");
const displayRating = document.getElementById("displayRating");
const submitBtn = document.getElementById("submitBtn");
const resultMessage = document.getElementById("resultMessage");

let currentRating = 0;
let isSubmitted = false;

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    if (isSubmitted) return; // disable after submission

    currentRating = index + 1;
    displayRating.textContent = currentRating;

    stars.forEach((s, i) => {
      s.classList.toggle("active", i < currentRating);
    });
  });
});

submitBtn.addEventListener("click", () => {
  if (currentRating > 0) {
    resultMessage.textContent = `Thanks for rating ${currentRating} star(s).`;
    isSubmitted = true;

    // Optional: disable pointer events to prevent further changes
    document.getElementById("ratingBox").style.pointerEvents = "none";
  } else {
    resultMessage.textContent = "Please select a rating before submitting.";
  }
});

const changeBtn = document.getElementById("changeBtn");

submitBtn.addEventListener("click", () => {
  if (currentRating > 0) {
    resultMessage.textContent = `Thanks for rating ${currentRating} star(s).`;
    isSubmitted = true;
    document.getElementById("ratingBox").style.pointerEvents = "none";

    // Show change button
    changeBtn.style.display = "inline-block";
  } else {
    resultMessage.textContent = "Please select a rating before submitting.";
  }
});

changeBtn.addEventListener("click", () => {
  isSubmitted = false;
  document.getElementById("ratingBox").style.pointerEvents = "auto";
  resultMessage.textContent = "You can now change your rating.";
  changeBtn.style.display = "none";
});
