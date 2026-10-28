const express = require("express");

const {
  getReleaseNotes,
  addReleaseNote,
    updateReleaseNote,
    deleteReleaseNote,
    togglePublish,
    getLatestPublishedReleaseNote,
    getPublishedReleaseNotes,
} = require("../controllers/releaseNotesController");

const router = express.Router();

router.get(
  "/",
  getReleaseNotes
);

router.post(
  "/",
  addReleaseNote
);

router.get(
  "/published",
  getPublishedReleaseNotes
);

router.put(
  "/:id",
  updateReleaseNote
);

router.delete(
  "/:id",
  deleteReleaseNote
);

router.patch(
  "/:id/publish",
  togglePublish
);

router.get(
  "/latest-published",
  getLatestPublishedReleaseNote
);



module.exports = router;