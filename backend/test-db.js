const odbc = require("odbc");

(async () => {
  try {
    const connection = await odbc.connect(
  "Driver={ODBC Driver 18 for SQL Server};" +
  "Server=LOB-JH0S6C2\\SQLEXPRESS01;" +
  "Database=EmployeeEngagementRequests;" +
  "Trusted_Connection=Yes;" +
  "TrustServerCertificate=Yes;"
);


   const result = await connection.query(`
SELECT TOP 1 * FROM Requests
`);

console.log(result);

    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();