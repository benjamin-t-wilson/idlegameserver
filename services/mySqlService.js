const mysql = require("mysql2/promise");

const createDbConnection = async () =>
  await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "guitar9994bagel",
    database: "idle",
  });

const executeStoredProc = async (sql) => {
  const db = await createDbConnection();

  const [rows] = await db.execute(sql);

  await db.end();

  return rows[0];
};

const executeStoredProcs = async (procList) => {
  const db = await createDbConnection();

  const results = await Promise.all(
    procList.map(async (proc) => await db.execute(proc))
  );

  await db.end();

  return results.map((res) => res[0][0]);
};

module.exports = { createDbConnection, executeStoredProc, executeStoredProcs };
