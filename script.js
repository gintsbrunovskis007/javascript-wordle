const tiles = document.querySelectorAll(".tile");

let currentTile = 0;
let currentRow = 0;
let currentWord = "";
let gameOver = false;

const WORD_LENGTH = 5;
const ROWS = 6;

const response = await fetch("./words.json");
const words = await response.json();

const allWords = words.map((word) => word.toUpperCase());
const correctWord = allWords[Math.floor(Math.random() * allWords.length)];
console.log(correctWord);

const correctWordChars = correctWord.split("");

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
      tile.classList.add("spin", "correct-spot");
      tile.style.setProperty("--flip-color", "#6aaa64");
      letterCounts[currentWordChars[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = tiles[rowStart + i];
    if (tile.classList.contains("correct-spot")) continue;

    const letter = currentWordChars[i];
    if (correctWordChars.includes(letter) && letterCounts[letter] > 0) {
      tile.classList.add("spin", "wrong-spot");
      tile.style.setProperty("--flip-color", "#c9b458");
      letterCounts[letter]--;
    } else {
      tile.classList.add("spin", "no-spot");
      tile.style.setProperty("--flip-color", "#787c7e");
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

      if (!allWords.includes(currentWord)) {
        alert("The word does not exist!");

        for (let i = rowStart; i < rowEnd; i++) {
          tiles[i].textContent = "";
          tiles[i].classList.remove("correct-spot", "wrong-spot", "no-spot");
        }

        currentWord = "";
        currentTile = rowStart;
        return;
      }

      checkWordGuess();

      if (currentWord === correctWord) {
        gameOver = true;
        return;
      }

      currentWord = "";
      currentRow++;

      if (currentRow >= ROWS) {
        alert(`Game over! The correct word was ${correctWord}.`);
        gameOver = true;
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

    tiles[currentTile].textContent = key;
    currentWord += key;
    currentTile++;
  });
}

game();
