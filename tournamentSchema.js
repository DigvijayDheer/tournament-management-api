const Joi = require("joi");
const uuid = require("uuid");

const playerSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
  name: Joi.string().required(),
  score: Joi.number().integer().required(),
});

const roomSchema = Joi.object({
  roomId: Joi.string().guid({ version: "uuidv4" }).required(),
  players: Joi.array().items(playerSchema).max(4).required(),
});

const tournamentSchema = Joi.object({
  id: Joi.string().guid({ version: "uuidv4" }).required(),
  name: Joi.string().required(),
  winner_name: Joi.string().allow("").required(),
  is_ended: Joi.boolean().required(),
  rooms: Joi.array().items(roomSchema).required(),
});

const generateUniqueId = () => uuid.v4();

const createNewTournament = (name) => {
  return {
    id: generateUniqueId(),
    name,
    winner_name: "",
    is_ended: false,
    rooms: [],
  };
};

module.exports = {
  tournamentSchema,
  createNewTournament,
};
