import "../styles/Profile.css";

import { useEffect, useState } from "react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DeleteIcon from "@mui/icons-material/Delete";

import ProfileSection from "../components/ProfileSection";

import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BusinessIcon from "@mui/icons-material/Business";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import Tooltip from "@mui/material/Tooltip";

import EditIcon from "@mui/icons-material/Edit";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

import {
  getSkills,
  getEmployeeSkills,
  getEmployeeProfile,
  addEmployeeSkill,
  deleteEmployeeSkill,
  updateEmployeeSkill,
} from "../services/api";

const ITEMS_PER_PAGE = 15;

function Profile() {
  const EMPLOYEE_ID = "INT001";

const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] =
  useState(true);
const [profileError, setProfileError] =
  useState("");

const [skills, setSkills] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [allSkills, setAllSkills] =
  useState([]);

const [
  selectedSkill,
  setSelectedSkill,
] = useState(null);

  const [newLevel, setNewLevel] =
    useState("");

 const [addDialogOpen, setAddDialogOpen] =
   useState(false);
 const [editDialogOpen, setEditDialogOpen] =
   useState(false);
 const [skillToEdit, setSkillToEdit] =
   useState(null);

const [editingLevel, setEditingLevel] =
  useState(3);

const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [skillToDelete, setSkillToDelete] =
  useState(null);

const normalizedSearchTerm =
  searchTerm.trim().toLowerCase();
const filteredSkills = skills.filter((skill) => {
  const skillName =
    skill.SkillName?.toLowerCase() || "";
  const category =
    skill.Category?.toLowerCase() || "";

  return (
    skillName.includes(normalizedSearchTerm) ||
    category.includes(normalizedSearchTerm)
  );
});
const sortedSkills = [...filteredSkills].sort((firstSkill, secondSkill) => {
  const proficiencyDifference =
    Number(secondSkill.ProficiencyLevel) -
    Number(firstSkill.ProficiencyLevel);

  if (proficiencyDifference !== 0) {
    return proficiencyDifference;
  }

  return (firstSkill.SkillName || "").localeCompare(
    secondSkill.SkillName || "",
    undefined,
    { sensitivity: "base" }
  );
});
const totalPages = Math.ceil(
  filteredSkills.length / ITEMS_PER_PAGE
);
const safeCurrentPage = Math.min(
  currentPage,
  Math.max(totalPages, 1)
);
const firstSkillIndex =
  (safeCurrentPage - 1) * ITEMS_PER_PAGE;
const paginatedSkills = sortedSkills.slice(
  firstSkillIndex,
  firstSkillIndex + ITEMS_PER_PAGE
);
const firstVisibleSkill =
  filteredSkills.length === 0
    ? 0
    : firstSkillIndex + 1;
const lastVisibleSkill = Math.min(
  firstSkillIndex + ITEMS_PER_PAGE,
  filteredSkills.length
);

useEffect(() => {
  if (currentPage > Math.max(totalPages, 1)) {
    setCurrentPage(Math.max(totalPages, 1));
  }
}, [currentPage, totalPages]);





useEffect(() => {
  loadEmployeeProfile();
  loadSkills();
  loadEmployeeSkills();
}, []);

async function loadEmployeeProfile() {
  try {
    setProfileLoading(true);
    setProfileError("");

    const data = await getEmployeeProfile(
      EMPLOYEE_ID
    );

    setProfile(data);
  } catch (error) {
    console.error(error);
    setProfile(null);
    setProfileError(
      error?.response?.data?.message ||
        "Unable to load employee profile."
    );
  } finally {
    setProfileLoading(false);
  }
}

async function loadSkills() {
  try {
    const data = await getSkills();

    setAllSkills(data);
  } catch (error) {
    console.error(error);
  }
}

async function loadEmployeeSkills() {
  try {
    const data =
      await getEmployeeSkills(
        EMPLOYEE_ID
      );

    setSkills(data);
  } catch (error) {
    console.error(error);
  }
}


function openAddDialog() {
  setSelectedSkill(null);
  setNewLevel("");
  setAddDialogOpen(true);
}

