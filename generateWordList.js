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
  // first, delete any data in an existing file named "words.txt"
  if (fs.existsSync("words.txt")) {
    fs.truncate("words.txt", 0, (err) => {
      if (err) throw err;
    });
  }

  // write the words to file words.txt string by string, separated by spaces

  fs.appendFile("words.txt", words.toString(), (err) => {
    if (err) throw err;
  });
}

main();
