const { all } = require("../config/database");

async function getAuditHistory(req, res) {
  try {
    

   const rows = await all(
        `
        SELECT
            AuditId,
            RequestId,
            OldStatus,
            NewStatus,
            CAST(Comments AS NVARCHAR(500)) AS Comments,
            ActionBy,
            ActionDate
        FROM RequestAudit
        WHERE RequestId = ?
        ORDER BY ActionDate DESC, AuditId DESC
        `,
        [req.params.id]
);

    res.json(rows);
  } catch (error) {
    console.error("AUDIT ERROR:");
    console.error(error);
    console.error(error.message);

    res.status(500).json({
      message: "Unable to fetch audit history",
    });
  }
}
module.exports = {
  getAuditHistory,
};
