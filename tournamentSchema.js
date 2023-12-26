// Importing Joi for schema validation
const Joi = require("joi");

// Importing uuid for generating unique identifiers
const uuid = require("uuid");

// Defining the schema for a player
const playerSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
  name: Joi.string().required(),
  score: Joi.number().integer().required(),
});

// Defining the schema for a room, including playerSchema as an array
const roomSchema = Joi.object({
  roomId: Joi.string().guid({ version: "uuidv4" }).required(),
  players: Joi.array().items(playerSchema).max(4).required(),
});

// Defining the schema for a tournament, including roomSchema as an array
const tournamentSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
  name: Joi.string().required(),
  winner_name: Joi.string().allow("").required(),
  is_ended: Joi.boolean().required(),
  rooms: Joi.array().items(roomSchema).required(),
});

// Function to generate a unique identifier using uuid
const generateUniqueId = () => uuid.v4();

// Function to create a new tournament with a unique identifier and provided name
const createNewTournament = (name) => {
  return {
    id: generateUniqueId(),
    name,
    winner_name: "",
    is_ended: false,
    rooms: [],
  };
};

// Exporting the tournamentSchema and createNewTournament function
module.exports = {
  tournamentSchema,
  createNewTournament,
};
