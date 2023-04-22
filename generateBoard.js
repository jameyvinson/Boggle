// to run: node .\generateBoard.js numberOfColummns numberOfRows
// if columns and rows are not supplied, default values are 4
const fs = require('fs');

// given the dimensions of the board, m = cols and n = rows,
// generate mxn matrix, where each element is a random letter from A-Z
// return: mxn matrix of random letters
function generateBoard(m, n) {
  // alphabet of uppercase letters
  var alphabet = 'ABCDEFGHIJKLMNOPQUSTUVWXYZ';

  // board will be 
  var board = [];
  for(var i = 0; i < n; i++) {
    board[i] = [];
    for(var j = 0; j < m; j++) {
      board[i][j] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
  }

  return board;
}

function main() {
  let i = 4, j = 4; // default dimensions are 4x4

  // check that the arguments are valid
  if(process.argv.length == 4 && !isNaN(process.argv[2]) && !isNaN(process.argv[3]) && process.argv[2] > 0 && process.argv[3] > 0) {
    m = process.argv[2];
    n = process.argv[3];
  } 
  
  board = generateBoard(m,n);
  console.log(board);

  // write the board to file board.txt
  fs.writeFile('board.txt', JSON.stringify(board), (err) => {
    if (err) throw err;
  })
}

main()
