const grid = document.getElementById("grid");
const rows = document.querySelectorAll(".row");
const tiles = document.querySelectorAll(".tile");

let currentTile = 0;
let currentRow = 0;
let currentWord = "";
let gameOver = false;

const WORD_LENGTH = 5;
const ROWS = 6;

async function getRandomWord() {
  const response = await fetch("./words.json");
  const words = await response.json();

  return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

async function getAllWords() {
  const response = await fetch("./words.json");
  const words = await response.json();
  return words.map((word) => word.toUpperCase());
}

const allWords = await getAllWords();
const correctWord = await getRandomWord();
console.log(correctWord);

const correctWordChars = correctWord.split("");
const currentWordChars = currentWord.split("");

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

const correctWordLetterCounts = correctWordChars.reduce((counts, letter) => {
  counts[letter] = (counts[letter] || 0) + 1;
  return counts;
}, {});

function checkWordGuess() {
  const rowStart = currentRow * WORD_LENGTH;
  const currentWordChars = currentWord.split("");
  const letterCounts = { ...correctWordLetterCounts };

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[rowStart + i];

    if (currentWordChars[i] === correctWordChars[i]) {
      tile.classList.add("correct-spot");
      letterCounts[currentWordChars[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[rowStart + i];
    if (tile.classList.contains("correct-spot")) continue;

    const letter = currentWordChars[i];
    if (correctWordChars.includes(letter) && letterCounts[letter] > 0) {
      tile.classList.add("wrong-spot");
      letterCounts[letter]--;
    }
  }
}

function game() {
  window.addEventListener("keydown", (e) => {
    if (gameOver) {
      return;
    }

    const key = e.key.toUpperCase();

    const rowStart = currentRow * WORD_LENGTH;
    const rowEnd = rowStart + WORD_LENGTH;

    if (key === "BACKSPACE") {
      if (currentTile > rowStart) {
        currentTile--;
        currentWord = currentWord.slice(0, -1);
        tiles[currentTile].textContent = "";
      }
      return;
    }

    if (key === "ENTER") {
      if (currentTile !== rowEnd) {
        return;
      }

      checkWordGuess();

      if (currentWord === correctWord) {
        alert("You guessed the correct word!");

        gameOver = true;

        return;
      }

      if (!allWords.includes(currentWord)) {
        alert("The word does not exist!");

        for (let i = rowStart; i < rowEnd; i++) {
          tiles[i].textContent = "";
          tiles[i].classList.remove("correct-spot", "wrong-spot");
        }

        currentWord = "";
        currentTile = rowStart;

        return;
      }

      if (currentRow + 1 !== ROWS) {
        alert("Incorrect word. Try again!");
      }

      currentWord = "";
      currentRow++;

      if (currentRow >= rows.length) {
        alert(`Game over! The correct word was ${correctWord}.`);

        gameOver = true;

        return;
      }

      currentTile = currentRow * 5;

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

    tiles[currentTile].textContent = key;
    currentWord += key;
    currentTile++;
  });
}

game();
