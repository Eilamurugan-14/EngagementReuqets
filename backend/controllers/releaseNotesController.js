const { all, get, run } = require("../config/database");
const { isDeleteLocked } = require("../utils/releaseNoteRetention");



async function getReleaseNotes(req, res) {
  try {
    

   const rows = await all(`
    SELECT
      ReleaseNoteId,
      Title,
      Version,
      IsPublished,
      CreatedBy,
      Summary,
      ContentJson
    FROM XopsReleaseNotes
    ORDER BY ReleaseNoteId DESC
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

    const note = await get(
      `
      SELECT
        IsPublished,
        ContentJson
      FROM XopsReleaseNotes
      WHERE ReleaseNoteId = ?
      `,
      [id]
    );

    if (!note) {
      return res.status(404).json({
        message: "Release note not found",
      });
    }

    if (isDeleteLocked(note)) {
      return res.status(403).json({
        message:
          "Published release notes older than 7 days cannot be deleted.",
      });
    }

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

    const note = await get(
      `
      SELECT
        IsPublished,
        ContentJson
      FROM XopsReleaseNotes
      WHERE ReleaseNoteId = ?
      `,
      [id]
    );
    console.log(
  "IsPublished:",
  note.IsPublished,
  typeof note.IsPublished
);
    let content = [];

    try {
      content = note?.ContentJson
        ? JSON.parse(note.ContentJson)
        : [];
    } catch {
      content = [];
    }

    if (Number(note.IsPublished) === 0) {

      const publishedDate =
        new Date().toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

      const existingBlockIndex =
        content.findIndex(
          block =>
            block.type ===
            "publishedInfo"
        );

      if (existingBlockIndex >= 0) {

        content[
          existingBlockIndex
        ].value =
          publishedDate;

      } else {

        content.unshift({
          type: "publishedInfo",
          value: publishedDate,
        });

      }
      console.log(
  "Updated ContentJson:",
  JSON.stringify(
    content,
    null,
    2
  )
);


      await run(
        `
        UPDATE XopsReleaseNotes
        SET
          ContentJson = ?
        WHERE ReleaseNoteId = ?
        `,
        [
          JSON.stringify(content),
          id,
        ]
      );
    }

    await run(
      `
      UPDATE XopsReleaseNotes
      SET
        IsPublished =
          CASE
            WHEN IsPublished = 1
              THEN 0
            ELSE 1
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