function closeAddDialog() {
  setAddDialogOpen(false);
  setSelectedSkill(null);
  setNewLevel("");
}

async function addSkill() {
  if (!selectedSkill || !newLevel) {
    toast.warning("Select a skill and proficiency level.");
    return;
  }

  try {
    await addEmployeeSkill({
      employeeId: EMPLOYEE_ID,
      skillId: selectedSkill.SkillId,
      proficiencyLevel: Number(newLevel),
    });

    closeAddDialog();
    await loadEmployeeSkills();
    toast.success("Skill added successfully");
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Unable to add skill"
    );
  }
}

function openEditDialog(skill) {
  setSkillToEdit(skill);
  setEditingLevel(skill.ProficiencyLevel);
  setEditDialogOpen(true);
}

function closeEditDialog() {
  setEditDialogOpen(false);
  setSkillToEdit(null);
}

function openDeleteDialog(skill) {
  setSkillToDelete(skill);
  setDeleteDialogOpen(true);
}

function closeDeleteDialog() {
  setDeleteDialogOpen(false);
  setSkillToDelete(null);
}

async function confirmDeleteSkill() {
  if (!skillToDelete) {
    return;
  }

  try {
    await deleteEmployeeSkill(
      skillToDelete.EmployeeSkillId
    );

    await loadEmployeeSkills();
    closeDeleteDialog();
    toast.success("Skill deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message ||
        "Unable to delete skill"
    );
  }
}

async function saveSkillLevel() {
  if (!skillToEdit) {
    return;
  }

  try {
    await updateEmployeeSkill(
      skillToEdit.EmployeeSkillId,
      editingLevel
    );

    await loadEmployeeSkills();
    closeEditDialog();
    toast.success("Skill updated successfully");
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message ||
        "Unable to update skill"
    );
  }
}

