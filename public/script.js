let foundWords;
let board;
let dictionary;
let guessedWords;
let allPaths;

window.onload = async () => {
  // Render the board from "board.txt" on the web UI.

  // board = await getBoard(); // load board from "board.txt"
  let board = getNewBoard(4, 4); // new random board
  renderBoard(board);

  dictionary = await getDictionary(board);
  foundWords = getAllWords(board, dictionary);
  guessedWords = [];
};

// "Click" the guess button when the user presses the "Enter" key
let guessBox = document.getElementById("guessBox");
guessBox.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the guess button
    document.getElementById("guessBtn").click();
  }
});

// Handle the user pressing the guess word button
let guessBtn = document.getElementById("guessBtn");
guessBtn.addEventListener("click", function () {
  // Take the value in the text box, and blank the text box.
  let guess = document.getElementById("guessBox").value;
  document.getElementById("guessBox").value = "";

  // Only take the first word (no spaces or trailing words).
  var firstWord = guess.replace(/ .*/, "");

  // Check if the guess is a valid word in the board.
  if (foundWords.includes(firstWord) && !guessedWords.includes(firstWord)) {
    console.log("You've found a word!");
    guessedWords.push(firstWord);

    // Add the guessed words to the rendered list.
    addToList(firstWord);
    console.log(`All guesses: ${guessedWords}`);
  } else {
    console.log(`${firstWord} is not a valid word`);
  }
});

// Render list of all words on the screen.
let getWordsBtn = document.getElementById("getWordsBtn");
getWordsBtn.addEventListener("click", function () {
  console.log("Valid words: " + foundWords);
  console.log("Guessed words: " + guessedWords);

  let intersection = foundWords.filter((x) => guessedWords.includes(x));
  let difference = foundWords.filter((x) => !guessedWords.includes(x));
  console.log(intersection);
  console.log(difference);

  getWordsBtn.disabled = true; // no more clicking
  renderList(intersection, difference);
});

// Get and render a new board with dimensions.
let newBoardBtn = document.getElementById("getNewBoard");
newBoardBtn.addEventListener("click", async function () {
  // Boiler plate, resetting buttons and lists.
  guessBox.disabled = false;
  guessBtn.disabled = false;
  guessedWords = [];

  // Get the desired dimensions for the board, from the radio buttons.
  let fourByFour = document.getElementById("fourByFour");
  if (fourByFour.checked) {
    // Four by four.
    console.log("4x4");
    n = 4;
    m = 4;
  } else {
    // Five by five.
    console.log("5x5");
    n = 5;
    m = 5;
  }

  let newBoard = getNewBoard(n, m); // new random board

  // Render the new board.
  renderBoard(newBoard);

  document.getElementById("wordsList").innerHTML = ""; // clear the found words list

  getWordsBtn.disabled = false;

  // Because the board contains new letters, get a new dictionary.
  dictionary = await getDictionary(newBoard);

  // Update the found words with the new board's words.
  foundWords = getAllWords(newBoard, dictionary);
});

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
      // Remove a line break, if present.
      if (letter.endsWith("\r")) {
        letter = letter.replace("\r", "");
      }
      board[row][column] = letter.toLowerCase();
      column++;
    });

    row++;
  });

  console.log(board);
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

// Given a 2D matrix of characters and a list of valid words, get all the words
// in the matrix, per the rules of Boggle.
// Return: Array of found words.
function getAllWords(board, dictionaryList) {
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
      getWords(board, i, j, "", usedSpaces, dictionaryList, foundWords);
    }
  }

  return foundWords;
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
    usedSpacesOriginal.includes(currIndexNum) // already added this letter
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
  if (
    validWords.includes(currStr) &&
    !foundWords.includes(currStr) &&
    currStr.length >= 4
  ) {
    foundWords.push(currStr);
  }

  // Now, recursively go every direction from this [i,j]th position, to test
  // all possible strings/paths.
  getWords(board, i + 1, j, currStr, usedSpaces, validWords, foundWords); // down
  getWords(board, i, j + 1, currStr, usedSpaces, validWords, foundWords); // right
  getWords(board, i - 1, j, currStr, usedSpaces, validWords, foundWords); // up
  getWords(board, i, j - 1, currStr, usedSpaces, validWords, foundWords); // left
  getWords(board, i - 1, j - 1, currStr, usedSpaces, validWords, foundWords); // up, left
  getWords(board, i + 1, j + 1, currStr, usedSpaces, validWords, foundWords); // down, right
  getWords(board, i - 1, j + 1, currStr, usedSpaces, validWords, foundWords); // up, right
  getWords(board, i + 1, j - 1, currStr, usedSpaces, validWords, foundWords); // down, left
}

