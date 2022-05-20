const router = require("express").Router();
const {
  getAllCharactersForUser,
  getCharacter,
  insertCharacter,
  saveCharacter,
} = require("../services/charactersService.js");

router.get("/all/:id", async (req, res) => {
  const characters = await getAllCharactersForUser(req.params.id);

  return res.status(200).json(characters);
});

router.get("/single/:id", async (req, res) => {
  const character = await getCharacter(req.params.id);

  return res.status(200).json(character);
});

router.post("/", async (req, res) => {
  const { userId, name } = req.body;
  const characterId = await insertCharacter(userId, name);
  const newChar = await getCharacter(characterId);

  res.status(200).json(newChar);
});

router.post("/:id", async (req, res) => {
  const character = req.body;

  const result = await saveCharacter(character);

  return res.status(200).json(result);
});

module.exports = router;
