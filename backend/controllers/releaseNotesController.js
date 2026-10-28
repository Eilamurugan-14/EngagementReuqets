const { all, get, run } = require("../config/database");



async function getReleaseNotes(req, res) {
  try {
    

   const rows = await all(`
    SELECT
      ReleaseNoteId,
      Title,
      Version,
      IsPublished,
      PublishedDate,
      CreatedBy,
      CreatedDate,
      Summary,
      ContentJson
    FROM XopsReleaseNotes
    ORDER BY CreatedDate DESC
  `);

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
}



async function addReleaseNote(req, res) {
  try {
    const {
      title,
      version,
      summary,
      contentJson,
    } = req.body;

    await run(
      `
      INSERT INTO XopsReleaseNotes
      (
        Title,
        Version,
        Summary,
        ContentJson,
        CreatedBy
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?
      )
      `,
      [
        title,
        version,
        summary,
        contentJson,
        "Admin"
      ]
    );

    res.status(201).json({
      message:
        "Release note added successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to add release note",
    });
  }
}

async function updateReleaseNote(req, res) {
  try {
    const { id } = req.params;

    const {
      title,
      version,
      summary,
      contentJson,
    } = req.body;

    await run(
      `
      UPDATE XopsReleaseNotes
      SET
        Title = ?,
        Version = ?,
        Summary = ?,
        ContentJson = ?,
        ModifiedBy = ?,
        ModifiedDate = GETDATE()
      WHERE ReleaseNoteId = ?
      `,
      [
        title,
        version,
        summary,
        contentJson,
        "Admin",
        id,
      ]
    );

    res.json({
      message:
        "Release note updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to update release note",
    });
  }
}

async function deleteReleaseNote(req, res) {
  try {
    const { id } = req.params;

    await run(
      `
      DELETE FROM XopsReleaseNotes
      WHERE ReleaseNoteId = ?
      `,
      [id]
    );

    res.json({
      message:
        "Release note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to delete release note",
    });
  }
}

async function togglePublish(req, res) {
  try {
    const { id } = req.params;

    await run(
      `
      UPDATE XopsReleaseNotes
      SET
        IsPublished =
          CASE
            WHEN IsPublished = 1
              THEN 0
            ELSE 1
          END,

        PublishedDate =
          CASE
            WHEN IsPublished = 0
              THEN GETDATE()
            ELSE NULL
          END

      WHERE ReleaseNoteId = ?
      `,
      [id]
    );

    res.json({
      message:
        "Publish status updated",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to update publish status",
    });
  }
}

async function getLatestPublishedReleaseNote(
  req,
  res
) {
  try {

    const rows = await all(`
      SELECT TOP 1
        ReleaseNoteId,
        Title,
        Version,
        Summary,
        ContentJson
      FROM XopsReleaseNotes
      WHERE IsPublished = 1
      ORDER BY ReleaseNoteId DESC
    `);

    res.json(
      rows.length
        ? rows[0]
        : null
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Unable to fetch release note",
    });

  }
}

async function getPublishedReleaseNotes(
  req,
  res
) {
  try {

    const rows = await all(`
      SELECT
        ReleaseNoteId,
        Title,
        Version,
        Summary,
        ContentJson
      FROM XopsReleaseNotes
      WHERE IsPublished = 1
      ORDER BY ReleaseNoteId DESC
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Unable to fetch release notes",
    });

  }
}

module.exports = {
  getReleaseNotes,
  addReleaseNote,
  updateReleaseNote,
  deleteReleaseNote,
  togglePublish,
  getLatestPublishedReleaseNote,
  getPublishedReleaseNotes,
};