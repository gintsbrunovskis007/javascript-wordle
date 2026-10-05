const grid = document.getElementById("grid");
const rows = document.querySelectorAll(".row");
const tiles = document.querySelectorAll(".tile");

let currentTile = 0;

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
    const key = e.key.toUpperCase();

    if (key === "BACKSPACE") {
      if (currentTile > 0) {
        currentTile--;
        console.log("Deleted letter: ", tiles[currentTile].textContent);
        tiles[currentTile].textContent = "";
      }
      console.log("No letters to delete!");
      return;
    }

    if (!validLetters.includes(key)) {
      console.log("Invalid letter!");
      return;
    }

    if (currentTile >= tiles.length) {
      console.log("Letter limit reached!");
      return;
    }

    console.log(key);
    tiles[currentTile].textContent = key;
    currentTile++;
  });
}

game();
