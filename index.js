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
  let foundWords = [];

  // cycle through all the letters on the board, element by element
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // to ensure we don't go back to a space we've used before, keep a list of
      // the locations in the matrix that are in our current word, where each
      // location is represented by a number: i*board.length + j
      let usedSpaces = [];

      // find all the words that begin with this [i,j]th element
      findWords(board, i, j, "", usedSpaces, words, foundWords);
    }
  }

  return foundWords;
}

function isValidPrefix(words, currStr) {
  let isValidPrefix = false; // default value is false

  // check each word in the words list to see if currStr is a prefix of any of them
  for (let word of words) {
    if (word.startsWith(currStr)) {
      isValidPrefix = true; // we've found a word that begins with currStr
      break;
    }
  }
  return isValidPrefix;
}

function findWords(
  board,
  i,
  j,
  currStr,
  usedSpacesOriginal,
  validWords,
  foundWords
) {
  // the number associated with the current [i,j]th space
  let currIndexNum = i * board.length + j;

  // check for invalidity (out of bounds indeces, invalid dirty bit)
  if (
    i === board.length ||
    j === board[0].length ||
    j < 0 ||
    i < 0 ||
    usedSpacesOriginal.includes(currIndexNum)
  ) {
    return; // no need to return the found words list, it's passed by reference
  }

  // "slice" the array so that it doesn't pass by reference
  var usedSpaces = usedSpacesOriginal.slice();

  // we've "used" this space; push it to our usedSpaces list
  usedSpaces.push(currIndexNum);
  currStr += board[i][j]; // add current letter to our string

  // check to see if this new string is even a valid prefix
  let isInvalidPrefix = !isValidPrefix(validWords, currStr);
  if (isInvalidPrefix) {
    return; // no need to follow this path!
  }

  // if currStr is a word (and not already added), add it to the foundWords array
  if (validWords.includes(currStr) && !foundWords.includes(currStr)) {
    foundWords.push(currStr);
  }

  // now, recursively go every direction from this [i,j]th position, to test
  // all possible strings
  findWords(board, i + 1, j, currStr, usedSpaces, validWords, foundWords); // down
  findWords(board, i, j + 1, currStr, usedSpaces, validWords, foundWords); // right
  findWords(board, i - 1, j, currStr, usedSpaces, validWords, foundWords); // up
  findWords(board, i, j - 1, currStr, usedSpaces, validWords, foundWords); // left
  findWords(board, i - 1, j - 1, currStr, usedSpaces, validWords, foundWords); // up, left
  findWords(board, i + 1, j + 1, currStr, usedSpaces, validWords, foundWords); // down, right
  findWords(board, i - 1, j + 1, currStr, usedSpaces, validWords, foundWords); // up, right
  findWords(board, i + 1, j - 1, currStr, usedSpaces, validWords, foundWords); // down, left
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

  words = getWords(board.length, board[0].length);

  // console.log(isValidPrefix(words, "abc"));
  foundWords = findStartingLetter(board, words);

  console.log(foundWords.toString());
}

main();
