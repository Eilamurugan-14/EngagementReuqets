const { run } = require("../config/database");

async function logAudit({
  requestId,
  oldStatus,
  newStatus,
  comments,
  actionBy,
}) {
  await run(
    `
    INSERT INTO RequestAudit
    (
      RequestId,
      OldStatus,
      NewStatus,
      Comments,
      ActionBy,
      ActionDate
    )
    VALUES
    (
      ?, ?, ?, ?, ?, ?
    )
    `,
    [
      requestId,
      oldStatus,
      newStatus,
      comments || "",
      actionBy,
      new Date().toLocaleString("sv-SE", {
  timeZone: "Asia/Kolkata",
}),
    ]
  );
}

module.exports = {
  logAudit,
};