const grid = document.getElementById("grid");
const rows = document.querySelectorAll(".row");
const tiles = document.querySelectorAll(".tile");

let currentTile = 0;
let currentRow = 0;
let currentWord = "";
let gameOver = false;

const correctWord = "CIGAR";
const WORD_LENGTH = 5;

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

      if (currentWord === correctWord) {
        alert("You guessed the correct word!");

        gameOver = true;

        return;
      }

      alert("Incorrect word. Try again!");
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
