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

import {
  getSkills,
  getEmployeeSkills,
  addEmployeeSkill,
  deleteEmployeeSkill,
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

const proficiencyLabels = {
  1: "Basic Awareness",
  2: "Beginner",
  3: "Working Knowledge",
  4: "Advanced",
  5: "Expert / Can Give KT",
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

async function deleteSkill(id) {
  try {
    await deleteEmployeeSkill(id);

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
  <div className="skills-list">

    {skills.map((skill) => (
      <div
        key={skill.EmployeeSkillId}

        className="skill-card"
      >
        <div className="skill-header">
          <strong>
            {skill.SkillName}
          </strong>

          <button
            type="button"
            className="skill-delete-btn"
            onClick={() =>
              deleteSkill(skill.EmployeeSkillId)
            }
          >
            <DeleteIcon />
          </button>
        </div>

        <div className="skill-stars">
          {renderStars(skill.ProficiencyLevel)}
        </div>

        <div className="skill-level">
          {
            proficiencyLabels[
              skill.ProficiencyLevel
            ]
          }
        </div>
      </div>
    ))}

    <div className="skill-form">

      <Autocomplete
        options={allSkills}
        value={selectedSkill}
        onChange={(
          _,
          value
        ) =>
          setSelectedSkill(value)
        }
        getOptionLabel={(option) =>
          option.SkillName || ""
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skill"
            size="small"
          />
        )}
        sx={{
          minWidth: 250,
          flex: 1,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#fff",
            borderRadius: "6px",
            },
            "& fieldset": {
            border: "none",
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

  </div>
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