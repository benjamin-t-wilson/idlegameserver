const mysql = require("mysql2");
const { executeStoredProc, executeStoredProcs } = require("./mySqlService");
const { getSkillMilestones } = require("./skillsService");

const getAllCharactersForUser = async (id) => {
  const characters = await executeStoredProc(
    `call sp_getCharactersByUser(${mysql.escape(id)})`
  );

  return characters;
};

const getCharacterInfo = async (id) => {
  const charResults = await executeStoredProcs([
    `call sp_getCharacterActiveSkill(${mysql.escape(id)})`,
    `call sp_getCharacterSkills(${mysql.escape(id)})`,
    `call sp_getCharacterInventory(${mysql.escape(id)})`,
  ]);

  const charActiveSkillRes = charResults[0][0];
  const skills = charResults[1];
  const inventory = charResults[2];

  const milestones = charActiveSkillRes
    ? await getSkillMilestones(charActiveSkillRes.skill_id)
    : null;

  const charInfo = {
    active_skill: charActiveSkillRes
      ? {
          _id: charActiveSkillRes._id,
          skill_id: charActiveSkillRes.skill_id,
          skill: charActiveSkillRes.name,
          node: milestones.filter(
            (node) => node.id == charActiveSkillRes.milestone_id
          )[0],
        }
      : null,
    skills: Object.fromEntries(
      skills.map((skill) => [
        skill.s_name,
        {
          _id: skill.cs_id,
          xp: skill.xp,
          lvl: skill.lvl,
          skill_id: skill.s_id,
        },
      ])
    ),
    inventory: Object.fromEntries(
      inventory.map((item) => [
        item.name,
        { item_id: item.item_id, _id: item._id, quantity: item.quantity },
      ])
    ),
  };

  return charInfo;
};

const insertCharacter = async (userId, name) => {
  return await executeStoredProc(
    `call sp_insertCharacter('${name}', ${userId})`
  );
};

const saveCharacter = async (character) => {
  let promises = [];
  if (
    character.active_skill &&
    Object.keys(character.active_skill).length > 0
  ) {
    promises.push(
      executeStoredProc(
        `call sp_updateCharacterActiveSkill(${character.active_skill._id}, ${character.active_skill.skill_id}, ${character.active_skill.node._id})`
      )
    );
  }

  promises.push(
    executeStoredProc(
      `call sp_updateCharacter(${character._id}, '${character.name}', ${character.last_save})`
    )
  );

  for (let itemName in character.inventory) {
    promises.push(
      executeStoredProc(
        `call sp_updateCharacterInventory(${character.inventory[itemName]._id}, ${character._id}, ${character.inventory[itemName].item_id}, ${character.inventory[itemName].quantity})`
      )
    );
  }

  for (let skillName in character.skills) {
    promises.push(
      executeStoredProc(
        `call sp_updateCharacterSkill(${character.skills[skillName]._id}, ${character._id}, ${character.skills[skillName].skill_id}, ${character.skills[skillName].xp}, ${character.skills[skillName].lvl})`
      )
    );
  }

  await Promise.all(promises);

  return true;
};

module.exports = {
  getAllCharactersForUser,
  getCharacterInfo,
  insertCharacter,
  saveCharacter,
};
