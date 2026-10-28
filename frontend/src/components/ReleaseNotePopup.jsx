import {
  useEffect,
  useState,
} from "react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import {
  getLatestPublishedReleaseNote,
} from "../services/api";

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

  const content =
    releaseNote?.ContentJson
      ? JSON.parse(
          releaseNote.ContentJson
        )
      : [];

  return (
    <Dialog
      open={open}
      onClose={viewLater}
      maxWidth="md"
      fullWidth
      className="release-preview-dialog"
    >

  <DialogTitle>

  <div className="release-preview-titlebar">

    <div className="release-preview-header">

      <div className="release-preview-badge">
        🚀 What's New
      </div>

      <h2 className="release-preview-title">
        {releaseNote?.Title}
      </h2>

      <div className="release-preview-version">
        Version {releaseNote?.Version}
      </div>

    </div>

    <IconButton
    onClick={acknowledgeRelease}
    aria-label="Close release notes"
    >
      <CloseIcon />
    </IconButton>

  </div>

</DialogTitle>

      <DialogContent>

        <section className="preview-section">

          <h3 className="preview-section-title">
            Summary
          </h3>

          <div className="preview-summary">
            {releaseNote?.Summary}
          </div>

        </section>

        {content.find(
          block =>
            block.type === "features"
        )?.items?.length > 0 && (

          <section className="preview-section">

            <h3 className="preview-section-title">
              ✨ Features
            </h3>

            <div className="preview-list">

              {content
                .find(
                  block =>
                    block.type === "features"
                )
                .items.map(item => (

                  <div
                    key={item}
                    className="preview-list-item"
                  >
                    ✓ {item}
                  </div>

                ))}

            </div>

          </section>

        )}

        {content.find(
          block =>
            block.type === "benefits"
        )?.items?.length > 0 && (

          <section className="preview-section">

            <h3 className="preview-section-title">
              🎯 Benefits
            </h3>

            <div className="preview-list">

              {content
                .find(
                  block =>
                    block.type === "benefits"
                )
                .items.map(item => (

                  <div
                    key={item}
                    className="preview-list-item"
                  >
                    ✓ {item}
                  </div>

                ))}

            </div>

          </section>

        )}

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