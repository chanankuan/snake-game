const themeMusic = document.getElementById("theme-sound");
const coinSound = new Audio("../sounds/coin.mp3");
const deadSound = new Audio("../sounds/dead.wav");
const musicToggleBtn = document.getElementById("music-toggle");
const scoreDisplay = document.querySelector(".score");
const highScoreDisplay = document.querySelector(".high-score");
const playBoard = document.querySelector(".play-board");
const gameOverDisplay = document.querySelector(".game-over-box");
let currentScore = 0,
  highScore = Number(sessionStorage.getItem("highScore")) || 0;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let velocityX = 0,
  velocityY = 0;
let snakeBody = [];
let gameOver = false;

// Turn on or off background music
themeMusic.volume = 0.24;

musicToggleBtn.addEventListener("click", () => {
  themeMusic.muted = !themeMusic.muted;

  if (themeMusic.muted) {
    musicToggleBtn.querySelector("img").src = "./images/speaker-off.svg";
  } else {
    musicToggleBtn.querySelector("img").src = "./images/speaker-on.svg";
  }
});

const playGame = setInterval(initGame, 200);
document.addEventListener("keydown", changeDirection);

updateScoreTable();
changeFoodPosition();

function updateScoreTable() {
  scoreDisplay.innerHTML = `Score: ${currentScore}`;

  if (currentScore > highScore) {
    highScoreDisplay.innerHTML = `High Score: ${currentScore}`;
  } else {
    highScoreDisplay.innerHTML = `High Score: ${highScore}`;
  }
}

function changeFoodPosition() {
  foodX = Math.floor(Math.random() * 30 + 1);
  foodY = Math.floor(Math.random() * 30 + 1);

  initGame();
}

function changeDirection(e) {
  if (gameOver) {
    return;
  }

  if (e.key === "ArrowUp" && velocityY != 1 && velocityY != -1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1 && velocityY != 1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1 && velocityX != -1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1 && velocityX != 1) {
    velocityX = 1;
    velocityY = 0;
  } else {
    return;
  }

  initGame();
}

function initGame() {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    currentScore += 1;
    coinSound.play();
    snakeBody.push([foodX, foodY]);
    updateScoreTable();
    changeFoodPosition();
  }

  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    deadSound.play();
    handleGameOver();

    document.body.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        location.reload();
      }
    });

    return;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
  }

  playBoard.innerHTML = htmlMarkup;
}

function handleGameOver() {
  gameOver = true;
  gameOverDisplay.style.display = "flex";
  clearInterval(playGame);

  if (currentScore > highScore) {
    sessionStorage.setItem("highScore", currentScore);
  }
}

function spaceBarPressed() {
  location.reload();
}
