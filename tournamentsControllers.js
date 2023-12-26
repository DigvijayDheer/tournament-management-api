const {
  tournamentSchema,
  createNewTournament,
} = require("./tournamentSchema.js");
const uuid = require("uuid");

let tournaments = [
  {
    id: "tournament_id_1",
    name: "Test Tournament",
    winner_name: "",
    is_ended: true,
    rooms: [
      {
        roomId: "room_id_1",
        players: [
          { id: "room1_player1_id", name: "Room1_Player1", score: 20 },
          { id: "room1_player2_id", name: "Room1_Player2", score: 15 },
          { id: "room1_player3_id", name: "Room1_Player3", score: 35 },
          { id: "room1_player4_id", name: "Room1_Player4", score: 17 },
        ],
      },
      {
        roomId: "room_id_2",
        players: [
          { id: "room2_player1_id", name: "Room2_Player1", score: 22 },
          { id: "room2_player2_id", name: "Room2_Player2", score: 35 },
          { id: "room2_player3_id", name: "Room2_Player3", score: 33 },
          { id: "room2_player4_id", name: "Room2_Player4", score: 7 },
        ],
      },
    ],
  },
];

const getAllTournaments = (req, res) => {
  try {
    if (!tournaments.length) {
      throw new Error("No Tournaments Found");
    }

    tournaments.forEach((tournament) => {
      if (tournament.is_ended && !tournament.winner_name) {
        tournament.winner_name = calculateWinner(tournament.rooms);
      }
    });

    res.status(200).json(tournaments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const getSingleTournament = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const tournament = tournaments.find((t) => t.id === tournamentId);

    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    if (tournament.is_ended && !tournament.winner_name) {
      tournament.winner_name = calculateWinner(tournament.rooms);
    }

    res.status(200).json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const createTournament = (req, res) => {
  try {
    const newTournament = createNewTournament(req.body.name);

    console.log("New Tournament Object:", newTournament);

    const { error } = tournamentSchema.validate(newTournament);

    if (error) {
      console.log("Validation Error:", error.details);
      return res.status(400).json({ error: error.details[0].message });
    }

    tournaments.push(newTournament);
    res.json({
      message: "Tournament created successfully!",
      tournament: newTournament,
    });
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const addRoom = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    if (tournament.is_ended) {
      return res.status(400).json({
        error: "Tournament has ended. No further modifications allowed.",
      });
    }

    const newRoom = {
      roomId: uuid.v4(),
      players: [],
    };

    tournament.rooms.push(newRoom);
    res.json({ message: "Room added successfully!", room: newRoom });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const addPlayer = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;

    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    if (tournament.is_ended) {
      return res.status(400).json({
        error: "Tournament has ended. No further modifications allowed.",
      });
    }

    const room = tournament.rooms.find((r) => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    if (room.players.length >= tournament.maxPlayersPerRoom) {
      return res
        .status(400)
        .json({ error: "Room is full. Add a new room first." });
    }

    const newPlayer = {
      id: uuid.v4(),
      name: req.body.name,
      score: 0,
    };

    room.players.push(newPlayer);
    res.json({ message: "Player added successfully!", player: newPlayer });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const editPlayerScore = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;
    const playerId = req.params.playerId;
    const score = req.body.score;

    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    const room = tournament.rooms.find((r) => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: "Player not found!" });
    }

    player.score = score;

    res.json({ message: "Player score updated successfully!", player });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const endTournament = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    if (tournament.is_ended) {
      if (!tournament.winner_name) {
        tournament.winner_name = calculateWinner(tournament.rooms);
      }

      return res.json({
        message: "Tournament has already ended.",
        winner: tournament.winner_name,
      });
    }

    if (tournament.rooms.some((room) => room.players.length > 0)) {
      return res.status(400).json({
        error: "Some rooms still have players. End those rooms first.",
      });
    }

    tournament.winner_name = calculateWinner(tournament.rooms);
    tournament.is_ended = true;

    res.json({
      message: "Tournament ended successfully!",
      winner: tournament.winner_name,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const calculateWinner = (rooms) => {
  let totalScores = {};
  let maxScore = -1;
  let winners = [];

  rooms.forEach((room) => {
    room.players.forEach((player) => {
      totalScores[player.name] = (totalScores[player.name] || 0) + player.score;

      if (player.score > maxScore) {
        maxScore = player.score;
        winners = [player.name];
      } else if (player.score === maxScore) {
        winners.push(player.name);
      }
    });
  });

  if (winners.length === 1) {
    return winners[0];
  } else {
    return `Draw between ${winners.join(" and ")}`;
  }
};

const deleteRoom = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;

    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    const roomIndex = tournaments[tournamentIndex].rooms.findIndex(
      (r) => r.roomId === roomId
    );
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found!" });
    }

    tournaments[tournamentIndex].rooms.splice(roomIndex, 1);

    res.json({ message: "Room deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const deletePlayer = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;
    const playerId = req.params.playerId;

    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    const roomIndex = tournaments[tournamentIndex].rooms.findIndex(
      (r) => r.roomId === roomId
    );
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found!" });
    }

    const playerIndex = tournaments[tournamentIndex].rooms[
      roomIndex
    ].players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      return res.status(404).json({ error: "Player not found!" });
    }

    tournaments[tournamentIndex].rooms[roomIndex].players.splice(
      playerIndex,
      1
    );

    res.json({ message: "Player deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

const deleteTournament = (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;

    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    tournaments.splice(tournamentIndex, 1);

    res.json({ message: "Tournament deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

module.exports = {
  getAllTournaments,
  getSingleTournament,
  createTournament,
  addRoom,
  addPlayer,
  editPlayerScore,
  endTournament,
  deleteRoom,
  deletePlayer,
  deleteTournament,
};
