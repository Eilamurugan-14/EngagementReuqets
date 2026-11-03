import {
  useEffect,
  useState,
} from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import {
  getLatestPublishedReleaseNote,
} from "../services/api";

import ReleaseNotePreview
from "./ReleaseNotePreview";
import { getPublishedDate } from "../utils/releaseNoteUtils";

function ReleaseNotePopup() {

  const [open, setOpen] =
    useState(false);

  const [releaseNote, setReleaseNote] =
    useState(null);



  async function loadLatestReleaseNote() {

    try {

      const note =
        await getLatestPublishedReleaseNote();

      if (!note) {
        return;
      }

      const storageKey =
        `release_note_${note.ReleaseNoteId}`;

      const alreadySeen =
        localStorage.getItem(
          storageKey
        );

      if (!alreadySeen) {

        setReleaseNote(note);

        setOpen(true);

      }

    } catch (error) {

      console.error(error);

    }
  }

    useEffect(() => {
    console.log("ReleaseNotePopup mounted");
    loadLatestReleaseNote();

  }, []);

 function acknowledgeRelease() {

  if (releaseNote) {

    localStorage.setItem(
      `release_note_${releaseNote.ReleaseNoteId}`,
      "seen"
    );

  }

  setOpen(false);
}

function viewLater() {
  setOpen(false);
}

  const publishedDate =
    getPublishedDate(releaseNote);

  return (
    <Dialog
      open={open}
      onClose={viewLater}
      maxWidth="md"
      fullWidth
      className="release-preview-dialog"
    >

<DialogContent>

  <ReleaseNotePreview
    releaseNote={releaseNote}
    publishedDate={publishedDate}
    onClose={acknowledgeRelease}
  />

</DialogContent>


     <DialogActions>

        <Button
            onClick={viewLater}
            className="release-note-view-later"
        >
            View Later
        </Button>

        </DialogActions>

    </Dialog>
  );
}

export default ReleaseNotePopup;