// Importing necessary libraries and modules
const {
  tournamentSchema,
  createNewTournament,
} = require("./tournamentSchema.js");
const uuid = require("uuid");

// Initial array of tournaments (mock data)
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

// Controller function to get all tournaments
const getAllTournaments = (req, res) => {
  try {
    // Check if there are any tournaments
    if (!tournaments.length) {
      throw new Error("No Tournaments Found");
    }

    // Calculate and update winner if the tournament is ended
    tournaments.forEach((tournament) => {
      if (tournament.is_ended && !tournament.winner_name) {
        tournament.winner_name = calculateWinner(tournament.rooms);
      }
    });

    // Respond with the list of tournaments
    res.status(200).json(tournaments);
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Controller function to get a single tournament by ID
const getSingleTournament = (req, res) => {
  try {
    // Extract tournament ID from the request parameters
    const tournamentId = req.params.tournamentId;

    // Find the tournament with the specified ID
    const tournament = tournaments.find((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Calculate and update winner if the tournament is ended
    if (tournament.is_ended && !tournament.winner_name) {
      tournament.winner_name = calculateWinner(tournament.rooms);
    }

    // Respond with the details of the specified tournament
    res.status(200).json(tournament);
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Controller function to create a new tournament
const createTournament = (req, res) => {
  try {
    // Create a new tournament object with a unique ID and provided name
    const newTournament = createNewTournament(req.body.name);

    // Validate the new tournament object against the schema
    const { error } = tournamentSchema.validate(newTournament);

    // If there is a validation error, respond with the error message
    if (error) {
      console.log("Validation Error:", error.details);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Add the new tournament to the tournaments array
    tournaments.push(newTournament);

    // Respond with a success message and the created tournament
    res.json({
      message: "Tournament created successfully!",
      tournament: newTournament,
    });
  } catch (error) {
    // Handle internal server error
    console.log("Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to add a room to a tournament
const addRoom = (req, res) => {
  try {
    // Extract tournament ID from the request parameters
    const tournamentId = req.params.tournamentId;

    // Find the tournament in the array
    const tournament = tournaments.find((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Check if the tournament has ended; if yes, respond with an error
    if (tournament.is_ended) {
      return res.status(400).json({
        error: "Tournament has ended. No further modifications allowed.",
      });
    }

    // Create a new room with a unique ID and an empty array of players
    const newRoom = {
      roomId: uuid.v4(),
      players: [],
    };

    // Add the new room to the tournament and respond with the updated room
    tournament.rooms.push(newRoom);
    res.json({ message: "Room added successfully!", room: newRoom });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to add a player to a room in a tournament
const addPlayer = (req, res) => {
  try {
    // Extract tournament and room IDs from the request parameters
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;

    // Find the tournament in the array
    const tournament = tournaments.find((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Check if the tournament has ended; if yes, respond with an error
    if (tournament.is_ended) {
      return res.status(400).json({
        error: "Tournament has ended. No further modifications allowed.",
      });
    }

    // Find the room in the tournament
    const room = tournament.rooms.find((r) => r.roomId === roomId);

    // If the room is not found, respond with an error
    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    // Check if the room is already full; if yes, respond with an error
    if (room.players.length >= tournament.maxPlayersPerRoom) {
      return res
        .status(400)
        .json({ error: "Room is full. Add a new room first." });
    }

    // Create a new player with a unique ID, provided name, and initial score of 0
    const newPlayer = {
      id: uuid.v4(),
      name: req.body.name,
      score: 0,
    };

    // Add the new player to the room and respond with the updated room
    room.players.push(newPlayer);
    res.json({ message: "Player added successfully!", player: newPlayer });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to edit a player's score
const editPlayerScore = (req, res) => {
  try {
    // Extract tournament, room, player IDs, and the new score from the request parameters and body
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;
    const playerId = req.params.playerId;
    const score = req.body.score;

    // Find the tournament in the array
    const tournament = tournaments.find((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Find the room in the tournament
    const room = tournament.rooms.find((r) => r.roomId === roomId);

    // If the room is not found, respond with an error
    if (!room) {
      return res.status(404).json({ error: "Room not found!" });
    }

    // Find the player in the room
    const player = room.players.find((p) => p.id === playerId);

    // If the player is not found, respond with an error
    if (!player) {
      return res.status(404).json({ error: "Player not found!" });
    }

    // Update the player's score and respond with the updated player
    player.score = score;

    res.json({ message: "Player score updated successfully!", player });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to end a tournament
const endTournament = (req, res) => {
  try {
    // Extract tournament ID from the request parameters
    const tournamentId = req.params.tournamentId;

    // Find the tournament in the array
    const tournament = tournaments.find((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Check if the tournament has already ended
    if (tournament.is_ended) {
      // If a winner is not calculated, calculate and respond with the winner
      if (!tournament.winner_name) {
        tournament.winner_name = calculateWinner(tournament.rooms);
      }

      return res.json({
        message: "Tournament has already ended.",
        winner: tournament.winner_name,
      });
    }

    // Calculate the winner, mark the tournament as ended, and respond with the result
    tournament.winner_name = calculateWinner(tournament.rooms);
    tournament.is_ended = true;

    res.json({
      message: "Tournament ended successfully!",
      winner: tournament.winner_name,
    });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to calculate the winner of a tournament
const calculateWinner = (rooms) => {
  let totalScores = {};
  let maxScore = -1;
  let winners = [];

  // Iterate through rooms and players to calculate scores and find winners
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

  // Determine the winner based on scores
  if (winners.length === 1) {
    return winners[0];
  } else {
    return `Draw between ${winners.join(" and ")}`;
  }
};

// Function to delete a room from a tournament
const deleteRoom = (req, res) => {
  try {
    // Extract tournament and room IDs from the request parameters
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;

    // Find the index of the tournament in the array
    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Find the index of the room in the tournament's rooms array
    const roomIndex = tournaments[tournamentIndex].rooms.findIndex(
      (r) => r.roomId === roomId
    );

    // If the room is not found, respond with an error
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found!" });
    }

    // Remove the room from the tournament's rooms array
    tournaments[tournamentIndex].rooms.splice(roomIndex, 1);

    // Respond with a success message
    res.json({ message: "Room deleted successfully!" });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to delete a player from a room in a tournament
const deletePlayer = (req, res) => {
  try {
    // Extract tournament, room, and player IDs from the request parameters
    const tournamentId = req.params.tournamentId;
    const roomId = req.params.roomId;
    const playerId = req.params.playerId;

    // Find the index of the tournament in the array
    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Find the index of the room in the tournament's rooms array
    const roomIndex = tournaments[tournamentIndex].rooms.findIndex(
      (r) => r.roomId === roomId
    );

    // If the room is not found, respond with an error
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found!" });
    }

    // Find the index of the player in the room's players array
    const playerIndex = tournaments[tournamentIndex].rooms[
      roomIndex
    ].players.findIndex((p) => p.id === playerId);

    // If the player is not found, respond with an error
    if (playerIndex === -1) {
      return res.status(404).json({ error: "Player not found!" });
    }

    // Remove the player from the room's players array
    tournaments[tournamentIndex].rooms[roomIndex].players.splice(
      playerIndex,
      1
    );

    // Respond with a success message
    res.json({ message: "Player deleted successfully!" });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Function to delete a tournament
const deleteTournament = (req, res) => {
  try {
    // Extract tournament ID from the request parameters
    const tournamentId = req.params.tournamentId;

    // Find the index of the tournament in the array
    const tournamentIndex = tournaments.findIndex((t) => t.id === tournamentId);

    // If the tournament is not found, respond with an error
    if (tournamentIndex === -1) {
      return res.status(404).json({ error: "Tournament not found!" });
    }

    // Remove the tournament from the array
    tournaments.splice(tournamentIndex, 1);

    // Respond with a success message
    res.json({ message: "Tournament deleted successfully!" });
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal Server Error!" });
  }
};

// Exporting all controller functions for use in routes
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
