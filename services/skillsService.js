const { getCollection, getDocument } = require("./mongoDbService.js");

const getAllSkills = async () => {
  const skills = await getCollection("skills");

  return skills;
};

const getSkill = async (id) => {
  const ObjectId = require("mongodb").ObjectId;
  const skill = await getDocument("skills", { _id: new ObjectId(id) });

  return skill;
};

module.exports = {
  getAllSkills,
  getSkill,
};
