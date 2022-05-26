const router = require("express").Router();
const {
  getAllSkills,
  getSkillMilestones,
} = require("../services/skillsService.js");

router.get("/", async (req, res) => {
  const skills = await getAllSkills();

  return res.status(200).json(skills);
});

router.get("/:id", async (req, res) => {
  const milestones = await getSkillMilestones(req.params.id);

  return res.status(200).json(milestones);
});

module.exports = router;
