// Importing required libraries and modules
const express = require("express");
const router = express.Router();

// Importing tournament controllers for route handling
const {
  createTournament,
  addPlayer,
  addRoom,
  endTournament,
  getAllTournaments,
  getSingleTournament,
  editPlayerScore,
  deleteRoom,
  deletePlayer,
  deleteTournament,
} = require("./tournamentsControllers.js");

// Defining routes with corresponding controllers

// Route to get all tournaments
router.get("/tournaments", getAllTournaments);

// Route to get a single tournament by ID
router.get("/tournaments/:tournamentId", getSingleTournament);

// Route to create a new tournament
router.post("/tournaments", createTournament);

// Route to add a room to a tournament
router.post("/tournaments/:tournamentId/rooms", addRoom);

// Route to add a player to a room in a tournament
router.post("/tournaments/:tournamentId/rooms/:roomId/players", addPlayer);

// Route to update a player's score in a room of a tournament
router.put(
  "/tournaments/:tournamentId/rooms/:roomId/players/:playerId/score",
  editPlayerScore
);

// Route to end a tournament and calculate the winner
router.put("/tournaments/:tournamentId/end", endTournament);

// Route to delete a room from a tournament
router.delete("/tournaments/:tournamentId/rooms/:roomId", deleteRoom);

// Route to delete a player from a room in a tournament
router.delete(
  "/tournaments/:tournamentId/rooms/:roomId/players/:playerId",
  deletePlayer
);

// Route to delete a tournament
router.delete("/tournaments/:tournamentId", deleteTournament);

// Exporting the router for use in the main application
module.exports = router;
