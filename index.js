const fs = require("fs");
const { exit } = require("process");

function main() {
  board = getBoard();
  if (board == null) {
    return; // stop execution; error reading from file
  }
}

function getBoard() {
  let fileName = "board.txt"; // default
  if (process.argv.length == 3) {
    fileName = process.argv[2]; // get file name from CLAs, if applicable
  }

  const readFileLines = (fileName) =>
    fs.readFileSync(fileName).toString("utf-8").split(" ");

  try {
    let board = readFileLines(fileName);
    return board;
  } catch (err) {
    console.log(
      `Error reading from file "${fileName}". Try a different file name?`
    );
    return null;
  }
}

main();
