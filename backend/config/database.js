require("dotenv").config();

const odbc = require("odbc");

const connectionString =
  `Driver={${process.env.DB_DRIVER}};` +
  `Server=${process.env.DB_SERVER};` +
  `Database=${process.env.DB_DATABASE};` +
  "Trusted_Connection=Yes;" +
  `TrustServerCertificate=${process.env.DB_TRUST_CERT};`;

let connection;

async function getConnection() {
  if (!connection) {
    connection = await odbc.connect(connectionString);

    console.log(
      "SQL Server database connected successfully"
    );
  }

  return connection;
}

function formatQuery(sql, parameters = []) {
  let index = 0;

  return sql.replace(/\?/g, () => {
    const value = parameters[index++];

    if (
      value === null ||
      value === undefined
    ) {
      return "NULL";
    }

    if (typeof value === "number") {
      return value;
    }

    return `'${String(value).replace(
      /'/g,
      "''"
    )}'`;
  });
}

async function run(sql, parameters = []) {
  const conn = await getConnection();

  const query = formatQuery(
    sql,
    parameters
  );

  const result = await conn.query(query);

  return {
    changes: result.count || 0,
  };
}

async function all(sql, parameters = []) {
  const conn = await getConnection();

  const query = formatQuery(
    sql,
    parameters
  );

  const result = await conn.query(query);

  return Array.isArray(result)
    ? result
    : [];
}

async function get(sql, parameters = []) {
  const rows = await all(
    sql,
    parameters
  );

  return rows.length
    ? rows[0]
    : null;
}

async function initializeDatabase() {
  try {
    const conn =
      await getConnection();

    await conn.query(`
      IF OBJECT_ID('dbo.Requests', 'U') IS NULL
      BEGIN
        CREATE TABLE Requests (
          id VARCHAR(50) PRIMARY KEY,
          employee VARCHAR(100) NOT NULL,
          department VARCHAR(100),
          category VARCHAR(100) NOT NULL,
          event VARCHAR(255) NOT NULL,
          eventDate DATE NOT NULL,
          venue VARCHAR(255) NOT NULL,
          headcount INT NOT NULL,
          budget DECIMAL(18,2) NOT NULL,
          description NVARCHAR(MAX),
          quarter NVARCHAR(MAX) NOT NULL,
          status VARCHAR(100) NOT NULL,
          managerComments NVARCHAR(MAX),
          gccLeaderComments NVARCHAR(MAX),
          createdDate DATETIME NOT NULL,
          managerActionDate DATETIME NULL,
          gccLeaderActionDate DATETIME NULL
        )
      END
    `);

    console.log(
      "Requests table verified"
    );
  } catch (error) {
    console.error(
      "SQL Server database initialization failed:",
      error.message
    );

    throw error;
  }
}

module.exports = {
  all,
  get,
  run,
  initializeDatabase,
};