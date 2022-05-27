const mysql = require("mysql2/promise");

const createDbConnection = async () =>
  await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
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
