/* generateWordList.js
 *
 * using the 'an-array-of-english-words' library, write a list
 * of English words to a text file, words.txt.
 *
 * to run: node .\generateWordList.js
 *
 * Jamey Vinson
 * April 22, 2023
 *
 */

const fs = require("fs");
const words = require("an-array-of-english-words");

function main() {
  // write the board to file board.txt
  fs.writeFile("words.txt", JSON.stringify(words), (err) => {
    if (err) throw err;
  });
}

main();
