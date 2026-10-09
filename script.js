const rows = document.querySelectorAll(".row");
const tiles = document.querySelectorAll(".tile");
const keys = document.querySelectorAll(".key");

const newGameButton = document.getElementById("newGameButton");

let currentTile = 0;
let currentRow = 0;
let currentWord = "";
let gameOver = false;
let checkingWord = false;

const WORD_LENGTH = 5;
const ROWS = 6;

const response = await fetch("./words.json");
const words = await response.json();

const allWords = words.map((word) => word.toUpperCase());

function saveGameOverStatus() {
  localStorage.setItem("gameOverStatus", JSON.stringify(gameOver));
}

function getGameOverStatus() {
  return JSON.parse(localStorage.getItem("gameOverStatus")) || false;
}

function generateRandomWord() {
  return allWords[Math.floor(Math.random() * allWords.length)];
}

let guessedWords = getGuessedWords();

let correctWord = getCorrectWord();

function saveCorrectWord() {
  localStorage.setItem("correctWord", JSON.stringify(correctWord));
}

function getCorrectWord() {
  return JSON.parse(localStorage.getItem("correctWord"));
}

function removeCorrectWord() {
  localStorage.removeItem("correctWord");
}

if (!correctWord) {
  correctWord = generateRandomWord();
  saveCorrectWord();
}

function saveGuessedWords(word) {
  guessedWords.push(word);
  localStorage.setItem("guessedWords", JSON.stringify(guessedWords));
}

function getGuessedWords() {
  return JSON.parse(localStorage.getItem("guessedWords")) || [];
}

function removeGuessedWords() {
  localStorage.removeItem("guessedWords");
}

let correctWordChars = correctWord.split("");

function getLetterCounts(chars) {
  return chars.reduce((counts, letter) => {
    counts[letter] = (counts[letter] || 0) + 1;
    return counts;
  }, {});
}

let correctWordLetterCounts = getLetterCounts(correctWordChars);

newGameButton.addEventListener("click", () => {
  guessedWords = [];

  correctWord = generateRandomWord();
  correctWordChars = correctWord.split("");
  correctWordLetterCounts = getLetterCounts(correctWordChars);

  currentWord = "";
  currentRow = 0;
  currentTile = 0;

  gameOver = false;
  checkingWord = false;

  removeCorrectWord();
  saveCorrectWord();
  removeGuessedWords();
  saveGameOverStatus();

  tiles.forEach((tile) => {
    tile.textContent = "";
    tile.classList.remove(
      "correct-spot-check",
      "wrong-spot-check",
      "wrong-spot",
      "correct-spot",
      "highlight",
      "no-spot",
      "pop",
      "spin",
    );
    tile.style.removeProperty("--flip-color");
  });

  keys.forEach((key) => {
    key.classList.remove(
      "correct-spot-check",
      "wrong-spot-check",
      "no-spot-check",
    );
  });

  newGameButton.blur();
});

async function loadGuessedWords() {
  const words = getGuessedWords();
  if (!words) {
    return;
  }
  const joinedWords = words.join("");
  const joinedWordsChars = joinedWords.split("");

  let letterCount = 0;

  for (let k = 0; k < ROWS; k++) {
    for (let i = letterCount; i < WORD_LENGTH + letterCount; i++) {
      if (letterCount >= joinedWords.length) {
        break;
      }
      tiles[i].textContent = joinedWords[i];
      letterCount++;
    }

    if (k * WORD_LENGTH >= joinedWords.length) break;

    currentRow = k;

    await checkWordGuess(
      joinedWordsChars.slice(k * WORD_LENGTH, (k + 1) * WORD_LENGTH),
      WORD_LENGTH,
      k,
    );
  }

  currentWord = "";

  if (letterCount >= ROWS * WORD_LENGTH) {
    currentRow = ROWS - 1;
    currentTile = ROWS * WORD_LENGTH;
    gameOver = true;
    saveGameOverStatus();
  } else {
    currentRow = Math.floor(letterCount / WORD_LENGTH);
    currentTile = letterCount;
  }
}

if (guessedWords.length > 0) {
  await loadGuessedWords();
}

if (guessedWords.includes(correctWord) || guessedWords.length >= ROWS) {
  gameOver = true;
}

saveGameOverStatus();

const validLetters = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];

const container = document.createElement("div");
container.className = "popup-container";
document.body.appendChild(container);

function popup(message) {
  const el = document.createElement("div");
  el.className = "popup";
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => el.remove(), 1500);
}

function endScreen(message) {
  const container = document.createElement("div");
  const title = document.createElement("h1");
  const closeButton = document.createElement("button");
  closeButton.addEventListener("click", () => {
    document.body.removeChild(container);
  });
  closeButton.className = "close-button";
  container.className = "end-screen-container";
  title.textContent = message;
  closeButton.textContent = "X";
  container.appendChild(title);
  container.appendChild(closeButton);
  document.body.appendChild(container);
}

