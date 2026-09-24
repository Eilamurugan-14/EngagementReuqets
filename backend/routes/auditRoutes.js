const express = require("express");

const router = express.Router();

const {
  getAuditHistory,
} = require("../controllers/auditController");

router.get("/:id", getAuditHistory);

module.exports = router;

