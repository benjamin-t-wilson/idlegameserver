const mysql = require("mysql2");
const { executeStoredProc, executeStoredProcs } = require("./mySqlService.js");

const getAllSkills = async () => {
  return await executeStoredProc(`call sp_getSkills()`);
};

const getSkillMilestones = async (id) => {
  const results = await executeStoredProcs([
    `call sp_getSkillsMilestones(${mysql.escape(id)})`,
    `call sp_getMilestonesDrops(${mysql.escape(id)})`,
    `call sp_getMilestonesRequires(${mysql.escape(id)})`,
  ]);

  const skillInfo = [];

  results[0].forEach((milestone) => {
    skillInfo.push({
      ...milestone,
      drops: results[1].filter((drop) => drop._id == milestone._id),
      requires: results[2].filter((item) => item._id == milestone._id),
    });
  });

  return skillInfo;
};

module.exports = {
  getAllSkills,
  getSkillMilestones,
};