function updateKeyColor(letter, status) {
  const key = [...keys].find((k) => k.dataset.key === letter);
  if (!key) return;

  const isGreen = key.classList.contains("correct-spot-check");
  const isYellow = key.classList.contains("wrong-spot-check");

  if (status === "green") {
    key.classList.remove("wrong-spot-check", "no-spot-check");
    key.classList.add("correct-spot-check");
  } else if (status === "yellow" && !isGreen) {
    key.classList.remove("no-spot-check");
    key.classList.add("wrong-spot-check");
  } else if (status === "gray" && !isGreen && !isYellow) {
    key.classList.add("no-spot-check");
  }
}

function checkWordGuess(chars, wordLength, rowIndex = currentRow) {
  return new Promise((resolve) => {
    const rowStart = rowIndex * WORD_LENGTH;
    const rowResults = [];
    const letterCounts = { ...correctWordLetterCounts };

    for (let i = 0; i < wordLength; i++) {
      const tile = tiles[rowStart + i];
      const letter = chars[i];

      let colorType = "";
      if (letter === correctWordChars[i]) {
        colorType = "green";
        letterCounts[letter]--;
      } else if (
        correctWordChars.includes(letter) &&
        letterCounts[letter] > 0
      ) {
        colorType = "yellow";
        letterCounts[letter]--;
      } else {
        colorType = "gray";
      }

      rowResults.push({ letter, colorType });

      tile.classList.add("spin");
      tile.classList.remove("highlight");
      tile.style.setProperty("--animation-order", i);

      if (colorType === "green") {
        tile.classList.add("correct-spot");
        tile.style.setProperty("--flip-color", "#538D4E");
      } else if (colorType === "yellow") {
        tile.classList.add("wrong-spot");
        tile.style.setProperty("--flip-color", "#B59F3B");
      } else {
        tile.classList.add("no-spot");
        tile.style.setProperty("--flip-color", "#3A3A3C");
      }

      if (i === WORD_LENGTH - 1) {
        tile.addEventListener(
          "animationend",
          () => {
            rowResults.forEach(({ letter, colorType }) => {
              updateKeyColor(letter, colorType);
            });

            resolve();
          },
          { once: true },
        );
      }
    }
  });
}

async function logic(key) {
  if (gameOver || checkingWord) {
    return;
  }

  saveCorrectWord();

  const rowStart = currentRow * WORD_LENGTH;
  const rowEnd = rowStart + WORD_LENGTH;

  if (key === "BACKSPACE") {
    if (currentTile > rowStart) {
      currentTile--;
      currentWord = currentWord.slice(0, -1);
      tiles[currentTile].textContent = "";
      tiles[currentTile].classList.remove("highlight");
      tiles[currentTile].classList.remove("pop");
    }

    return;
  }

  if (key === "ENTER") {
    if (currentTile !== rowEnd) {
      popup("Not enough letters");

      rows[currentRow].addEventListener(
        "animationend",
        () => {
          rows[currentRow].classList.remove("no-word");
        },
        { once: true },
      );

      rows[currentRow].classList.add("no-word");

      return;
    }

    if (!allWords.includes(currentWord)) {
      popup("Not in word list");

      rows[currentRow].addEventListener("animationend", () => {
        rows[currentRow].classList.remove("no-word");
      });

      rows[currentRow].classList.add("no-word");

      return;
    }

    checkingWord = true;
    const currentWordChars = currentWord.split("");
    await checkWordGuess(currentWordChars, WORD_LENGTH);
    saveGuessedWords(currentWord);
    checkingWord = false;

    if (currentWord === correctWord) {
      gameOver = true;
      saveGameOverStatus();
      if (currentRow === 0) {
        popup("Genius");
      } else if (currentRow === 1) {
        popup("Magnificent");
      } else if (currentRow === 2) {
        popup("Impressive");
      } else if (currentRow === 3) {
        popup("Splendid");
      } else if (currentRow === 4) {
        popup("Great");
      } else if (currentRow === 5) {
        popup("Phew");
      }
      setTimeout(() => {
        endScreen("Great job! You got it!");
      }, 2000);

      return;
    }

    currentWord = "";
    currentRow++;

    if (currentRow >= ROWS) {
      gameOver = true;
      saveGameOverStatus();
      popup(correctWord);
      setTimeout(() => {
        endScreen(`Better luck next time! The word was ${correctWord}`);
      }, 2000);
      return;
    }

    currentTile = currentRow * WORD_LENGTH;

    return;
  }

  if (currentTile >= rowEnd) {
    return;
  }

  if (!validLetters.includes(key)) {
    return;
  }

  if (currentTile >= tiles.length) {
    return;
  }

  tiles[currentTile].classList.add("highlight");
  tiles[currentTile].classList.add("pop");
  tiles[currentTile].textContent = key;

  currentWord += key;
  currentTile++;
}

function game() {
  keys.forEach((key) => {
    key.addEventListener("click", (e) => {
      const keyValue = key.getAttribute("data-key");
      logic(keyValue);
    });
  });

  window.addEventListener("keydown", (e) => {
    logic(e.key.toUpperCase());
  });
}

game();
