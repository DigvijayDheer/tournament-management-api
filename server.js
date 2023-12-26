// Importing Express.js to create the server
const express = require("express");

// Importing bodyParser for handling JSON and URL-encoded data
const bodyParser = require("body-parser");

// Importing tournamentRoutes module for defining tournament-related routes
const tournamentRoutes = require("./tournamentsRoutes.js");

// Defining the port number for the server
const port = 5000;

// Creating an instance of the Express application
const app = express();

// Configuring middleware to parse JSON data
app.use(bodyParser.json());

// Configuring middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Using the tournamentRoutes module for handling routes at the root level
app.use("/", tournamentRoutes);

// Starting the server and listening on the specified port
app.listen(port, () => {
  console.log(`Server is started on the port ${port}`);
});
