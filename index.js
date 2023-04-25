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
      // create and populate a "dirty bit" matrix, which will inidicate which
      // elements have already been added to a word
      // 1 = added, 0 = not added yet
      let dirtyBitMat = Array(board.length)
        .fill()
        .map(() => Array(board[0].length).fill(0));

      // find all the words that begin with this [i,j]th element
      findWords(board, i, j, "", dirtyBitMat, words, foundWords);
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

function findWords(board, i, j, currStr, dirtyBitMat, validWords, foundWords) {
  // check for invalidity (out of bounds indeces, invalid dirty bit)
  if (
    i === board.length ||
    j === board[0].length ||
    j < 0 ||
    i < 0 ||
    dirtyBitMat[i][j] === 1
  ) {
    return; // no need to return the found words list, it's passed by reference
  }

  // "slice" the array so that it doesn't pass by reference
  var dirtyBitMatCpy = dirtyBitMat.map((arr) => arr.slice());

  dirtyBitMatCpy[i][j] = 1; // show we've been to this index before
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
  findWords(board, i + 1, j, currStr, dirtyBitMatCpy, validWords, foundWords); // down
  findWords(board, i, j + 1, currStr, dirtyBitMatCpy, validWords, foundWords); // right
  findWords(board, i - 1, j, currStr, dirtyBitMatCpy, validWords, foundWords); // up
  findWords(board, i, j - 1, currStr, dirtyBitMatCpy, validWords, foundWords); // left
  findWords(
    board,
    i - 1,
    j - 1,
    currStr,
    dirtyBitMatCpy,
    validWords,
    foundWords
  ); // up, left
  findWords(
    board,
    i + 1,
    j + 1,
    currStr,
    dirtyBitMatCpy,
    validWords,
    foundWords
  ); // down, right
  findWords(
    board,
    i - 1,
    j + 1,
    currStr,
    dirtyBitMatCpy,
    validWords,
    foundWords
  ); // up, right
  findWords(
    board,
    i + 1,
    j - 1,
    currStr,
    dirtyBitMatCpy,
    validWords,
    foundWords
  ); // down, left
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

  // console.log(isValidPrefix(words, "abc"));
  foundWords = findStartingLetter(board, words);

  console.log(foundWords.toString());
}

main();
