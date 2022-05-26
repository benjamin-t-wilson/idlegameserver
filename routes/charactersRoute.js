const router = require("express").Router();
const {
  getAllCharactersForUser,
  getCharacterInfo,
  insertCharacter,
  saveCharacter,
} = require("../services/charactersService.js");

router.get("/all/:id", async (req, res) => {
  const characters = await getAllCharactersForUser(req.params.id);

  return res.status(200).json(characters);
});

router.get("/information/:id", async (req, res) => {
  const character = await getCharacterInfo(req.params.id);

  return res.status(200).json(character);
});

router.post("/", async (req, res) => {
  const { userId, name } = req.body;

  try {
    const response = await insertCharacter(userId, name);
    const characterId = response[0]["LAST_INSERT_ID()"];
    const charInfo = await getCharacterInfo(characterId);

    return res
      .status(200)
      .json({
        _id: characterId,
        name,
        user_id: userId,
        last_save: null,
        ...charInfo,
      });
  } catch (err) {
    return res.status(500).json(err.code ? err.code : err);
  }
});

router.post("/:id", async (req, res) => {
  const character = req.body;

  const result = await saveCharacter(character);

  return res.status(200).json(result);
});

module.exports = router;
