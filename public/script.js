window.onload = async () => {
  let dictionary = [];
  let board = [];
  let foundWords = [];

  board = await getBoard(); // load right away
  dictionary = await getDictionary(board);
  foundWords = findStartingLetter(board, dictionary);

  console.log(foundWords);
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
async function getDictionary(board) {
  const wordsText = await readTextFile("/words.txt"); // get text from file

  // Remove all words that are longer than m*n  (longest word possible on mxn grid).
  allWords = wordsText
    .split(",")
    .filter((w) => w.length <= board.length * board[0].length); // hardcode 16?

  // Remove all words that contain letters that are not in the board.
  let boardArr = [];
  for (let i = 0; i < board.length; i++) {
    boardArr = boardArr.concat(board[i]);
  }

  let allLetters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ]; // the alphabet

  // Take the difference between all alphabet letters and all the letters on the board.
  let unusedLetters = [...allLetters].filter((x) => !boardArr.includes(x));

  // Go through the unused letters, removing all words from the dictionary that
  // contain the unused letters. Those words are not possible to make with the
  // given board.
  let possibleWords = [];
  for (let i = 0; i < unusedLetters.length; i++) {
    possibleWords = allWords.filter((w) => !w.includes(unusedLetters[i]));
    allWords = possibleWords;
  }

  return possibleWords;
}

// Given a filename, return the text in that file.
async function readTextFile(fileName) {
  // Use await for promise to settle.
  const response = await fetch(fileName);
  const myBlob = await response.blob();
  const data = await myBlob.text();

  return data; // string
}

function findStartingLetter(board, dictionaryList) {
  let foundWords = [];

  // cycle through all the letters on the board, element by element
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // to ensure we don't go back to a space we've used before, keep a list of
      // the locations in the matrix that are in our current word, where each
      // location is represented by a number: i*board.length + j
      let usedSpaces = [];

      // find all the words that begin with this [i,j]th element
      findWords(board, i, j, "", usedSpaces, dictionaryList, foundWords);
    }
  }

  // console.log(foundWords);
  return foundWords;
}

// Given a 2D board, the index of the current character (i and j), the current
// string (currStr), all positions used in this string, a list of valid words,
// and a list of found words, find all words beginning with the prefix currStr.
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

// Given a list of valid words (dictionary) and a string, check to see if the string
// is the prefix of any valid words.
// Return: true if valid, false otherwise.
function isValidPrefix(dictionary, currStr) {
  let isValidPrefix = false; // default value is false

  // Check each word in the words list.
  for (let word of dictionary) {
    if (word.startsWith(currStr)) {
      isValidPrefix = true; // we've found a word that begins with currStr!
      break;
    }
  }
  return isValidPrefix;
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
