import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import ReleaseNotePreview
from "./ReleaseNotePreview";
import { getPublishedDate } from "../utils/releaseNoteUtils";

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

      <DialogContent>

        <ReleaseNotePreview
          releaseNote={releaseNote}
          publishedDate={getPublishedDate(releaseNote)}
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