// to run: node .\generateBoard.js numberOfRows numberOfColumns
// if i and j are not supplied, default values are 4

function main() {
  let i = 4, j = 4 // default dimensions are 4x4

  // check that the arguments are valid
  if(process.argv.length == 4 && !isNaN(process.argv[2]) && !isNaN(process.argv[3]) && process.argv[2] > 0 && process.argv[3] > 0) {
    i = process.argv[2]
    j = process.argv[3]
  } 
  
}

main()
