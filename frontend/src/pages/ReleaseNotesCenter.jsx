import { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getPublishedReleaseNotes } from "../services/api";
import {
  getPublishedDate,
  getReleaseType,
} from "../utils/releaseNoteUtils";
import ReleaseNoteDemoAction from "../components/ReleaseNoteDemoAction";
import ReleaseNotePreviewDialog from "../components/ReleaseNotePreviewDialog";

const releaseTypeStyles = {
  "Major Release": {
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
  },
  "Minor Release": {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  },
  Hotfix: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
  },
  Announcement: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
};

const releaseTypeFilters = [
  { label: "All", value: "All" },
  { label: "Major Releases", value: "Major Release" },
  { label: "Minor Releases", value: "Minor Release" },
  { label: "Announcements", value: "Announcement" },
  { label: "Hotfixes", value: "Hotfix" },
];

function getPublishedTimestamp(note) {
  const timestamp = Date.parse(getPublishedDate(note));

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function ReleaseTimelineItem({ note, onReadMore }) {
  const releaseType = getReleaseType(note);
  const releaseTypeStyle =
    releaseTypeStyles[releaseType] || {
      backgroundColor: "#eef2f6",
      color: "#475569",
    };

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderColor: "#e2e8f0",
        borderRadius: 2.5,
        backgroundColor: "#fff",
        boxShadow: "0 4px 14px rgba(15, 23, 42, 0.045)",
        transition:
          "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "#b7d4e0",
          boxShadow: "0 10px 24px rgba(15, 66, 104, 0.09)",
        },
      }}
    >
      <Typography
        component="h2"
        variant="h6"
        sx={{
          color: "#172b3a",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
        }}
      >
        {note.Title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.75,
          mt: 1.25,
        }}
      >
        <Chip
          size="small"
          label={`Version ${note.Version || "—"}`}
          sx={{
            height: 25,
            borderRadius: 999,
            backgroundColor: "#e0f2fe",
            color: "#075985",
            fontWeight: 700,
            "& .MuiChip-label": { px: 1.25 },
          }}
        />
        {releaseType !== "-" && (
          <Chip
            size="small"
            label={releaseType}
            sx={{
              height: 25,
              borderRadius: 999,
              fontWeight: 650,
              ...releaseTypeStyle,
              "& .MuiChip-label": { px: 1.25 },
            }}
          />
        )}
      </Box>

      <Typography
        sx={{
          mt: 1.5,
          color: "#475569",
          lineHeight: 1.6,
          fontSize: "0.95rem",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
        }}
      >
        {note.Summary || "No summary provided."}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => onReadMore(note)}
          sx={{
            minHeight: 36,
            borderRadius: 1.75,
            borderColor: "#087da3",
            color: "#087da3",
            fontWeight: 650,
            textTransform: "none",
            "&:hover": {
              borderColor: "#075985",
              backgroundColor: "#f0f9ff",
            },
          }}
        >
          Read More
        </Button>
        <ReleaseNoteDemoAction releaseNote={note} />
      </Box>
    </Paper>
  );
}

function ReleaseDateGroup({ date, notes, onReadMore }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "20px minmax(0, 1fr)",
          md: "150px 28px minmax(0, 1fr)",
        },
        columnGap: { xs: 1.25, md: 2 },
        alignItems: "stretch",
        mb: { xs: 1.5, md: 2 },
      }}
    >
      <Box
        sx={{
          gridColumn: { xs: 2, md: 1 },
          gridRow: { xs: 1, md: `1 / span ${notes.length}` },
          pt: { xs: 0.25, md: 1.5 },
          pb: 1,
          pr: { md: 1 },
          textAlign: { xs: "left", md: "right" },
        }}
      >
        <Typography
          component="h2"
          variant="overline"
          sx={{
            color: "#64748b",
            fontSize: "0.72rem",
            fontWeight: 750,
            letterSpacing: "0.09em",
            lineHeight: 1.4,
            whiteSpace: { md: "nowrap" },
          }}
        >
          {date.toUpperCase()}
        </Typography>
      </Box>

      {notes.map((note, index) => {
        const gridRow = {
          xs: index + 2,
          md: index + 1,
        };

        return (
          <Fragment key={note.ReleaseNoteId}>
            <Box
              aria-hidden="true"
              sx={{
                gridColumn: { xs: 1, md: 2 },
                gridRow,
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  top: 16,
                  left: "50%",
                  width: 12,
                  height: 12,
                  border: "3px solid #e8f3f7",
                  borderRadius: "50%",
                  backgroundColor: "#087da3",
                  boxShadow: "0 0 0 1px #8dbdce",
                  transform: "translateX(-50%)",
                }}
              />
            </Box>
            <Box
              sx={{
                gridColumn: { xs: 2, md: 3 },
                gridRow,
                minWidth: 0,
                pb: { xs: 2, md: 2.5 },
              }}
            >
              <ReleaseTimelineItem
                note={note}
                onReadMore={onReadMore}
              />
            </Box>
          </Fragment>
        );
      })}
    </Box>
  );
}

