import "../styles/ReleaseNotesAdmin.css";

import { useEffect, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import ReleaseNotesGrid from "../components/grids/ReleaseNotesGrid";

import {
  getReleaseNotes,
  addReleaseNote,
  updateReleaseNote,
  deleteReleaseNote,
  togglePublish,
} from "../services/api";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import MenuItem from "@mui/material/MenuItem";

import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

function ReleaseNotesAdmin() {
  const [releaseNotes, setReleaseNotes] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState(0);

  const [searchTerm, setSearchTerm] =
  useState("");

  const [addDialogOpen, setAddDialogOpen] =
  useState(false);

  const [title, setTitle] =
  useState("");

  const [version, setVersion] =
  useState("");

  const [releaseType, setReleaseType] =
  useState("Major Release");

  const [audience, setAudience] =
  useState("All Employees");

  const [summary, setSummary] =
  useState("");

  const [features, setFeatures] =
  useState("");

  const [benefits, setBenefits] =
  useState("");

  const [improvements, setImprovements] =
  useState("");

  const [knownIssues, setKnownIssues] =
  useState("");

  const [actionRequired, setActionRequired] =
  useState("");

  const [editingNote, setEditingNote] =
  useState(null);

  const [dialogMode, setDialogMode] =
  useState("add");

  const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

  const [noteToDelete, setNoteToDelete] =
  useState(null);

  const [viewDialogOpen, setViewDialogOpen] =
  useState(false);

  const [selectedNote, setSelectedNote] =
  useState(null);

  const [previewOpen, setPreviewOpen] =
  useState(false);


function handleEdit(note) {

  setDialogMode("edit");
  setEditingNote(note);

  setTitle(note.Title || "");
  setVersion(note.Version || "");
  setSummary(note.Summary || "");

  const parsedContent =
    note.ContentJson
      ? JSON.parse(
          note.ContentJson
        )
      : [];

  const featuresBlock =
    parsedContent.find(
      block =>
        block.type === "features"
    );

  const benefitsBlock =
    parsedContent.find(
      block =>
        block.type === "benefits"
    );

  const improvementsBlock =
    parsedContent.find(
      block =>
        block.type ===
        "improvements"
    );

  const knownIssuesBlock =
    parsedContent.find(
      block =>
        block.type ===
        "knownIssues"
    );

  const actionRequiredBlock =
    parsedContent.find(
      block =>
        block.type ===
        "actionRequired"
    );

  const releaseTypeBlock =
  parsedContent.find(
    block =>
      block.type === "releaseType"
  );

const audienceBlock =
  parsedContent.find(
    block =>
      block.type === "audience"
  );

  setFeatures(
    featuresBlock?.items?.join("\n")
      || ""
  );

  setBenefits(
    benefitsBlock?.items?.join("\n")
      || ""
  );

  setImprovements(
    improvementsBlock?.items?.join("\n")
      || ""
  );

  setKnownIssues(
    knownIssuesBlock?.items?.join("\n")
      || ""
  );

  setActionRequired(
    actionRequiredBlock?.content
      || ""
  );

  setReleaseType(
  releaseTypeBlock?.value ||
  "Major Release"
);

setAudience(
  audienceBlock?.value ||
  "All Employees"
);

  setAddDialogOpen(true);
}

 function handleDelete(note) {
  setNoteToDelete(note);
  setDeleteDialogOpen(true);
}

 async function handleTogglePublish(
  note
) {
  try {

    await togglePublish(
      note.ReleaseNoteId
    );

    await loadReleaseNotes();

  } catch (error) {

    console.error(error);

  }
}

function closeDeleteDialog() {
  setDeleteDialogOpen(false);
  setNoteToDelete(null);
}

function openAddDialog() {
  setDialogMode("add");
  setEditingNote(null);
  setTitle("");
  setVersion("");
  setSummary("");
  setFeatures("");
  setBenefits("");
  setImprovements("");
  setKnownIssues("");
  setActionRequired("");
  setReleaseType(
  "Major Release"
);

setAudience(
  "All Employees"
);
  setAddDialogOpen(true);
}


  function closeAddDialog() {
  setAddDialogOpen(false);
 }

 function handleView(note) {
  setSelectedNote(note);
  setPreviewOpen(true);
}

function closePreviewDialog() {
  setPreviewOpen(false);
  setSelectedNote(null);
}

  function closeViewDialog() {
  setViewDialogOpen(false);
  setSelectedNote(null);
}

async function saveReleaseNote() {
  try {

    const contentJson =
    JSON.stringify([

      {
        type: "releaseType",
        value: releaseType,
      },

      {
        type: "audience",
        value: audience,
      },
      {
        type: "summary",
        content: summary,
      },

      {
        type: "features",
        items: features
          .split("\n")
          .filter(Boolean),
      },

      {
        type: "benefits",
        items: benefits
          .split("\n")
          .filter(Boolean),
      },

      {
        type: "improvements",
        items: improvements
          .split("\n")
          .filter(Boolean),
      },

      {
        type: "knownIssues",
        items: knownIssues
          .split("\n")
          .filter(Boolean),
      },

      {
        type: "actionRequired",
        content: actionRequired,
      },
    ]);

    if (dialogMode === "add") {

      await addReleaseNote({
        title,
        version,
        summary,
        contentJson,
      });

    } else {

      await updateReleaseNote(
        editingNote.ReleaseNoteId,
        {
          title,
          version,
          summary,
          contentJson,
        }
      );

    }
    
    await loadReleaseNotes();

    closeAddDialog();

  } catch (error) {
    console.error(error);
  }
}

async function confirmDeleteReleaseNote() {
  if (!noteToDelete) {
    return;
  }

  try {

    await deleteReleaseNote(
      noteToDelete.ReleaseNoteId
    );

    await loadReleaseNotes();

    closeDeleteDialog();

  } catch (error) {

    console.error(error);

  }
}
 

  async function loadReleaseNotes() {
    try {
      const data =
        await getReleaseNotes();

      setReleaseNotes(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadReleaseNotes();
  }, []);

const content =
  selectedNote?.ContentJson
    ? JSON.parse(
        selectedNote.ContentJson
      )
    : [];
    



  return (
    <main className="release-notes-page">

      <h1 className="release-notes-title">
        Admin Panel
      </h1>

      <div className="admin-panel-card">

        <Tabs
          value={activeTab}
          onChange={(_, value) =>
            setActiveTab(value)
          }
        >
          <Tab
            label="Release Notes"
          />

          <Tab
            label="Announcements"
            disabled
          />
        </Tabs>

        {activeTab === 0 && (
          <>
            

            <div className="release-notes-toolbar">

 <input
  type="text"
  placeholder="Search Release Notes"
  className="release-notes-search"
  value={searchTerm}
  onChange={(event) =>
    setSearchTerm(
      event.target.value
    )
  }
/>

  <button
  className="add-release-note-btn"
  onClick={openAddDialog}
>
  + Add Release Note
</button>

</div>
<ReleaseNotesGrid
  releaseNotes={releaseNotes}
  searchTerm={searchTerm}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onTogglePublish={handleTogglePublish}
/>
          </>
        )}

      </div>
<Dialog
  open={addDialogOpen}
  onClose={closeAddDialog}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      height: "85vh",
    },
  }}
>
  <>

  <DialogTitle>

    {dialogMode === "add"
      ? "Add Release Note"
      : "Edit Release Note"}

  </DialogTitle>

  
</>

  <DialogContent
    className="skill-dialog-content"
  >
  <div className="builder-layout">

  <div className="builder-form">

    <div className="builder-section-header">
      Release Information
    </div>

    <div className="content-builder-card">

      <TextField
        label="Title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        fullWidth
        size="small"
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Version"
        value={version}
        onChange={(event) =>
          setVersion(event.target.value)
        }
        fullWidth
        size="small"
      />

    </div>

    <div className="content-builder-card">

      <TextField
        select
        label="Release Type"
        value={releaseType}
        onChange={(event) =>
          setReleaseType(
            event.target.value
          )
        }
        fullWidth
        size="small"
      >
        <MenuItem value="Major Release">
          Major Release
        </MenuItem>

        <MenuItem value="Minor Release">
          Minor Release
        </MenuItem>

        <MenuItem value="Hotfix">
          Hotfix
        </MenuItem>

        <MenuItem value="Announcement">
          Announcement
        </MenuItem>

      </TextField>

    </div>

    <div className="content-builder-card">

      <TextField
        select
        label="Audience"
        value={audience}
        onChange={(event) =>
          setAudience(
            event.target.value
          )
        }
        fullWidth
        size="small"
      >
        <MenuItem value="All Employees">
          All Employees
        </MenuItem>

        <MenuItem value="Managers">
          Managers
        </MenuItem>

        <MenuItem value="HR">
          HR
        </MenuItem>

        <MenuItem value="Engineering">
          Engineering
        </MenuItem>

      </TextField>

    </div>

    <div className="builder-section-header">
      Content Builder
    </div>

    <div className="content-builder-card">

      <TextField
        label="Summary"
        value={summary}
        onChange={(event) =>
          setSummary(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Features"
        value={features}
        onChange={(event) =>
          setFeatures(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
        helperText="One feature per line"
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Benefits"
        value={benefits}
        onChange={(event) =>
          setBenefits(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
        helperText="One benefit per line"
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Improvements"
        value={improvements}
        onChange={(event) =>
          setImprovements(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Known Issues"
        value={knownIssues}
        onChange={(event) =>
          setKnownIssues(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
      />

    </div>

    <div className="content-builder-card">

      <TextField
        label="Action Required"
        value={actionRequired}
        onChange={(event) =>
          setActionRequired(
            event.target.value
          )
        }
        multiline
        rows={4}
        fullWidth
      />

    </div>

  </div>

  <div className="builder-preview">

    <div className="release-preview-header">

      <div className="release-preview-badge">
        🚀 What's New
      </div>

      <h2 className="release-preview-title">
        {title || "Release Title"}
      </h2>

      <div className="release-preview-version">
        Version {version || "1.0"}
      </div>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          gap: "8px",
        }}
      >
        <span className="preview-pill">
          {releaseType}
        </span>

        <span className="preview-pill">
          {audience}
        </span>
      </div>

    </div>

    {summary && (

      <section className="preview-section">

        <div className="preview-title-row">
          <DescriptionOutlinedIcon fontSize="small" />
          Summary
        </div>

        <div className="preview-summary">
          {summary}
        </div>

      </section>

    )}

    {features.trim() && (

      <section className="preview-section">

        <div className="preview-title-row">
          <AutoAwesomeOutlinedIcon fontSize="small" />
          Features
        </div>

        <div className="preview-list">

          {features
            .split("\n")
            .filter(Boolean)
            .map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

        </div>

      </section>

    )}

    {benefits.trim() && (

      <section className="preview-section">

        <div className="preview-title-row">
          <EmojiEventsOutlinedIcon fontSize="small" />
          Benefits
        </div>

        <div className="preview-list">

          {benefits
            .split("\n")
            .filter(Boolean)
            .map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

        </div>

      </section>

    )}

    {improvements.trim() && (

      <section className="preview-section">

        <div className="preview-title-row">
          <TrendingUpOutlinedIcon fontSize="small" />
          Improvements
        </div>

        <div className="preview-list">

          {improvements
            .split("\n")
            .filter(Boolean)
            .map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

        </div>

      </section>

    )}

    {knownIssues.trim() && (

      <section className="preview-section">

        <div className="preview-title-row">
          <WarningAmberOutlinedIcon fontSize="small" />
          Known Issues
        </div>

        <div className="preview-list">

          {knownIssues
            .split("\n")
            .filter(Boolean)
            .map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

        </div>

      </section>

    )}

    {actionRequired.trim() && (

      <section className="preview-section">

        <div className="preview-title-row">
          <AssignmentTurnedInOutlinedIcon fontSize="small" />
          Action Required
        </div>

        <div
          className="preview-summary"
          style={{
            borderLeft:
              "4px solid #007DA3",
          }}
        >
          {actionRequired}
        </div>

      </section>

    )}

  </div>

</div>
</DialogContent>
  <DialogActions>
    <Button
      onClick={closeAddDialog}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={saveReleaseNote}
    >
      {dialogMode === "add"
  ? "Create"
  : "Update"}
    </Button>
  </DialogActions>
  </Dialog>


<Dialog
  open={deleteDialogOpen}
  onClose={closeDeleteDialog}
  maxWidth="xs"
  fullWidth
>

  <DialogTitle>
    Delete Release Note
  </DialogTitle>

  <DialogContent>

    Are you sure you want to delete

    <strong>
      {" "}
      {noteToDelete?.Title}
    </strong>

    ?

    <br />
    <br />

    This action cannot be undone.

  </DialogContent>

  <DialogActions>

    <Button
      onClick={closeDeleteDialog}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={
        confirmDeleteReleaseNote
      }
    >
      Delete
    </Button>

  </DialogActions>

</Dialog>

<Dialog
  open={viewDialogOpen}
  onClose={closeViewDialog}
  maxWidth="md"
  fullWidth
>

  <DialogTitle>
    Release Note Details
  </DialogTitle>

  <DialogContent
    className="skill-dialog-content"
  >

    <TextField
      label="Title"
      value={
        selectedNote?.Title || ""
      }
      fullWidth
      size="small"
      InputProps={{
        readOnly: true,
      }}
    />

    <TextField
      label="Version"
      value={
        selectedNote?.Version || ""
      }
      fullWidth
      size="small"
      InputProps={{
        readOnly: true,
      }}
    />

    <TextField
      label="Summary"
      value={
        selectedNote?.Summary || ""
      }
      fullWidth
      multiline
      rows={6}
      InputProps={{
        readOnly: true,
      }}
    />

    <TextField
      label="Status"
      value={
        selectedNote?.IsPublished
          ? "Published"
          : "Draft"
      }
      fullWidth
      size="small"
      InputProps={{
        readOnly: true,
      }}
    />

  </DialogContent>

  <DialogActions>

    <Button
      onClick={closeViewDialog}
    >
      Close
    </Button>

  </DialogActions>

</Dialog>

<Dialog
  open={previewOpen}
  onClose={closePreviewDialog}
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
        {selectedNote?.Title}
      </h2>

      <div className="release-preview-version">
        Version {selectedNote?.Version}
      </div>

    </div>

  </DialogTitle>

  <DialogContent>

  {selectedNote?.Summary && (

    <section className="preview-section">

      <h3 className="preview-section-title">Summary</h3>

      <p className="preview-summary">
        {selectedNote.Summary}
      </p>

    </section>

  )}

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
              • {item}
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
              • {item}
            </div>

          ))}

      </div>

    </section>

  )}

  {content.find(
  block =>
    block.type === "improvements"
)?.items?.length > 0 && (

  <section className="preview-section">

    <h3 className="preview-section-title">
      🚀 Improvements
    </h3>

    <div className="preview-list">

      {content
        .find(
          block =>
            block.type === "improvements"
        )
        .items.map(item => (

          <div
            key={item}
            className="preview-list-item"
          >
            • {item}
          </div>

        ))}

    </div>

  </section>

)}

{content.find(
  block =>
    block.type === "knownIssues"
)?.items?.length > 0 && (

  <section className="preview-section">

    <h3 className="preview-section-title">
      ⚠ Known Issues
    </h3>

    <div className="preview-list">

      {content
        .find(
          block =>
            block.type === "knownIssues"
        )
        .items.map(item => (

          <div
            key={item}
            className="preview-list-item"
          >
            • {item}
          </div>

        ))}

    </div>

  </section>

)}

{content.find(
  block =>
    block.type === "actionRequired"
)?.content && (

  <section className="preview-section">

    <h3 className="preview-section-title">
      📌 Action Required
    </h3>

    <div
      className="preview-summary"
      style={{
        borderLeft:
          "4px solid #007DA3",
      }}
    >
      {
        content.find(
          block =>
            block.type ===
            "actionRequired"
        ).content
      }
    </div>

  </section>

)}

</DialogContent>

  <DialogActions>

    <Button
      onClick={closePreviewDialog}
    >
      Close
    </Button>

  </DialogActions>

</Dialog>
    </main>
  );
}

export default ReleaseNotesAdmin;