function renderProficiency(level) {
  return Array.from(
    { length: 5 },
    (_, index) => (
      <span
        key={index}
        className={
          index < level
            ? "proficiency-dot filled"
            : "proficiency-dot"
        }
      >
        ●
      </span>
    )
  );
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

  return (
    <main className="profile-page">
      <h1 className="profile-title">
        My Profile
      </h1>

      <div className="profile-header-card">
        <div className="profile-avatar">
          {profile
            ? profile.EmployeeName
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()
            : ""}
        </div>

        <div>
          <h2>
            {profile?.EmployeeName ||
              (profileLoading
                ? "Loading profile..."
                : "Profile unavailable")}
          </h2>

          <p>{profile?.Designation || ""}</p>

          <div className="profile-tags">
            <span>{profile?.Designation || ""}</span>
            <span>{profile?.Organization || ""}</span>
          </div>
        </div>
      </div>

      {profileLoading && (
        <p role="status">Loading profile...</p>
      )}

      {profileError && (
        <p role="alert">{profileError}</p>
      )}

      {profile && (
        <>
      <ProfileSection
        title="Basic Details"
        icon={<PersonIcon />}
      >
        <div className="profile-grid">
          <ProfileItem
            icon={<BadgeIcon />}
            label="Employee ID"
            value={profile.EmployeeId}
          />

          <ProfileItem
            icon={<EmailIcon />}
            label="Email ID"
            value={profile.Email}
          />

          <ProfileItem
            icon={<CalendarMonthIcon />}
            label="Date of Joining"
            value={formatDate(profile.DateOfJoining)}
          />

          <ProfileItem
            icon={<BusinessIcon />}
            label="Organization"
            value={profile.Organization}
          />

          <ProfileItem
            icon={<PersonOutlineIcon />}
            label="Gender"
            value={profile.Gender}
          />
        </div>
      </ProfileSection>

      <ProfileSection
        title="Team, Department & Location"
        icon={<GroupsIcon />}
      >
        <div className="profile-grid">
          <ProfileItem
            icon={<GroupsIcon />}
            label="Project / Team"
            value={profile.ProjectTeam}
          />

          <ProfileItem
            icon={<BusinessIcon />}
            label="Group Name"
            value={profile.GroupName}
          />

          <ProfileItem
            icon={<BadgeIcon />}
            label="Segment"
            value={profile.Segment}
          />

          <ProfileItem
            icon={<BadgeIcon />}
            label="HFM Code"
            value={profile.HFMCode}
          />

          <ProfileItem
            icon={<BadgeIcon />}
            label="IND Cost Center"
            value={profile.INDCostCenter}
          />

          <ProfileItem
            icon={<BadgeIcon />}
            label="US Cost Center"
            value={profile.USCostCenter}
          />

          <ProfileItem
            icon={<SupervisorAccountIcon />}
            label="Manager Name"
            value={profile.ManagerName}
          />

          <ProfileItem
            icon={<SupervisorAccountIcon />}
            label="Next Level Manager"
            value={
              profile.NextLevelManager
            }
          />

          <ProfileItem
            icon={<LocationOnIcon />}
            label="Work Location"
            value={profile.Location}
          />
        </div>
      </ProfileSection>
        </>
      )}

      <ProfileSection
        title={`Skills & Competencies (${skills.length})`}
        icon={<PsychologyIcon />}
      >

  <div className="skills-toolbar">
    <TextField
      className="skills-search"
      size="small"
      placeholder="Search skills by name or category..."
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
    <button
      type="button"
      className="add-skill-btn"
      onClick={openAddDialog}
    >
      + Add Skill
    </button>
  </div>

  <div className="skills-list">

    {skills.length === 0 ? (
      <div className="skills-empty-state">
        No skills added yet. Use Add Skill to get started.
      </div>
    ) : filteredSkills.length === 0 ? (
      <div className="skills-empty-state">
        <strong>No matching skills found.</strong>
        <p>Try searching with a different skill name or category.</p>
      </div>
    ) : paginatedSkills.map((skill) => (
      <div
        key={skill.EmployeeSkillId}
        className="skill-card"
      >

        <div className="skill-grid-card">

            <div className="skill-grid-header">
                <div className="skill-title-section">

                  <div className="skill-name">
                    {skill.SkillName}
                  </div>

                  <div className="skill-category">
                    {skill.Category}
                  </div>

                </div>

              <div className="skill-actions">

                <button
                  type="button"
                  className="skill-edit-btn"
                  aria-label={`Edit ${skill.SkillName}`}
                  onClick={() => openEditDialog(skill)}
                >
                  <EditIcon />
                </button>

                <button
                  type="button"
                  className="skill-delete-btn"
                  onClick={() =>
                    openDeleteDialog(skill)
                  }
                >
                  <DeleteIcon />
                </button>

              </div>

            </div>

            <Tooltip
              arrow
              placement="top"
              title={
                  <div>
                    <strong>
                      {skill.LevelName}
                    </strong>

                    <br />

                    {skill.Description}
                  </div>
                }
            >
              <div
                className={`skill-stars level-${skill.ProficiencyLevel}`}
                role="img"
                aria-label={`${skill.ProficiencyLevel} out of 5 stars`}
              >
                {renderProficiency(skill.ProficiencyLevel)}
              </div>
            </Tooltip>

            <div className="skill-level">
              {
                skill.LevelName
              }
            </div>

          </div>

      </div>
    ))}

  </div>

  <div className="skills-pagination-footer">
    <div className="skills-count">
      Displaying {firstVisibleSkill}-{lastVisibleSkill} of {filteredSkills.length} skills
    </div>

    {totalPages > 1 && (
      <nav className="skills-pagination" aria-label="Skills pages">
        <button
          type="button"
          className="skills-page-btn"
          onClick={() => setCurrentPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
        >
          {"< Previous"}
        </button>

        <div className="skills-page-numbers">
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              type="button"
              className={`skills-page-btn ${
                safeCurrentPage === page ? "active" : ""
              }`}
              aria-current={
                safeCurrentPage === page ? "page" : undefined
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="skills-page-btn"
          onClick={() => setCurrentPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
        >
          {"Next >"}
        </button>
      </nav>
    )}
  </div>

  <Dialog
    open={addDialogOpen}
    onClose={closeAddDialog}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>Add Skill</DialogTitle>
    <DialogContent className="skill-dialog-content">
      <label
        className="skill-dialog-label"
        htmlFor="add-skill-autocomplete"
      >
        Skill Name
      </label>
      <Autocomplete
        options={allSkills}
        value={selectedSkill}
        onChange={(_, value) => setSelectedSkill(value)}
        getOptionLabel={(option) => option.SkillName || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            id="add-skill-autocomplete"
            placeholder="Search skill"
            size="small"
          />
        )}
      />

      <label className="skill-dialog-label" htmlFor="add-skill-level">
        Proficiency Level
      </label>
      <select
        id="add-skill-level"
        className="skill-dialog-select"
        value={newLevel}
        onChange={(event) => setNewLevel(event.target.value)}
      >
        <option value="" disabled>
          Select Proficiency Level
        </option>
        <option value={1}>1 - Basic Awareness</option>
        <option value={2}>2 - Beginner</option>
        <option value={3}>3 - Working Knowledge</option>
        <option value={4}>4 - Advanced</option>
        <option value={5}>5 - Expert / Can Give KT</option>
      </select>
    </DialogContent>
    <DialogActions>
      <Button
        className="skill-dialog-cancel-btn"
        onClick={closeAddDialog}
      >
        Cancel
      </Button>
      <Button
        className="skill-dialog-primary-btn"
        variant="contained"
        onClick={addSkill}
        disabled={!selectedSkill || !newLevel}
      >
        Add Skill
      </Button>
    </DialogActions>
  </Dialog>

  <Dialog
    open={editDialogOpen}
    onClose={closeEditDialog}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>Edit Skill</DialogTitle>
    <DialogContent className="skill-dialog-content">
      <label
        className="skill-dialog-label"
        htmlFor="edit-skill-name"
      >
        Skill Name
      </label>
      <TextField
        id="edit-skill-name"
        value={skillToEdit?.SkillName || ""}
        fullWidth
        size="small"
        placeholder="Skill Name"
        InputProps={{ readOnly: true }}
      />

      <label className="skill-dialog-label" htmlFor="edit-skill-level">
        Proficiency Level
      </label>
      <select
        id="edit-skill-level"
        className="skill-dialog-select"
        value={editingLevel}
        onChange={(event) =>
          setEditingLevel(Number(event.target.value))
        }
      >
        <option value={1}>1 - Basic Awareness</option>
        <option value={2}>2 - Beginner</option>
        <option value={3}>3 - Working Knowledge</option>
        <option value={4}>4 - Advanced</option>
        <option value={5}>5 - Expert / Can Give KT</option>
      </select>
    </DialogContent>
    <DialogActions>
      <Button
        className="skill-dialog-cancel-btn"
        onClick={closeEditDialog}
      >
        Cancel
      </Button>
      <Button
        className="skill-dialog-primary-btn"
        variant="contained"
        onClick={saveSkillLevel}
      >
        Save
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
    Delete Skill
  </DialogTitle>

  <DialogContent>
    Are you sure you want to delete
    <strong>
      {" "}
      {skillToDelete?.SkillName}
    </strong>
    ?
    <br />
    <br />
    This action cannot be undone.
  </DialogContent>

  <DialogActions>
    <Button
      className="skill-dialog-cancel-btn"
      onClick={closeDeleteDialog}
    >
      Cancel
    </Button>

    <Button
      className="skill-dialog-primary-btn"
      variant="contained"
      onClick={confirmDeleteSkill}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

</ProfileSection>

      <ProfileSection
        title="Asset History"
        icon={<HistoryIcon />}
        defaultOpen={false}
      >
        <div className="asset-history-empty">

          <HistoryIcon
            className="asset-history-empty-icon"
          />

          <p>
            Asset history tracking will
            appear here. Coming Soon!
          </p>

        </div>
      </ProfileSection>
    </main>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="profile-item">
      <div className="profile-item-label">
        {icon}
        <span>{label}</span>
      </div>

      <strong>{value ?? "-"}</strong>
    </div>
  );
}

export default Profile;