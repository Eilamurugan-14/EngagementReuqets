const { all } = require("../config/database");

async function getSkills(req, res) {
  try {
    const rows = await all(`
      SELECT
        SkillId,
        SkillName,
        Category
      FROM SkillsMaster
      WHERE IsActive = 1
      ORDER BY SkillName
    `);

    res.json(rows);
  } catch (error) {
    console.error(
      "Error fetching skills:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch skills",
    });
  }
}

module.exports = {
  getSkills,
};