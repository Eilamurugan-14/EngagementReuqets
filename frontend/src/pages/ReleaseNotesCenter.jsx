import { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
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

function formatPublishedDate(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

function getMonthLabel(date) {
  if (date === "Date unavailable") {
    return date;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function getDateTimeAttribute(date) {
  const timestamp = Date.parse(date);

  return Number.isNaN(timestamp)
    ? undefined
    : new Date(timestamp).toISOString().slice(0, 10);
}

function groupReleaseNotesByMonth(notes) {
  const months = new Map();

  notes.forEach((note) => {
    const publishedDate = getPublishedDate(note);
    const date = publishedDate === "-"
      ? "Date unavailable"
      : publishedDate;
    const month = getMonthLabel(date);
    const monthGroup = months.get(month) || new Map();
    const dateGroup = monthGroup.get(date) || [];

    dateGroup.push(note);
    monthGroup.set(date, dateGroup);
    months.set(month, monthGroup);
  });

  return Array.from(months, ([month, dateGroups]) => ({
    month,
    count: Array.from(dateGroups.values())
      .reduce((total, dateNotes) => total + dateNotes.length, 0),
    dates: Array.from(dateGroups, ([date, dateNotes]) => ({
      date,
      notes: dateNotes,
    })),
  }));
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
        borderColor: "#dce6ee",
        borderRadius: 2.5,
        backgroundColor: "#fff",
        boxShadow: "0 3px 12px rgba(20, 53, 78, 0.055)",
        transition:
          "transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "#b6d6e5",
          boxShadow: "0 6px 18px rgba(15, 66, 104, 0.09)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          columnGap: 1,
          rowGap: 0.75,
        }}
      >
        <Typography
          component="h2"
          variant="subtitle1"
          sx={{
            flex: "0 1 auto",
            color: "#20374c",
            fontSize: { xs: "1rem", sm: "1.1rem" },
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
            gap: 0.6,
          }}
        >
          <Chip
            size="small"
            label={`Version ${note.Version || "—"}`}
            sx={{
              height: 26,
              borderRadius: 999,
              backgroundColor: "#e5f6fb",
              color: "#087da3",
              fontSize: "0.75rem",
              fontWeight: 700,
              "& .MuiChip-label": { px: 1 },
            }}
          />
          {releaseType !== "-" && (
            <Chip
              size="small"
              label={releaseType}
              sx={{
                height: 26,
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: 650,
                ...releaseTypeStyle,
                "& .MuiChip-label": { px: 1 },
              }}
            />
          )}
        </Box>
      </Box>

      <Typography
        sx={{
          mt: 1,
          color: "#63788c",
          lineHeight: 1.55,
          fontSize: "0.9rem",
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
          variant="contained"
          onClick={() => onReadMore(note)}
          sx={{
            minHeight: 36,
            px: 2,
            borderRadius: 1.5,
            backgroundColor: "#078bb2",
            boxShadow: "none",
            fontSize: "0.85rem",
            fontWeight: 650,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#087da3",
              boxShadow: "none",
            },
          }}
        >
          Read More&nbsp; →
        </Button>
        <ReleaseNoteDemoAction releaseNote={note} compact />
      </Box>
    </Paper>
  );
}

function ReleaseDateGroup({ date, notes, onReadMore, latestId }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "78px 22px minmax(0, 1fr)",
          sm: "128px 28px minmax(0, 1fr)",
        },
        columnGap: { xs: 0.75, sm: 1.25 },
        alignItems: "stretch",
        mb: 1.25,
      }}
    >
      <Box sx={{
        gridColumn: 1,
        gridRow: `1 / span ${notes.length}`,
        pt: 1.25,
        pr: 0.25,
        textAlign: "right",
      }}>
        <Typography
          component="time"
          dateTime={getDateTimeAttribute(date)}
          sx={{
            color: "#29445a",
            fontSize: { xs: "0.68rem", sm: "0.78rem" },
            fontWeight: 700,
            letterSpacing: "0.045em",
            whiteSpace: "nowrap",
          }}
        >
          {formatPublishedDate(date)}
        </Typography>
        {notes[0]?.ReleaseNoteId === latestId && (
          <Typography
            component="div"
            sx={{
              display: "inline-block",
              mt: 0.6,
              px: 0.75,
              py: 0.15,
              borderRadius: 0.75,
              backgroundColor: "#e3f7fc",
              color: "#087da3",
              fontSize: "0.68rem",
              fontWeight: 700,
            }}
          >
            Latest
          </Typography>
        )}
      </Box>

      {notes.map((note, index) => {
        const gridRow = index + 1;

        return (
          <Fragment key={note.ReleaseNoteId}>
            <Box
              aria-hidden="true"
              sx={{
                gridColumn: 2,
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
                  top: 14,
                  left: "50%",
                  width: 12,
                  height: 12,
                  border: "2px solid #fff",
                  borderRadius: "50%",
                  backgroundColor: "#078bb2",
                  boxShadow: "0 0 0 2px #b9e2ef",
                  transform: "translateX(-50%)",
                }}
              />
            </Box>
            <Box
              sx={{
                gridColumn: 3,
                gridRow,
                minWidth: 0,
                pb: 1.25,
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

function ReleaseMonthGroup({ group, onReadMore, latestId }) {
  return (
    <Box sx={{ mb: 2.75 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          mb: 1.25,
          borderBottom: "1px solid #dce5eb",
        }}
      >
        <Typography
          component="h2"
          sx={{
            color: "#29445a",
            fontSize: "1rem",
            fontWeight: 700,
          }}
        >
          {group.month}
        </Typography>
        <Typography
          sx={{ color: "#8495a4", fontSize: "0.78rem" }}
        >
          {group.count} {group.count === 1 ? "release" : "releases"}
        </Typography>
      </Box>
      <Box
        sx={{
          position: "relative",
          "&::before": {
            position: "absolute",
            top: 12,
            bottom: 12,
            left: { xs: 95, sm: 152 },
            width: "2px",
            borderRadius: 2,
            backgroundColor: "#dceaf1",
            content: '""',
          },
        }}
      >
        {group.dates.map((dateGroup) => (
          <ReleaseDateGroup
            key={dateGroup.date}
            date={dateGroup.date}
            notes={dateGroup.notes}
            onReadMore={onReadMore}
            latestId={latestId}
          />
        ))}
      </Box>
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
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

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
  const groupedReleaseNotes =
    groupReleaseNotesByMonth(filteredReleaseNotes);
  const latestReleaseNoteId =
    filteredReleaseNotes[0]?.ReleaseNoteId;

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
        pt: { xs: 2, sm: 3 },
        pb: 4,
        backgroundColor: "#f3f6f8",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto" }}>
        <Box
          sx={{
            mb: 3,
            p: { xs: 2, sm: 2.5 },
            border: "1px solid #dce8f0",
            borderTop: "2px solid #079bc8",
            borderRadius: 2.25,
            backgroundColor: "#fff",
            boxShadow: "0 3px 12px rgba(32, 71, 98, 0.055)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.25, sm: 2 },
            }}
          >
            <Box>
              <Typography
                id="release-notes-center-heading"
                component="h1"
                sx={{
                  color: "#24394b",
                  fontSize: { xs: "1.4rem", sm: "1.55rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                Release Notes
              </Typography>
              <Typography
                sx={{
                  mt: 0.5,
                  color: "#728496",
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                }}
              >
                Stay up to date with the latest xOps enhancements, features, and
                improvements.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                flex: { sm: "0 1 400px" },
              }}
            >
              <TextField
                fullWidth
                size="small"
                aria-label="Search release notes"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search release notes"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#71879a", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  "& .MuiOutlinedInput-input": {
                    py: 1,
                    fontSize: "0.85rem",
                  },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    backgroundColor: "#f7f9fb",
                    "& fieldset": { borderColor: "#dce6ed" },
                    "&:hover fieldset": { borderColor: "#9cc9d8" },
                    "&.Mui-focused fieldset": { borderColor: "#079bc8" },
                  },
                }}
              />
              <Button
                id="release-type-filter-button"
                aria-controls={
                  filterMenuAnchor ? "release-type-filter-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={filterMenuAnchor ? "true" : undefined}
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={(event) => setFilterMenuAnchor(event.currentTarget)}
                sx={{
                  minHeight: 40,
                  flexShrink: 0,
                  borderColor: "#dce6ed",
                  borderRadius: 1.5,
                  color: "#486176",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#9cc9d8",
                    backgroundColor: "#f7f9fb",
                  },
                }}
              >
                Filter
              </Button>
              <Menu
                id="release-type-filter-menu"
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={() => setFilterMenuAnchor(null)}
                slotProps={{
                  list: {
                    "aria-labelledby": "release-type-filter-button",
                  },
                }}
              >
                {releaseTypeFilters.map((filter) => (
                  <MenuItem
                    key={filter.value}
                    selected={selectedReleaseType === filter.value}
                    onClick={() => {
                      setSelectedReleaseType(filter.value);
                      setFilterMenuAnchor(null);
                    }}
                  >
                    {filter.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
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
              pt: 0.25,
            }}
          >
            {groupedReleaseNotes.map((group) => (
              <ReleaseMonthGroup
                key={group.month}
                group={group}
                onReadMore={openPreview}
                latestId={latestReleaseNoteId}
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
