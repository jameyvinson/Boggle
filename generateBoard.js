/* generateBoard.js
 *
 * generates an mxn matrix of random alphabetical characters, and prints
 * this matrix to a text file, board.txt
 *
 * to run: node .\generateBoard.js numberColumns numberRows
 *
 * Jamey Vinson
 * April 22, 2023
 *
 */

const fs = require("fs");

// given the dimensions of the board, m = cols and n = rows,
// generate mxn matrix, where each element is a random letter from A-Z
// return: mxn matrix of random letters
function generateBoard(m, n) {
  // alphabet of uppercase letters
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // board will be
  var board = [];
  for (var i = 0; i < n; i++) {
    board[i] = [];
    for (var j = 0; j < m; j++) {
      board[i][j] = alphabet.charAt(
        Math.floor(Math.random() * alphabet.length)
      );
    }
  }

  return board;
}

// given a mxn matrix of alphabetic characters, write the matrix to a file
// file will have each line separated by a new line, with elements separated
// by spaces
function createFile(board) {
  // first, delete any data in an existing file named "board.txt"
  if (fs.existsSync("board.txt")) {
    fs.truncate("board.txt", 0, (err) => {
      if (err) throw err;
    });
  }

  // write the board to file board.txt line by line, separated by spaces
  for (let i = 0; i < board.length; i++) {
    str = board[i].toString() + "\n";
    fs.appendFile("board.txt", str, (err) => {
      if (err) throw err;
    });
  }
}

// given the argv command line arguments, check that the arguments exist and
// are valid positive numbers
// return: 1 if valid, 0 if invalid
function checkArgs() {
  if (process.argv.length !== 4) {
    console.log("Incorrect number of arguments.");
  } else if (isNaN(process.argv[2]) && isNaN(process.argv[3])) {
    console.log("Arguments must be numerical.");
  } else if (process.argv[2] <= 0 && process.argv[3] <= 0) {
    console.log("Arguments must be greater than 0.");
  } else {
    return 1; // arguments are valid
  }

  console.log("node .\\generateBoard.js numberColumns numberRows");
  return 0; // arguments are invalid
}

function main() {
  // check that the correct arguments are provided
  if (!checkArgs()) {
    return;
  }

  // m = columns, n = rows
  m = process.argv[2];
  n = process.argv[3];

  // populate board, a mxn matrix
  board = generateBoard(m, n);

  // print to "board.txt" file
  createFile(board);

  console.log(`${m} x ${n} board created and printed to board.txt file.`);
}

main();
