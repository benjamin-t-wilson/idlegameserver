const mysql = require("mysql2");
const { executeStoredProc } = require("./mySqlService.js");

const insertUser = async (user) => {
  return await executeStoredProc(
    `call sp_insertUser(${mysql.escape(user.email)}, ${mysql.escape(
      user.username
    )}, ${mysql.escape(user.password)})`
  );
};

const getUserByIdentifier = async (identifier) => {
  return await executeStoredProc(
    `call sp_getUser(${mysql.escape(identifier)})`
  );
};

module.exports = {
  insertUser,
  getUserByIdentifier,
};