// Given a list of valid words (dictionary) and a string, check to see if the
// string is the prefix of any valid words.
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

// Generates a new 4x4 board of random letters.
// Return: 4x4 matrix of letters.
function getNewBoard(n, m) {
  var alphabet = "abcdefghijklmnopqrstuvwxyz"; // lower case, like dictionary words

  // Populate the 4x4 board with random letters.
  board = [];
  for (let i = 0; i < n; i++) {
    board[i] = []; // each row is an array
    for (let j = 0; j < m; j++) {
      board[i][j] = alphabet.charAt(
        Math.floor(Math.random() * alphabet.length)
      );
    }
  }

  return board;
}

// Given a 2D matrix, render the values onto the table in the Web UI.
function renderBoard(board) {
  let table = document.getElementById("boggleTable");
  let trs = table.getElementsByTagName("tr"); // rows
  let tds = null;

  resizeBoard(board);

  // Now populate the cells with the board data
  for (let i = 0; i < trs.length; i++) {
    tds = trs[i].getElementsByTagName("td"); // returns array of tds
    for (let j = 0; j < tds.length; j++) {
      let cellStr = board[i][j].toUpperCase();
      tds[j].innerText = cellStr;
    }
  }
}

// Given a 2D array, of variable dimensions, update the DOM
// board table to be the correct size to display the matrix.
function resizeBoard(board) {
  let table = document.getElementById("boggleTable");
  let trs = table.getElementsByTagName("tr"); // rows

  let rows = board.length;
  let columns = board[0].length;
  let tableRows = trs.length;
  let tableColumns = trs[0].getElementsByTagName("td").length;

  // Change the size of the font, depending on the board size.
  if (columns === 4) {
    for (let i = 0; i < trs.length; i++) {
      trs[i].style.fontSize = "150%"; // bigger for 4x4
    }
  } else {
    for (let i = 0; i < trs.length; i++) {
      trs[i].style.fontSize = "140%"; // smaller for 5x5
    }
  }

  // Resize the DOM columns.
  if (columns > tableColumns) {
    // More columns in the matrix; add a column
    addColumn(trs, tableRows);
  } else if (columns < tableColumns) {
    // Fewer columns in the matrix than in the DOM table;
    // remove a column
    deleteColumn(trs, tableRows);
  }

  // Resize the DOM rows.
  if (rows > tableRows) {
    addRow(table, columns);
  } else if (rows < tableRows) {
    deleteRow(table);
  }
}

// Given a reference to the DOM table, and a number of columns in a row,
// add a row to the table.
function addRow(table, columns) {
  // Add a row.
  let row = table.insertRow();
  row.style.fontSize = "140%";
  // Populate the row cells
  for (let i = 0; i < columns; i++) {
    row.insertCell();
  }
}

// Given a reference to the DOM table's rows, and a number of rows,
// add a column to the table.
function addColumn(trs, tableRows) {
  // Add a column to the table
  for (let i = 0; i < tableRows; i++) {
    // "Adding a column" is just adding a cell at the
    // end of each row.
    let row = trs[i];
    row.insertCell();
  }
}

// Given a reference to the DOM table, delete a row.
function deleteRow(table) {
  table.deleteRow(0);
}

// Given a reference to the DOM table, delete a column.
function deleteColumn(trs, tableRows) {
  // "Removing a column" is actually removing a cell from each row.
  for (let i = 0; i < tableRows; i++) {
    trs[i].deleteCell(0); // delete the last cell in a row
  }
}

// Add an element (data) to the list and render it on the DOM.
function addToList(data) {
  let list = document.getElementById("wordsList"); // use a different element?
  let li = document.createElement("li");
  li.innerText = data;
  list.appendChild(li);
}

// Given a list of data, render the values into a list in the Web UI.
function renderList(intersection, difference) {
  let list = document.getElementById("wordsList");

  // Create a list element for each word, and add it to the list.
  difference.forEach((item) => {
    let li = document.createElement("li");
    li.innerText = item;
    li.style.color = "black";
    list.appendChild(li);
  });

  guessBtn.disabled = true;
  guessBox.disabled = true;
}
