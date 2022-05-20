const router = require("express").Router();
const {
  insertUser,
  getUserByUsername,
} = require("../services/usersService.js");
const { decodeString } = require("../services/encryptionService.js");

router.post("/register", async (req, res) => {
  const info = req.body;

  if (!info || !info.username || !info.email || !info.password) {
    return res
      .status(400)
      .json({ message: "Must have valid username, email, and password" });
  }

  const userId = await insertUser(info);

  return res.status(200).json(userId);
});

router.post("/login", async (req, res) => {
  const creds = req.body;

  if (!creds || !creds.login || !creds.password) {
    return res
      .status(400)
      .json({ message: "Must have valid login and password" });
  }

  const user = await getUserByUsername(creds.login);

  if (!user) {
    return res.status(401);
  }

  if (user && decodeString(user.password) === decodeString(creds.password)) {
    return res.status(200).json(user._id);
  }
});

module.exports = router;
