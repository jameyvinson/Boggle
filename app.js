/* app.js
*/
const express = require("express");
const app = express();
const port = 5000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
