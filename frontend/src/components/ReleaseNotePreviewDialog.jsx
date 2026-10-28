import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import ReleaseNotePreview
from "./ReleaseNotePreview";

function ReleaseNotePreviewDialog({
  open,
  releaseNote,
  onClose,
}) {

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="release-preview-dialog"
    >

      <DialogTitle>

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

      </DialogTitle>

      <DialogContent>

        <ReleaseNotePreview
          releaseNote={releaseNote}
        />

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  );
}

export default ReleaseNotePreviewDialog;