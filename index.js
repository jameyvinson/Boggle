const fs = require("fs");
let words = require("an-array-of-english-words");

// read board from given filename (default board.txt) and return the board in a
// 2D matrix
function getBoard() {
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
      board[row][column] = letter.toLowerCase();
      column++;
    });

    row++; // increment row
  });

  return board;
}

function getWords(m, n) {
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

function findStartingLetter(board, words) {
  // cycle through all the letters on the board, finding all possible
  // words that begin with those letters
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // create and populate a "dirty bit" matrix, which will inidicate which
      // elements have already been added to a word
      let dirtyBitMat = [];
      for (k = 0; k < board.length; k++) {
        dirtyBitMat[k] = [];
        for (l = 0; l < board[0].length; l++) {
          dirtyBitMat[k][l] = 0; // all initial values are 0, untouched
        }
      }

      findWords(board, i, j, "", dirtyBitMat, words);
      // console.log(dirtyBitMat);
    }
  }
}

function findWords(board, i, j, currStr, dirtyBitMat, words) {
  // check for invalidity (out of bounds indeces, invalid dirty bit)
  // TODO: add in invalid prefix
  if (
    i === board.length ||
    j === board[0].length ||
    j < 0 ||
    i < 0 ||
    dirtyBitMat[i][j] === 1
  ) {
    // return only the words that we have found so far
    return;
  }

  // if we've reached this point, continue onward!

  // "slice" the array so that it doesn't pass by reference
  var dirtyBitMatCpy = dirtyBitMat.map((arr) => arr.slice());

  dirtyBitMatCpy[i][j] = 1; // show we've been to this index before
  currStr += board[i][j];

  // TODO: if currStr is a word, add it to the foundWords
  if (words.includes(currStr)) {
    console.log(`found ${currStr}`);
  }

  // console.log(currStr);

  findWords(board, i + 1, j, currStr, dirtyBitMatCpy, words); // down
  findWords(board, i, j + 1, currStr, dirtyBitMatCpy, words); // right
  findWords(board, i - 1, j, currStr, dirtyBitMatCpy, words); // up
  findWords(board, i, j - 1, currStr, dirtyBitMatCpy, words); // left
  findWords(board, i - 1, j - 1, currStr, dirtyBitMatCpy, words); // up, left
  findWords(board, i + 1, j + 1, currStr, dirtyBitMatCpy, words); // down, right
  findWords(board, i - 1, j + 1, currStr, dirtyBitMatCpy, words); // up, right
  findWords(board, i + 1, j - 1, currStr, dirtyBitMatCpy, words); // down, left
}

// function findWords1(board, i, j, currStr, dirtyBitMat) {
//   // the "word" we are working on
//   console.log(currStr);

//   // if currStr is in the words list, then add it to the words list (?)
//   if (i < board.length - 1 && dirtyBitMat[i + 1][j] === 0) {
//     // update this new element to the word
//     currStr += board[i + 1][j];

//     // update the db matrix, to show we've "been" at this element (1 == "touched")
//     dirtyBitMat[i + 1][j] = 1;

//     console.log(
//       `i = ${
//         i + 1
//       }, j = ${j}, currstr = ${currStr}, dirtyBitMat = ${dirtyBitMat}`
//     );
//     console.log(`board.length: ${board.length}`);
//     // call the findWords method again, with updated values
//     findWords(board, i + 1, j, currStr, dirtyBitMat);
//   }

//   if (j < board[0].length - 1 && dirtyBitMat[i][j + 1] === 0) {
//     currStr += board[i][j + 1];
//     dirtyBitMat[i][j + 1] = 1;
//     findWords(board, i, j + 1, currStr, dirtyBitMat);
//   }

//   if (i > 0 && dirtyBitMat[i - 1][j] === 0) {
//     currStr += board[i - 1][j];
//     dirtyBitMat[i - 1][j] = 1;
//     findWords(board, i - 1, j, currStr, dirtyBitMat);
//   }

//   if (j > 0 && dirtyBitMat[i][j - 1] === 0) {
//     currStr += board[i][j - 1];
//     dirtyBitMat[i][j - 1] = 1;
//     findWords(board, i, j - 1, currStr, dirtyBitMat);
//   }

//   if (i > 0 && j > 0 && dirtyBitMat[i - 1][j - 1] === 0) {
//     currStr += board[i - 1][j - 1];
//     dirtyBitMat[i - 1][j - 1] = 1;
//     findWords(board, i - 1, j - 1, currStr, dirtyBitMat);
//   }

//   if (
//     i < board.length - 1 &&
//     j < board[0].length - 1 &&
//     dirtyBitMat[i + 1][j + 1] === 0
//   ) {
//     currStr += board[i + 1][j + 1];
//     dirtyBitMat[i + 1][j + 1] = 1;
//     findWords(board, i + 1, j + 1, currStr, dirtyBitMat);
//   }
// }

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

  words = getWords(board.length, board[0].length);

  findStartingLetter(board, words);
}

main();