function ReleaseNotesCenter() {
  const [releaseNotes, setReleaseNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReleaseType, setSelectedReleaseType] =
    useState("All");
  const [selectedReleaseNote, setSelectedReleaseNote] =
    useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReleaseNotes() {
      try {
        const notes = await getPublishedReleaseNotes();

        if (!Array.isArray(notes)) {
          throw new Error("Published release notes response is invalid.");
        }

        if (active) {
          setReleaseNotes(notes);
          setError("");
        }
      } catch (loadError) {
        console.error(loadError);

        if (active) {
          setError("Unable to load published release notes.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadReleaseNotes();

    return () => {
      active = false;
    };
  }, []);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const searchedReleaseNotes = [...releaseNotes]
    .sort(
      (first, second) =>
        getPublishedTimestamp(second) - getPublishedTimestamp(first)
    )
    .filter((note) => {
    const searchableText = [
      note.Title,
      note.Version,
      note.Summary,
    ].join(" ").toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
    });
  const filteredReleaseNotes = searchedReleaseNotes.filter(
    (note) =>
      selectedReleaseType === "All" ||
      getReleaseType(note) === selectedReleaseType
  );
  const dateGroups = new Map();

  filteredReleaseNotes.forEach((note) => {
    const publishedDate = getPublishedDate(note);
    const date = publishedDate === "-"
      ? "Date unavailable"
      : publishedDate;
    const notesForDate = dateGroups.get(date) || [];

    notesForDate.push(note);
    dateGroups.set(date, notesForDate);
  });

  const groupedReleaseNotes = Array.from(
    dateGroups,
    ([date, notes]) => ({ date, notes })
  );

  function openPreview(note) {
    setSelectedReleaseNote(note);
    setPreviewOpen(true);
  }

  function closePreview() {
    setPreviewOpen(false);
  }

  return (
    <Box
      component="section"
      aria-labelledby="release-notes-center-heading"
      sx={{
        minHeight: "calc(100vh - 60px)",
        px: { xs: 2, sm: 3, lg: 4 },
        py: { xs: 1.5, md: 2 },
        background:
          "linear-gradient(180deg, #f8fafc 0%, #f1f6fa 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            mb: { xs: 1.5, md: 2 },
            p: { xs: 1.75, sm: 2, md: 2.25 },
            border: "1px solid #e2e8f0",
            borderRadius: 2.5,
            backgroundColor: "#fff",
            boxShadow: "0 3px 12px rgba(15, 23, 42, 0.045)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1.5, md: 3 },
            }}
          >
            <Box>
              <Typography
                id="release-notes-center-heading"
                component="h1"
                sx={{
                  color: "#172b3a",
                  fontSize: { xs: "1.45rem", sm: "1.7rem" },
                  fontWeight: 750,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                <span aria-hidden="true">🚀 </span>
                Release Notes
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#64748b",
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                Stay up to date with the latest xOps enhancements, features, and
                improvements.
              </Typography>
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Search release notes"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              sx={{
                flex: { md: "0 1 340px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1.75,
                  backgroundColor: "#f8fafc",
                  "& fieldset": { borderColor: "#dbe4ec" },
                  "&:hover fieldset": { borderColor: "#9cc9d8" },
                  "&.Mui-focused fieldset": { borderColor: "#087da3" },
                },
              }}
            />
          </Box>

          <Box
            component="nav"
            aria-label="Filter release notes by type"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mt: { xs: 1.5, md: 1.75 },
            }}
          >
            {releaseTypeFilters.map((filter) => {
              const isSelected =
                selectedReleaseType === filter.value;

              return (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  clickable
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedReleaseType(filter.value)
                  }
                  sx={{
                    height: 30,
                    borderRadius: 999,
                    border: "1px solid",
                    borderColor: isSelected ? "#087da3" : "#dbe4ec",
                    backgroundColor: isSelected ? "#e8f5f9" : "#fff",
                    color: isSelected ? "#075985" : "#52616b",
                    fontSize: "0.8rem",
                    fontWeight: isSelected ? 700 : 550,
                    "&:hover": {
                      backgroundColor: isSelected ? "#dff0f5" : "#f8fafc",
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Typography role="status" sx={{ color: "#64748b" }}>
            Loading release notes...
          </Typography>
        ) : !error && filteredReleaseNotes.length === 0 ? (
          <Typography sx={{ color: "#64748b" }}>
            {releaseNotes.length === 0
              ? "No published release notes yet."
              : "No release notes match the selected filters."}
          </Typography>
        ) : !error && (
          <Box
            sx={{
              position: "relative",
              pt: 1,
              "&::before": {
                position: "absolute",
                top: { xs: 32, md: 22 },
                bottom: 0,
                left: { xs: "10px", md: "180px" },
                width: "2px",
                backgroundColor: "#d8e4eb",
                content: '""',
              },
            }}
          >
            {groupedReleaseNotes.map((group) => (
              <ReleaseDateGroup
                key={group.date}
                date={group.date}
                notes={group.notes}
                onReadMore={openPreview}
              />
            ))}
          </Box>
        )}

        <ReleaseNotePreviewDialog
          open={previewOpen}
          releaseNote={selectedReleaseNote}
          onClose={closePreview}
        />
      </Box>
    </Box>
  );
}

export default ReleaseNotesCenter;
