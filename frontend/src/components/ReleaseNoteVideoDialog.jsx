import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

function ReleaseNoteVideoDialog({
  open,
  onClose,
  videoUrl,
  title,
}) {
  const dialogTitle = title ? `${title} Demo` : "Release Demo";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="release-note-video-dialog-title"
    >
      <DialogTitle
        id="release-note-video-dialog-title"
        sx={{ pr: 6 }}
      >
        {dialogTitle}
      </DialogTitle>
      <IconButton
        aria-label="Close demo video"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: { xs: 1, sm: 2 } }}>
        <video
          src={videoUrl}
          controls
          autoPlay={false}
          playsInline
          preload="metadata"
          aria-label={`${dialogTitle} video`}
          style={{
            display: "block",
            width: "100%",
            maxHeight: "70vh",
            aspectRatio: "16 / 9",
            objectFit: "contain",
            backgroundColor: "#000",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ReleaseNoteVideoDialog;
