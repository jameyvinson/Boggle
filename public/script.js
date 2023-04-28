let dictionary = [];
let board = [];

window.onload = async () => {
  board = await getBoard(); // load right away
  dictionary = getDictionary();
};

// Read text from given filename and parse the text to create a 2D matrix
// with the given inputs. Render the matrix on web page.
// The given file must contain a text-based 2D matrix, where columns are
// separated by commas and rows are separated by new lines.
// Return: 2D matrix of characters.
async function getBoard() {
  const boardText = await readTextFile("/board.txt");
  let board = [];
  let row = 0,
    column = 0;

  // Populate the board (matrix) with the rows and columns in the file.
  console.log(boardText);
  boardText.split("\n").forEach((line) => {
    if (line === "") return false; // check for last line

    column = 0;
    board[row] = [];

    // Add each letter in the row to the board matrix.
    line.split(",").forEach((letter) => {
      board[row][column] = letter.toLowerCase();
      column++;
    });

    row++;
  });

  // Render the given board on the web UI.
  renderBoard(board);
  return board;
}

// Read the text from "words.txt" and parse the text into an array.
// Return: Array of valid words.
async function getDictionary() {
  const wordsText = await readTextFile("/words.txt");

  wordsList = wordsText
    .split(",")
    .filter((w) => w.length <= board.length * board[0].length); // hardcode 16?
  console.log(wordsList);
  return wordsList;
}

// Given a filename, return the text in that file.
async function readTextFile(fileName) {
  // Use await for promise to settle.
  const response = await fetch(fileName);
  const myBlob = await response.blob();
  const data = await myBlob.text();

  return data; // string
}

// Given a 2D matrix, render the values onto the table in the document.
function renderBoard(board) {
  // creates a <table> element and a <tbody> element
  let tableDiv = document.getElementById("col1");
  let table = document.getElementById("boggleTable");
  let trs = table.getElementsByTagName("tr");
  let tds = null;

  for (let i = 0; i < trs.length; i++) {
    tds = trs[i].getElementsByTagName("td");
    for (let j = 0; j < tds.length; j++) {
      let cellStr = board[i][j].toUpperCase();
      tds[j].innerText = cellStr;
    }
  }
}
