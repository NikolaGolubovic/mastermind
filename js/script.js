const signs = document.querySelectorAll(".sign");
const valGuess = document.querySelectorAll(".score");
let valGuessLine = 0;
const restart = document.querySelector(".restart");
const container = document.querySelector(".container");
const signsArr = [...signs];
const lines = document.querySelector(".lines");
let guess = [];
let checkGuess = [];
const boxImgs = document.querySelectorAll(".box img");
let finalImages = [];
let destinationArr = [];
let gameInProgress = true;
const winInfo = document.querySelector(".win");
const loseInfo = document.querySelector(".lose");
const infoCorrectCombination = document.querySelector(".correct-combination");

function createFinArr() {
  let signs = ["herc", "karo", "skocko", "zvezda", "pik", "tref"];
  let randomNums = [];
  let randomSigns = [];
  while (randomNums.length < 4) {
    randomNums.push(Math.floor(Math.random() * 6));
  }
  for (let i = 0; i < randomNums.length; i++) {
    randomSigns.push(signs[randomNums[i]]);
  }
  return randomSigns;
}

function compareArrs(guess, final) {
  let comparedObj = { on: 0, out: 0 };
  let tempFinal = [];
  let tempGuess = [];

  final.forEach((item) => tempFinal.push(item));
  guess.forEach((item) => tempGuess.push(item));

  for (var i = 0; i <= final.length; i++) {
    if (tempGuess[i] && tempGuess[i] == tempFinal[i]) {
      comparedObj["on"] += 1;
      tempFinal.splice(i, 1);
      tempGuess.splice(i, 1);
      i = -1;
    }
  }

  let guessRest = {};
  for (let item of tempGuess) {
    guessRest[item] ? (guessRest[item] += 1) : (guessRest[item] = 1);
  }

  for (let elem of tempFinal) {
    if (guessRest[elem]) {
      comparedObj["out"] += 1;
      guessRest[elem] -= 1;
    }
  }

  let finArr = [];

  for (let key in comparedObj) {
    if (comparedObj[key] && key == "on") {
      for (var i = 0; i < comparedObj[key]; i++) {
        finArr.push("img/on.png");
      }
    } else if (key == "out" && comparedObj[key]) {
      for (var i = 0; i < comparedObj[key]; i++) {
        finArr.push("img/out.png");
      }
    }
  }
  finArr.forEach((img) => {
    let image = document.createElement("img");
    image.src = img;
    valGuess[valGuessLine].append(image);
  });
  if (comparedObj["on"] == 4) {
    winInfo.classList.add("active");
    gameInProgress = false;
    restart.style.visibility = "hidden";
  }
  valGuessLine += 1;
}

function makeGame(e) {
  if (gameInProgress && finalImages.length < 24) {
    if (destinationArr.length == 0) {
      destinationArr = createFinArr();
    }
    if (e.key == "Backspace") {
      guess.pop();
      checkGuess.pop();
    }
    signsArr.forEach((sign) => {
      if (e.key == sign.dataset.key.slice(0, 1)) {
        sign.style.transform = "scale(1.2)";
        guess.push(`img/${sign.dataset.key}.png`);
        checkGuess.push(sign.dataset.key);
      }
    });

    if (guess.length % 4 == 0 && guess.length > 0) {
      finalImages = finalImages.concat(guess);
      compareArrs(checkGuess, destinationArr);
      guess = [];
      checkGuess = [];
    }

    for (var i = 0; i < finalImages.length; i++) {
      boxImgs[i].src = finalImages[i];
    }

    if (finalImages.length >= 4 && gameInProgress) {
      restart.style.visibility = "visible";
    }

    if (finalImages.length >= 24 && gameInProgress) {
      for (let i = 0; i < destinationArr.length; i++) {
        let image = document.createElement("img");
        image.src = `img/${destinationArr[i]}.png`;
        infoCorrectCombination.append(image);
        restart.style.visibility = "hidden";
      }
      loseInfo.classList.add("active");
    } else if (finalImages.length < 24) {
      for (let i = finalImages.length; i < finalImages.length + 4; i++) {
        boxImgs[i].src = "";
      }
      for (var i = 0; i < guess.length; i++) {
        boxImgs[i + finalImages.length].src = guess[i];
      }
    }
  }
}

window.addEventListener("keydown", makeGame);

signs.forEach((sign) =>
  sign.addEventListener("transitionend", function () {
    sign.style.transform = "scale(1)";
  })
);

signs.forEach((sign) =>
  sign.addEventListener("click", function (e) {
    console.log(this.dataset.key);
    console.log(e.key);
  })
);
