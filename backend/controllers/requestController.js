const { all, get, run } = require("../config/database");

function parseQuarter(value) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
}

function mapRequest(row) {
  return {
    id: row.Id,
    employee: row.EmployeeName,
    department: row.Department || "Unassigned",
    category: row.Category,
    event: row.EventTitle,
    title: row.EventTitle,
    eventDate: row.EventDate,
    venue: row.Venue,
    headcount: row.Headcount,
    budget: row.Budget,
    description: row.Description || "",
    quarter: parseQuarter(row.Quarter),
    status: row.Status,
    managerComments: row.ManagerComments || "",
    gccLeaderComments: row.GCCLeaderComments || "",
    actionDate: row.ManagerActionDate || null,
    gccLeaderActionDate: row.GCCLeaderActionDate || null,
    createdDate: row.CreatedDate,
  };
}

function quarterValue(value) {
  return JSON.stringify(
    Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
  );
}

async function getRequests(req, res) {
  try {
    const rows = await all(`
      SELECT *
      FROM Requests
      ORDER BY CreatedDate DESC, Id DESC
    `);

    res.json(rows.map(mapRequest));
  } catch (error) {
    console.error(
      "Database error while fetching requests:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch requests",
    });
  }
}

async function createRequest(req, res) {
  try {
    const body = req.body;

    const latest = await get(`
      SELECT TOP 1 Id
      FROM Requests
      ORDER BY CAST(REPLACE(Id,'ENG-','') AS INT) DESC
    `);

    const nextNumber =
      (latest
        ? Number(
            latest.Id.replace(
              "ENG-",
              ""
            )
          )
        : 0) + 1;

    const id = `ENG-${String(
      nextNumber
    ).padStart(3, "0")}`;

    await run(
      `
      INSERT INTO Requests
      (
        Id,
        EmployeeName,
        Department,
        Category,
        EventTitle,
        EventDate,
        Venue,
        Headcount,
        Budget,
        Description,
        Quarter,
        Status,
        CreatedDate
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        id,
        body.employee?.trim(),
        body.department ||
          "Unassigned",
        body.category,
        body.event ||
          body.title ||
          "Untitled Request",
        body.eventDate,
        body.venue?.trim(),
        Number(body.headcount),
        Number(body.budget),
        body.description || "",
        quarterValue(body.quarter),
        "Pending Manager",
        new Date().toISOString(),
      ]
    );

    const created = await get(
      `
      SELECT *
      FROM Requests
      WHERE Id = ?
      `,
      [id]
    );

    res.status(201).json(
      mapRequest(created)
    );
  } catch (error) {
    console.error(
      "Database error while creating request:",
      error
    );

    res.status(500).json({
      message: "Unable to create request",
    });
  }
}

async function updateRequest(req, res) {
  try {
    const body = req.body;
    const id = req.params.id;

    const current = await get(
      `
      SELECT *
      FROM Requests
      WHERE Id = ?
      `,
      [id]
    );

    if (!current) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const values = {
      employee:
        body.employee ??
        current.EmployeeName,

      department:
        body.department ??
        current.Department,

      category:
        body.category ??
        current.Category,

      event:
        body.event ??
        current.EventTitle,

      eventDate:
        body.eventDate ??
        current.EventDate,

      venue:
        body.venue ??
        current.Venue,

      headcount:
        body.headcount !== undefined
          ? Number(body.headcount)
          : current.Headcount,

      budget:
        body.budget !== undefined
          ? Number(body.budget)
          : current.Budget,

      description:
        body.description ??
        current.Description,

      quarter:
        body.quarter !== undefined
          ? quarterValue(body.quarter)
          : current.Quarter,

      status:
        body.status ??
        current.Status,

      managerComments:
        body.managerComments ??
        current.ManagerComments,

      gccLeaderComments:
        body.gccLeaderComments ??
        current.GCCLeaderComments,

      managerActionDate:
        body.managerComments !==
        undefined
          ? body.actionDate ||
            new Date()
              .toISOString()
              .slice(0, 10)
          : current.ManagerActionDate,

      gccLeaderActionDate:
        body.gccLeaderComments !==
        undefined
          ? body.gccLeaderActionDate ||
            new Date()
              .toISOString()
              .slice(0, 10)
          : current.GCCLeaderActionDate,
    };

    await run(
      `
      UPDATE Requests
      SET
        EmployeeName = ?,
        Department = ?,
        Category = ?,
        EventTitle = ?,
        EventDate = ?,
        Venue = ?,
        Headcount = ?,
        Budget = ?,
        Description = ?,
        Quarter = ?,
        Status = ?,
        ManagerComments = ?,
        GCCLeaderComments = ?,
        ManagerActionDate = ?,
        GCCLeaderActionDate = ?
      WHERE Id = ?
      `,
      [
        values.employee,
        values.department,
        values.category,
        values.event,
        values.eventDate,
        values.venue,
        values.headcount,
        values.budget,
        values.description,
        values.quarter,
        values.status,
        values.managerComments,
        values.gccLeaderComments,
        values.managerActionDate,
        values.gccLeaderActionDate,
        id,
      ]
    );

    const updated = await get(
      `
      SELECT *
      FROM Requests
      WHERE Id = ?
      `,
      [id]
    );

    res.json(
      mapRequest(updated)
    );
  } catch (error) {
    console.error(
      "Database error while updating request:",
      error
    );

    res.status(500).json({
      message: "Unable to update request",
    });
  }
}

async function deleteRequest(req, res) {
  try {
    const result = await run(
      `
      DELETE FROM Requests
      WHERE Id = ?
      `,
      [req.params.id]
    );

    if (!result.changes) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.json({
      message:
        "Request deleted successfully",
    });
  } catch (error) {
    console.error(
      "Database error while deleting request:",
      error
    );

    res.status(500).json({
      message: "Unable to delete request",
    });
  }
}

module.exports = {
  getRequests,
  createRequest,
  updateRequest,
  deleteRequest,
};