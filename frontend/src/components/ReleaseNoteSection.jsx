import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function ReleaseNoteSection({
  title,
  icon: Icon,
  content,
  items = [],
  emphasis = false,
}) {
  const visibleItems = Array.isArray(items) ? items : [];

  if (!content && visibleItems.length === 0) {
    return null;
  }

  return (
    <Paper
      component="section"
      elevation={0}
      className={`release-note-section${emphasis ? " is-emphasis" : ""}`}
    >
      <Box className="release-note-section-heading">
        <span className="release-note-section-icon">
          <Icon fontSize="small" />
        </span>
        <Typography component="h3" className="release-note-section-title">
          {title}
        </Typography>
      </Box>

      {content && (
        <Typography component="p" className="release-note-section-content">
          {content}
        </Typography>
      )}

      {visibleItems.length > 0 && (
        <ul className="release-note-section-list">
          {visibleItems.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </Paper>
  );
}

export default ReleaseNoteSection;
