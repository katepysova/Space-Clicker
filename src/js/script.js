import { checkEmail, checkUserName } from "./form-validation.js";

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const registrationForm = document.querySelector(".registration__form");

const registrationPage = document.querySelector(".registration");
const gamePage = document.querySelector(".game");
const progressPage = document.querySelector(".progress");

const space = document.querySelector(".game__space");
const rival = document.querySelector(".game__rival");

const userNameCaption = document.querySelector(".username-caption");
const userScoreCaption = document.querySelector(".score-caption");
const userPointsCaption = document.querySelector(".points-caption");
const userLevelCaption = document.querySelector(".level-caption");

let TOTAL_SCORE = 0;
let TOTAL_POINTS = 0;
let USER_LEVEL = 1;
const MAX_SCORE = 50;

const levelTreshHolds = {
  0: {
    level: 1,
    animationDuration: "4s",
    offsetPath: `path("M226, 12 l-3,257")`,
  },
  5: {
    level: 2,
    animationDuration: "3s",
    offsetPath: `path("M50, 50 L100, 50 L100, 100 Z")`,
  },
  10: {
    level: 3,
    animationDuration: "1s",
    offsetPath: `path("M50, 50 C75, 80 125, 20 150, 50")`,
  },
  20: {
    level: 4,
    animationDuration: "0.5s",
    offsetPath: `path("M100, 100
    L150,100
    a50,25 0 0,0 150,100
    q50,-50 70,-170
    Z")`,
  },
  35: {
    level: 5,
    animationDuration: "1s",
    offsetPath: `path("M10, 10 l100,0  0,50  -100,0  0,-50")`,
  },
};

const changeLevel = (level) => {
  gamePage.style.backgroundImage = `url(src/images/themes/bg-${level.level}.jpeg)`;
  rival
    .querySelector(".game__rival-image")
    .setAttribute("src", `src/images/rivals/rival-${level.level}.png`);

  rival.style.animationDuration = level.animationDuration;
  rival.style.offsetPath = level.offsetPath;
  USER_LEVEL += 1;
  userLevelCaption.innerHTML = USER_LEVEL;
};

const navigate = (currentPage, nextPage) => {
  currentPage.classList.add("u-hidden");
  nextPage.classList.remove("u-hidden");
};

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isUserNameValid = checkUserName(usernameInput);
  const isEmailValid = checkEmail(emailInput);

  const isFormValid = isUserNameValid && isEmailValid;
  if (isFormValid) {
    userNameCaption.innerText = usernameInput.value || "";
    usernameInput.value = "";
    emailInput.value = "";
    navigate(registrationPage, gamePage);
  }
});

const reset = () => {
  TOTAL_SCORE = 0;
  TOTAL_POINTS = 0;
  USER_LEVEL = 1;

  userPointsCaption.innerText = TOTAL_POINTS;
  userScoreCaption.innerText = TOTAL_SCORE;
  userLevelCaption.innerHTML = USER_LEVEL;

  gamePage.style.backgroundImage = `url(src/images/themes/bg-${USER_LEVEL}.jpeg)`;

  rival
    .querySelector(".game__rival-image")
    .setAttribute("src", `src/images/rivals/rival-${USER_LEVEL}.png`);
  rival.style.animationDuration =
    levelTreshHolds[TOTAL_SCORE].animationDuration;
  rival.style.offsetPath = levelTreshHolds[TOTAL_SCORE].offsetPath;
};

const showProgress = (nextLevel) => {
  navigate(gamePage, progressPage);

  const previousLevel = nextLevel.level - 1;

  progressPage.querySelector(
    ".progress__message"
  ).innerText = `Level ${previousLevel} Successfully Passed!`;
  progressPage.style.backgroundImage = `url(src/images/themes/progress-bg.jpeg)`;
  const progressBtn = progressPage.querySelector(".progress__btn");
  progressBtn.innerText = "Next Level";

  progressBtn.onclick = () => {
    navigate(progressPage, gamePage);
    changeLevel(nextLevel);
  };
};

const showResult = () => {
  navigate(gamePage, progressPage);
  progressPage.querySelector(
    ".progress__message"
  ).innerHTML = `<p>All space monsters have been successfully defeated!!</p>
    <p>Your total score is ${TOTAL_SCORE}!</p>`;
  progressPage.style.backgroundImage = `url(src/images/themes/win-bg.jpeg)`;
  const progressBtn = progressPage.querySelector(".progress__btn");
  progressBtn.innerText = "Play Again";

  progressBtn.onclick = () => {
    reset();
    navigate(progressPage, registrationPage);
  };
};

space.addEventListener("click", () => {
  TOTAL_POINTS += 1;
  userPointsCaption.innerText = TOTAL_POINTS;
});

rival.addEventListener("click", (event) => {
  event.stopPropagation();
  TOTAL_SCORE += 1;
  userScoreCaption.innerText = TOTAL_SCORE;

  const nextLevel = levelTreshHolds[TOTAL_SCORE];
  if (nextLevel) {
    showProgress(nextLevel);
  } else if (TOTAL_SCORE === MAX_SCORE) {
    showResult();
  }
});
