const fs = require("fs");
let words = require("an-array-of-english-words");

// read board from given filename (default board.txt) and return the board in a
// 2D matrix
function getBoard() {
  console.log("getBoard");
  let fileName = process.argv[2]; // get file name from CLAs

  let board = []; // will contain elements from file
  let row = 0,
    column = 0;

  let allFileContents = "";
  try {
    allFileContents = fs.readFileSync(fileName, "utf-8");
  } catch (err) {
    console.log(
      `Error reading from file "${fileName}". Try a different file name?`
    );
    return null;
  }

  // populate the board with the rows and columns in the file
  // rows are separated by new line characters
  allFileContents.split("\n").forEach((line) => {
    // check for last line
    if (line === "") return false;

    column = 0; // always start at column 0
    board[row] = []; // is row is a array

    // add each letter in the row to the board
    line.split(",").forEach((letter) => {
      board[row][column] = letter;
      column++;
    });

    row++; // increment row
  });

  return board;
}

function getWords(m, n) {
  console.log("getWords");
  let fileName = process.argv[3]; // word-list was provided as a command line argument

  try {
    // take out all words that are longer than m*n  (longest word possible on mxn grid)
    let wordsList = fs
      .readFileSync(fileName, "utf-8")
      .split(",")
      .filter((w) => w.length <= m * n);

    return wordsList;
  } catch (err) {
    console.log(
      `Error reading from file "${fileName}". Try a different file name?`
    );
    return null;
  }
}

// check that the number of arguments is correct
function checkArgs() {
  if (process.argv.length !== 4) {
    console.log("Incorrect number of arguments.");
    console.log("node .\\index.js boggleBoardFile wordsListFile");
    return 0;
  }
  return 1;
}

function main() {
  // check that the correct arguments are provided
  if (!checkArgs()) {
    return;
  }

  board = getBoard();

  if (board == null) {
    return; // stop execution; error reading from file
  }

  console.log(board);

  console.log(getWords(board.length, board[0].length));
}

main();
