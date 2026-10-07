const { all, get, run } =
  require("../config/database");

async function getEmployeeProfile(
  req,
  res
) {
  try {
    const profile = await get(
      `
      SELECT
        EmployeeId,
        EmployeeName,
        Designation,
        Email,
        DateOfJoining,
        Organization,
        Gender,
        ProjectTeam,
        GroupName,
        Segment,
        HFMCode,
        INDCostCenter,
        USCostCenter,
        ManagerName,
        NextLevelManager,
        Location,
        CreatedDate,
        ModifiedDate
      FROM EmployeeProfile
      WHERE EmployeeId = ?
      `,
      [req.params.employeeId]
    );

    if (!profile) {
      return res.status(404).json({
        message: "Employee profile not found",
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(
      "Error fetching employee profile:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch employee profile",
    });
  }
}

async function getEmployeeSkills(
  req,
  res
) {
  try {
    const rows = await all(
      `
      SELECT
        es.EmployeeSkillId,
        es.SkillId,
        sm.SkillName,
        sm.Category,
        es.ProficiencyLevel
      FROM EmployeeSkills es
      INNER JOIN SkillsMaster sm
        ON es.SkillId = sm.SkillId
      WHERE es.EmployeeId = ?
      ORDER BY sm.SkillName
      `,
      [req.params.employeeId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to fetch employee skills",
    });
  }
}

async function addEmployeeSkill(
  req,
  res
) {
  try {
    const {
      employeeId,
      skillId,
      proficiencyLevel,
    } = req.body;

    const existing = await get(
      `
      SELECT *
      FROM EmployeeSkills
      WHERE EmployeeId = ?
        AND SkillId = ?
      `,
      [employeeId, skillId]
    );

    if (existing) {
      return res.status(400).json({
        message:
          "Skill already exists for employee",
      });
    }

    await run(
      `
      INSERT INTO EmployeeSkills
      (
        EmployeeId,
        SkillId,
        ProficiencyLevel
      )
      VALUES
      (
        ?, ?, ?
      )
      `,
      [
        employeeId,
        skillId,
        proficiencyLevel,
      ]
    );

    res.status(201).json({
      message:
        "Skill added successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to add skill",
    });
  }
}

async function deleteEmployeeSkill(
  req,
  res
) {
  try {
    await run(
      `
      DELETE FROM EmployeeSkills
      WHERE EmployeeSkillId = ?
      `,
      [req.params.id]
    );

    res.json({
      message:
        "Skill deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to delete skill",
    });
  }
}

async function updateEmployeeSkill(
  req,
  res
) {
  try {
    const {
      proficiencyLevel,
    } = req.body;

    if (
      !proficiencyLevel ||
      proficiencyLevel < 1 ||
      proficiencyLevel > 5
    ) {
      return res.status(400).json({
        message:
          "Proficiency level must be between 1 and 5",
      });
    }

    const existing = await get(
      `
      SELECT *
      FROM EmployeeSkills
      WHERE EmployeeSkillId = ?
      `,
      [req.params.id]
    );

    if (!existing) {
      return res.status(404).json({
        message:
          "Skill not found",
      });
    }

    await run(
      `
      UPDATE EmployeeSkills
      SET ProficiencyLevel = ?
      WHERE EmployeeSkillId = ?
      `,
      [
        proficiencyLevel,
        req.params.id,
      ]
    );

    res.json({
      message:
        "Skill updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Unable to update skill",
    });
  }
}


module.exports = {
  getEmployeeProfile,
  getEmployeeSkills,
  addEmployeeSkill,
  deleteEmployeeSkill,
  updateEmployeeSkill,
};
