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
let isStarted = false;

// Turn on or off background music
themeMusic.volume = 0;

musicToggleBtn.addEventListener("click", () => {
  themeMusic.muted = !themeMusic.muted;

  if (themeMusic.muted) {
    musicToggleBtn.querySelector("img").src = "./images/speaker-off.svg";
  } else {
    musicToggleBtn.querySelector("img").src = "./images/speaker-on.svg";
  }
});

document.addEventListener("keydown", changeDirection);

let startGame = setInterval(initGame, 200);
changeFoodPosition();
updateScoreTable();
initGame();

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
}

function changeDirection(e) {
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

// For dev
// function changeDirection(e) {
//   if (e.key === "ArrowUp") {
//     velocityX = 0;
//     velocityY = -1;
//   } else if (e.key === "ArrowDown") {
//     velocityX = 0;
//     velocityY = 1;
//   } else if (e.key === "ArrowLeft") {
//     velocityX = -1;
//     velocityY = 0;
//   } else if (e.key === "ArrowRight") {
//     velocityX = 1;
//     velocityY = 0;
//   } else {
//     return;
//   }

//   initGame();
// }

function checkIfAte() {
  if (snakeX === foodX && snakeY === foodY) {
    currentScore += 1;
    coinSound.play();
    snakeBody.push([foodX, foodY]);
    updateScoreTable();
    changeFoodPosition();
  }
}

function checkIfGameOver() {
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    handleGameOver();

    document.body.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        location.reload();
      }
    });

    return;
  }
}

function initGame() {
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  snakeX += velocityX;
  snakeY += velocityY;
  checkIfAte();
  checkIfGameOver();

  if (gameOver) {
    return;
  }

  // for (let i = 1; i < snakeBody.length; i++) {
  //   if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
  //     // handleGameOver();

  //     console.log(`SnakeX: ${snakeX}, SnakeY: ${snakeY}`);
  //     console.log(snakeBody[0]);
  //     document.body.addEventListener("keydown", (e) => {
  //       if (e.code === "Space") {
  //         location.reload();
  //       }
  //     });
  //   }

  //   return;
  // }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  for (let i = 0; i < snakeBody.length; i++) {
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
  }

  playBoard.innerHTML = htmlMarkup;
  // console.log(snakeX, snakeY);
  // console.log(snakeBody[0]);
}

function handleGameOver() {
  gameOver = true;
  deadSound.play();
  gameOverDisplay.style.display = "flex";
  clearInterval(startGame);

  if (currentScore > highScore) {
    sessionStorage.setItem("highScore", currentScore);
  }
}
