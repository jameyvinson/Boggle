# Boggle
This program solves for all valid words in a Boggle board.

## Web UI
To run this program in a web browser, clone repository and navigate to the main directory. (Note: this project runs in Node.js, so Node.js will need to be installed. Get installation information here: https://nodejs.org/en.) Once there, type 
```
node app.js
```
in the command line. This will launch the page, which can be viewed in a web browser at http://localhost:5000/. 
<br><br>
This program reads from two files, `board.txt` and `words.txt`. Two sample files have been provided in the repository, and can be updated by running the `generateBoard.js` and `generateWords.js` programs. Instructions for running these programs are below.

## Console App
To run the Boggle program as a console app, navigate to the `console-app` directory. This program takes two command line arguments: a board text file and a words text file. The board text file can be generated using `generateBoard.js`, and the words list file can be generated by running `generateWords.txt`. Two sample files are provided in the repository, `board.txt` and `words.txt`. To run the console app, type 
```
node boggleConsole.js <path-to-board-file> <path-to-words-file>
```
where `<path-to-board-file>` and `<path-to-words-file>` specify the relative path to `board.txt` and `words.txt`. The console app will then run and print out the list of valid words on the specified board.

## Generating a new board and word list file
To generate new a new board, navigate to the main directory for the repository. Run the `generateBoard.js` program by typing 
```
node generateBoard.js <number-of-rows> <number-of-columns>
```
where `<number-of-rows>` and `<number-of-columns>` are two integers specifying the dimensions of the board. The new board will be printed to `board.txt`.
<br><br>
To generate a `words.txt` file, type 
```
node generateWords.js
``` 
from the main directory. The words list will be printed to `words.txt`. The list of the words used is from `an-array-of-english-words` (more info here: https://github.com/words/an-array-of-english-words).


