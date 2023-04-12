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
  5: 2,
  10: 3,
  20: 4,
  35: 5,
};

const changeLevel = (level) => {
  gamePage.style.backgroundImage = `url(src/images/themes/bg-${level}.jpeg)`;
  const monster = rival.querySelector(".game__rival-image");
  monster.setAttribute("src", `src/images/rivals/rival-${level}.png`);
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

  gamePage.style.backgroundImage = `url(src/images/themes/bg-1.jpeg)`;
  const monster = rival.querySelector(".game__rival-image");
  monster.setAttribute("src", `src/images/rivals/rival-1.png`);
};

const showProgress = (nextLevel) => {
  navigate(gamePage, progressPage);

  const previousLevel = nextLevel - 1;

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
