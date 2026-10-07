const express = require("express");

const router = express.Router();

const {
  getEmployeeProfile,
  getEmployeeSkills,
  addEmployeeSkill,
  deleteEmployeeSkill,
  updateEmployeeSkill,
} = require(
  "../controllers/profileController"
);

router.get(
  "/:employeeId",
  getEmployeeProfile
);

router.get(
  "/skills/:employeeId",
  getEmployeeSkills
);

router.post(
  "/skills",
  addEmployeeSkill
);

router.put(
  "/skills/:id",
  updateEmployeeSkill
);

router.delete(
  "/skills/:id",
  deleteEmployeeSkill
);

module.exports = router;