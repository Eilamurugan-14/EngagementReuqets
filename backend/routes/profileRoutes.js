const express = require("express");

const router = express.Router();

const {
  getEmployeeSkills,
  addEmployeeSkill,
  deleteEmployeeSkill,
} = require(
  "../controllers/profileController"
);

router.get(
  "/skills/:employeeId",
  getEmployeeSkills
);

router.post(
  "/skills",
  addEmployeeSkill
);

router.delete(
  "/skills/:id",
  deleteEmployeeSkill
);

module.exports = router;