const { ObjectId } = require("mongodb");
const {
  getCollection,
  getDocument,
  insertDocument,
  updateDocument,
} = require("./mongoDbService.js");
const { getAllSkills } = require("./skillsService.js");

const getAllCharactersForUser = async (id) => {
  const characters = await getCollection("characters", {
    user_id: new ObjectId(id),
  });

  return characters;
};

const getCharacter = async (id) => {
  const character = await getDocument("characters", { _id: new ObjectId(id) });

  return character;
};

const insertCharacter = async (userId, name) => {
  const rawSkills = await getAllSkills();
  let skillsForCharacter = {};

  rawSkills.forEach((skill) => {
    skillsForCharacter[skill.name] = {
      lvl: 1,
      xp: 0,
    };
  });

  const newChar = {
    user_id: new ObjectId(userId),
    name,
    skills: skillsForCharacter,
    active_skill: {},
    last_save: Date.now(),
    inventory: {},
  };

  return await insertDocument("characters", newChar);
};

const saveCharacter = async (character) => {
  character.last_save = Date.now();
  delete character.user_id;

  return await updateDocument("characters", character);
};

module.exports = {
  getAllCharactersForUser,
  getCharacter,
  insertCharacter,
  saveCharacter,
};
