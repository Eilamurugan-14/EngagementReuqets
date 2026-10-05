import "../styles/Profile.css";

import { useEffect, useState } from "react";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DeleteIcon from "@mui/icons-material/Delete";

import ProfileSection from "../components/ProfileSection";

import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import Tooltip from "@mui/material/Tooltip";

import EditIcon from "@mui/icons-material/Edit";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import {
  getSkills,
  getEmployeeSkills,
  addEmployeeSkill,
  deleteEmployeeSkill,
  updateEmployeeSkill,
} from "../services/api";

function Profile() {
  const profile = {
    name: "Eilamurugan S A",
    designation: "Intern",
    employeeId: "INT001",
    email: "sa.eilamurugan.sankar@xylem.com",
    dateOfJoining: "Aug 26, 2026",
    organization: "Xylem",
    gender: "Male",

    projectTeam: "-",
    groupName: "-",
    segment: "-",

    hfmCode: "-",
    indCostCenter: "-",
    usCostCenter: "-",

    manager: "Venkateshwara Rao",
    nextLevelManager:
      "Ramakrishnan Purushothaman",

    location: "Chennai",
  };

  const EMPLOYEE_ID = "INT001";

const [skills, setSkills] = useState([]);
const [allSkills, setAllSkills] =
  useState([]);

const [
  selectedSkill,
  setSelectedSkill,
] = useState(null);

const [newLevel, setNewLevel] =
  useState(3);

const [editingSkillId, setEditingSkillId] =
  useState(null);

const [editingLevel, setEditingLevel] =
  useState(3);

const [deleteDialogOpen, setDeleteDialogOpen] =
  useState(false);

const [skillToDelete, setSkillToDelete] =
  useState(null);

const proficiencyLabels = {
  1: "Basic Awareness",
  2: "Beginner",
  3: "Working Knowledge",
  4: "Advanced",
  5: "Expert / Can Give KT",
};

const proficiencyDescriptions = {
  1: {
    title: "Basic Awareness",
    description:
      "Understands fundamental concepts and terminology.",
  },

  2: {
    title: "Beginner",
    description:
      "Can perform simple tasks with guidance.",
  },

  3: {
    title: "Working Knowledge",
    description:
      "Can work independently on routine tasks.",
  },

  4: {
    title: "Advanced",
    description:
      "Can handle complex work and mentor team members.",
  },

  5: {
    title: "Expert / Can Give KT",
    description:
      "Subject matter expert capable of training and guiding others.",
  },
};

useEffect(() => {
  loadSkills();
  loadEmployeeSkills();
}, []);

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


async function addSkill() {
  if (!selectedSkill) {
    alert("Select a skill.");
    return;
  }

  try {
    await addEmployeeSkill({
      employeeId: EMPLOYEE_ID,
      skillId:
        selectedSkill.SkillId,
      proficiencyLevel:
        newLevel,
    });

    setSelectedSkill(null);
    setNewLevel(3);

    await loadEmployeeSkills();
  } catch (error) {
    alert(
      error?.response?.data
        ?.message ||
        "Unable to add skill"
    );
  }
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
  } catch (error) {
    console.error(error);
  }
}

async function saveSkillLevel(
  employeeSkillId
) {
  try {
    await updateEmployeeSkill(
      employeeSkillId,
      editingLevel
    );

    setEditingSkillId(null);

    await loadEmployeeSkills();
  } catch (error) {
    console.error(error);
  }
}

