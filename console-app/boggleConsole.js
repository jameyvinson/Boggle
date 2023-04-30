/* boggleConsole.js
 *
 * Given a text file containing an mxn matrix of letters, as well as a text file
 * containing a list of valid words, computes for all the words in the matrix,
 * per the rules of Boggle. Prints board and found words to the console.
 *
 * to run: node .\boggleConsole.js boardTextFile wordsTextFile
 *
 * Jamey Vinson
 * April 28, 2023
 *
 */
const fs = require("fs");

// Read text from given filename and parse the text to create a 2D matrix
// with the given inputs.
// The given file must contain a text-based 2D matrix, where columns are
// separated by commas and rows are separated by new lines.
// Return: 2D matrix of characters.
function getBoard() {
  let fileName = process.argv[2]; // get filename from CLAs

  let board = [];
  let row = 0,
    column = 0;

  // Read file contents into string, if file name is available.
  let allFileContents = "";
  try {
    allFileContents = fs.readFileSync(fileName, "utf-8");
  } catch (err) {
    console.log(
      `Error reading from file "${fileName}". Try a different file name?`
    );
    return null;
  }

  console.log("\nBoggle Board:");

  // Populate the board with the rows and columns in the file.
  allFileContents.split("\n").forEach((line) => {
    if (line === "") return false; // check for last line

    column = 0;
    board[row] = []; // row is an array

    // Add each letter in the row to the board matrix.
    line.split(",").forEach((letter) => {
      // Remove a line break, if present.
      if (letter.endsWith("\r")) {
        letter = letter.replace("\r", "");
      }
      board[row][column] = letter.toLowerCase();
      column++;
    });

    console.log(board[row]);
    row++;
  });

  return board;
}

// Read text from given filename and parse the text to create an array
// of the words in the file.
// The given file should contain a list of strings, separated by commas.
// Return: Array of strings.
function getDictionary(m, n) {
  let fileName = process.argv[3]; // get filename from CLAs
  let wordsList = [];

  try {
    // Remove all words that are longer than m*n  (longest word possible on mxn grid).
    wordsList = fs
      .readFileSync(fileName, "utf-8")
      .split(",")
      .filter((w) => w.length <= m * n);
  } catch (err) {
    console.log(
      `Error reading from file "${fileName}". Try a different file name?`
    );
    return null;
  }

  // Remove all words that contain letters that are not in the board.
  let boardLetters = [];
  for (let i = 0; i < board.length; i++) {
    boardLetters = boardLetters.concat(board[i]);
  }

  let allAlphabetLetters = [
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
  ];

  // Take the difference between all alphabet letters and all the letters on the board.
  let unusedLetters = [...allAlphabetLetters].filter(
    (x) => !boardLetters.includes(x)
  );

  // Go through the unused letters, removing all words from the dictionary that
  // contain the unused letters. Those words are not possible to make with the
  // given board.
  let possibleWords = [];
  for (let i = 0; i < unusedLetters.length; i++) {
    possibleWords = wordsList.filter((w) => !w.includes(unusedLetters[i]));
    wordsList = possibleWords;
  }

  return possibleWords;
}

// Given a 2D matrix of characters and a list of valid words, get all the words
// in the matrix, per the rules of Boggle.
// Return: Array of found words.
function getAllWords(board, words) {
  let foundWords = [];

  // Cycle through all the letters on the board, element by element, to find the
  // starting letters for all possible strings. Pass starting letter to getWords
  // to recursively solve for all words beginning with that letter.
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // Keep list of the locations in the matrix that are in our current word,
      // so positions aren't repeating in a word. Each location is represented
      // by a number: i*board.length + j.
      let usedSpaces = [];

      // Find all the words that begin with this [i,j]th element.
      getWords(board, i, j, "", usedSpaces, words, foundWords);
    }
  }
  console.log("\nAll words from board:");
  console.log(foundWords);
  return foundWords;
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

// Given a 2D board, the index of the current character (i and j), the current
// string (currStr), all positions used in this string, a list of valid words,
// and a list of found words, find all words beginning with the prefix currStr.
function getWords(
  board,
  i,
  j,
  currStr,
  usedSpacesOriginal,
  validWords,
  foundWords
) {
  // Number associated with the current [i,j]th space.
  let currIndexNum = i * board.length + j;

  // Check for any invalidity (out of bounds indeces or space already used in word).
  if (
    i === board.length ||
    j === board[0].length ||
    j < 0 ||
    i < 0 ||
    usedSpacesOriginal.includes(currIndexNum)
  ) {
    return; // no need to return the found words list, it's passed by reference
  }

  // "Slice" (copy) the array so that it doesn't pass by reference.
  var usedSpaces = usedSpacesOriginal.slice();

  // This space has been used; push it to our usedSpaces list.
  usedSpaces.push(currIndexNum);
  currStr += board[i][j]; // add current letter to our string

  // Check to see if this new string is even a valid prefix.
  let isInvalidPrefix = !isValidPrefix(validWords, currStr);
  if (isInvalidPrefix) {
    return; // no need to follow this path!
  }

  // If the current string is a word (and not already added), add it to the
  // array of found words.
  if (validWords.includes(currStr) && !foundWords.includes(currStr) && currStr.length >= 3) {
    foundWords.push(currStr);
  }

  // Now, recursively go every direction from this [i,j]th position, to test
  // all possible strings.
  getWords(board, i + 1, j, currStr, usedSpaces, validWords, foundWords); // down
  getWords(board, i, j + 1, currStr, usedSpaces, validWords, foundWords); // right
  getWords(board, i - 1, j, currStr, usedSpaces, validWords, foundWords); // up
  getWords(board, i, j - 1, currStr, usedSpaces, validWords, foundWords); // left
  getWords(board, i - 1, j - 1, currStr, usedSpaces, validWords, foundWords); // up, left
  getWords(board, i + 1, j + 1, currStr, usedSpaces, validWords, foundWords); // down, right
  getWords(board, i - 1, j + 1, currStr, usedSpaces, validWords, foundWords); // up, right
  getWords(board, i + 1, j - 1, currStr, usedSpaces, validWords, foundWords); // down, left
}

// Check that the number of command line arguments is correct.
function checkArgs() {
  if (process.argv.length !== 4) {
    console.log("Incorrect number of arguments.");
    console.log("node .\\index.js boggleBoardFile wordsListFile");
    return 0;
  }
  return 1;
}

function main() {
  if (!checkArgs()) {
    return;
  }

  board = getBoard();

  if (board == null) {
    return; // stop execution; error reading from file
  }

  dictionary = getDictionary(board.length, board[0].length);

  getAllWords(board, dictionary);
}

main();
