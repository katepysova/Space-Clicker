/* eslint-disable no-console */
import { checkEmail, checkUserName } from "./formValidation.js";

const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const registrationForm = document.querySelector(".registration__form");

const registrationPage = document.querySelector(".registration");
const gamePage = document.querySelector(".game");
const progressPage = document.querySelector(".progress");

const space = document.querySelector(".space");
const rival = document.querySelector(".rival");

const userNameCaption = document.querySelector(".username-caption");
const userScoreCaption = document.querySelector(".score-caption");
const userPointsCaption = document.querySelector(".points-caption");
const userLevelCaption = document.querySelector(".level-caption");

let totalScore = 0;
let totalPoints = 0;
let userLevel = 1;
const MAX_SCORE = 50;

const levelTreshHolds = {
  5: 2,
  10: 3,
  20: 4,
  35: 5,
};

const levelChange = (level) => {
  gamePage.style.backgroundImage = `url(./images/bg-${level}.jpeg)`;
  const monster = rival.querySelector(".rival__image");
  monster.setAttribute("src", `./images/rival-${level}.png`);
  userLevel += 1;
  userLevelCaption.innerHTML = userLevel;
};

const showProgress = (level) => {
  gamePage.classList.add("u-hidden");
  progressPage.classList.remove("u-hidden");
  console.log(level);
};

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const isUserNameValid = checkUserName(usernameInput);
  const isEmailValid = checkEmail(emailInput);

  const isFormValid = isUserNameValid && isEmailValid;
  if (isFormValid) {
    userNameCaption.innerText = usernameInput.value || "";
    registrationPage.classList.add("u-hidden");
    gamePage.classList.remove("u-hidden");
  }
});

space.addEventListener("click", () => {
  totalPoints += 1;
  userPointsCaption.innerText = totalPoints;
});

rival.addEventListener("click", (event) => {
  event.stopPropagation();
  totalScore += 1;
  userScoreCaption.innerText = totalScore;

  if (levelTreshHolds[totalScore]) {
    showProgress(levelTreshHolds[totalScore]);
    levelChange(levelTreshHolds[totalScore]);

    // eslint-disable-next-line no-empty
  } else if (totalScore === MAX_SCORE) {
    console.log("winner");
  }
});
