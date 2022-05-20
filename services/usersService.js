const { ObjectId } = require("mongodb");
const { getDocument, insertDocument } = require("./mongoDbService.js");

const insertUser = async (user) => {
  const userId = await insertDocument("users", user);

  return userId;
};

const getUserByUsername = async (username) => {
  const user = await getDocument("users", {
    username: username,
  });

  return user;
};

module.exports = {
  insertUser,
  getUserByUsername,
};
