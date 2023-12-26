const express = require("express");
const bodyParser = require("body-parser");
const tournamentRoutes = require("./tournamentsRoutes.js");

const port = 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", tournamentRoutes);

app.listen(port, () => {
  console.log(`Server is started on the port ${port}`);
});