function renderStars(level) {
  return "★".repeat(level) +
    "☆".repeat(5 - level);
}

  return (
    <main className="profile-page">
      <h1 className="profile-title">
        My Profile
      </h1>

      <div className="profile-header-card">
        <div className="profile-avatar">
          EA
        </div>

        <div>
          <h2>{profile.name}</h2>

          <p>{profile.designation}</p>

          <div className="profile-tags">
            <span>Intern</span>
            <span>GCC</span>
          </div>
        </div>
      </div>

      <ProfileSection
        title="Basic Details"
        icon={<PersonIcon />}
      >
        <div className="profile-grid">
          <ProfileItem
            label="Employee ID"
            value={profile.employeeId}
          />

          <ProfileItem
            label="Email ID"
            value={profile.email}
          />

          <ProfileItem
            label="Date of Joining"
            value={profile.dateOfJoining}
          />

          <ProfileItem
            label="Organization"
            value={profile.organization}
          />

          <ProfileItem
            label="Gender"
            value={profile.gender}
          />
        </div>
      </ProfileSection>

      <ProfileSection
        title="Team, Department & Location"
        icon={<GroupsIcon />}
      >
        <div className="profile-grid">
          <ProfileItem
            label="Project / Team"
            value={profile.projectTeam}
          />

          <ProfileItem
            label="Group Name"
            value={profile.groupName}
          />

          <ProfileItem
            label="Segment"
            value={profile.segment}
          />

          <ProfileItem
            label="HFM Code"
            value={profile.hfmCode}
          />

          <ProfileItem
            label="IND Cost Center"
            value={profile.indCostCenter}
          />

          <ProfileItem
            label="US Cost Center"
            value={profile.usCostCenter}
          />

          <ProfileItem
            label="Manager Name"
            value={profile.manager}
          />

          <ProfileItem
            label="Next Level Manager"
            value={
              profile.nextLevelManager
            }
          />

          <ProfileItem
            label="Work Location"
            value={profile.location}
          />
        </div>
      </ProfileSection>

      <ProfileSection
        title="Skills & Competencies"
        icon={<PsychologyIcon />}
      >

  <div className="skill-form">

    <Autocomplete
      options={allSkills}
      value={selectedSkill}
      onChange={(_, value) =>
        setSelectedSkill(value)
      }
      getOptionLabel={(option) =>
        option.SkillName || ""
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search Skill"
          size="small"
        />
      )}
      sx={{
        minWidth: 300,
        flex: 1,

        "& .MuiOutlinedInput-root": {
          backgroundColor: "#fff",
          borderRadius: "8px",
        },

        "& fieldset": {
          border: "1px solid #d1d5db",
        },
      }}
    />

    <select
      value={newLevel}
      onChange={(event) =>
        setNewLevel(
          Number(
            event.target.value
          )
        )
      }
    >
      <option value={1}>
        1 - Basic Awareness
      </option>

      <option value={2}>
        2 - Beginner
      </option>

      <option value={3}>
        3 - Working Knowledge
      </option>

      <option value={4}>
        4 - Advanced
      </option>

      <option value={5}>
        5 - Expert / Can Give KT
      </option>
    </select>

    <button
      type="button"
      className="add-skill-btn"
      onClick={addSkill}
    >
      Add Skill
    </button>

  </div>

  <div className="skills-list">

    {skills.map((skill) => (
      <div
        key={skill.EmployeeSkillId}
        className={`skill-card ${
          editingSkillId ===
          skill.EmployeeSkillId
            ? "editing"
            : ""
        }`}
      >

        {editingSkillId ===
        skill.EmployeeSkillId ? (

          <div className="edit-skill-section">

            <select
              value={editingLevel}
              onChange={(event) =>
                setEditingLevel(
                  Number(
                    event.target.value
                  )
                )
              }
            >
              <option value={1}>
                1 - Basic Awareness
              </option>

              <option value={2}>
                2 - Beginner
              </option>

              <option value={3}>
                3 - Working Knowledge
              </option>

              <option value={4}>
                4 - Advanced
              </option>

              <option value={5}>
                5 - Expert / Can Give KT
              </option>
            </select>

            <div className="edit-buttons">

              <button
                className="save-btn"
                onClick={() =>
                  saveSkillLevel(
                    skill.EmployeeSkillId
                  )
                }
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingSkillId(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        ) : (

          <div className="skill-grid-card">

            <div className="skill-grid-header">

              <div className="skill-name">
                {skill.SkillName}
              </div>

              <div className="skill-actions">

                <button
                  type="button"
                  className="skill-edit-btn"
                  onClick={() => {
                    setEditingSkillId(
                      skill.EmployeeSkillId
                    );

                    setEditingLevel(
                      skill.ProficiencyLevel
                    );
                  }}
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
                    {
                      proficiencyDescriptions[
                        skill.ProficiencyLevel
                      ].title
                    }
                  </strong>

                  <br />

                  {
                    proficiencyDescriptions[
                      skill.ProficiencyLevel
                    ].description
                  }
                </div>
              }
            >
              <div className="skill-stars">
                {renderStars(
                  skill.ProficiencyLevel
                )}
              </div>
            </Tooltip>

            <div className="skill-level">
              {
                proficiencyLabels[
                  skill.ProficiencyLevel
                ]
              }
            </div>

          </div>

        )}

      </div>
    ))}

  </div>

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
      onClick={closeDeleteDialog}
    >
      Cancel
    </Button>

    <Button
      color="error"
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
        <div className="empty-card">
          No assets assigned
        </div>
      </ProfileSection>
    </main>
  );
}

function ProfileItem({
  label,
  value,
}) {
  return (
    <div className="profile-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default Profile;