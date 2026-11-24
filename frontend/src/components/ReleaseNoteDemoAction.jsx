import { useState } from "react";
import Button from "@mui/material/Button";
import { getReleaseDemoVideoUrl } from "../config/releaseDemoVideos";
import ReleaseNoteVideoDialog from "./ReleaseNoteVideoDialog";

function ReleaseNoteDemoAction({ releaseNote, compact = false }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoUrl = getReleaseDemoVideoUrl(releaseNote?.Title);

  if (!videoUrl) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setVideoOpen(true)}
        variant="outlined"
        size="small"
        sx={{
          marginRight: "auto",
          borderColor: "#007da3",
          color: "#007da3",
          fontWeight: 650,
          textTransform: "none",
          ...(compact && {
            minHeight: 36,
            px: 1.75,
            borderRadius: 1.5,
            fontSize: "0.85rem",
          }),
          "&:hover": {
            borderColor: "#006987",
            backgroundColor: "rgba(0, 125, 163, 0.08)",
          },
        }}
      >
        Watch Demo
      </Button>
      <ReleaseNoteVideoDialog
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl={videoUrl}
        title={releaseNote?.Title}
      />
    </>
  );
}

export default ReleaseNoteDemoAction;
