const express = require("express");
const router = express.Router();
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

router.get("/tournaments", getAllTournaments);

router.get("/tournaments/:tournamentId", getSingleTournament);

router.post("/tournaments", createTournament);

router.post("/tournaments/:tournamentId/rooms", addRoom);

router.post("/tournaments/:tournamentId/rooms/:roomId/players", addPlayer);

router.put(
  "/tournaments/:tournamentId/rooms/:roomId/players/:playerId/score",
  editPlayerScore
);

router.post("/tournaments/:tournamentId/end", endTournament);

router.delete("/tournaments/:tournamentId/rooms/:roomId", deleteRoom);

router.delete(
  "/tournaments/:tournamentId/rooms/:roomId/players/:playerId",
  deletePlayer
);

router.delete("/tournaments/:tournamentId", deleteTournament);

module.exports = router;
