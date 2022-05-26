const router = require("express").Router();
const {
  insertUser,
  getUserByIdentifier,
} = require("../services/usersService.js");
const { decodeString } = require("../services/encryptionService.js");

router.post("/register", async (req, res) => {
  const info = req.body;

  if (!info || !info.username || !info.email || !info.password) {
    return res
      .status(400)
      .json({ message: "Must have valid username, email, and password" });
  }

  try {
    const response = await insertUser(info);
    const userId = response?.[0]?.["LAST_INSERT_ID()"];

    return res.status(200).json({ userId });
  } catch (err) {
    return res.status(500).json(err.code);
  }
});

router.post("/login", async (req, res) => {
  const creds = req.body;

  if (!creds || !creds.login || !creds.password) {
    return res
      .status(400)
      .json({ message: "Must have valid login and password" });
  }

  const user = await getUserByIdentifier(creds.login);

  if (!user || !user[0]) {
    return res.status(401).json();
  }

  const dbPw = decodeString(user[0].password) || null;
  const inputPw = decodeString(creds.password) || null;

  if (dbPw && inputPw && dbPw === inputPw) {
    return res.status(200).json({ userId: user[0]._id });
  } else {
    return res.status(401).json();
  }
});

module.exports = router;
