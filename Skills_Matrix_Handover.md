# Skills Matrix Feature Handover

**Audience:** Employee Dashboard integration team  
**Feature:** Skills Matrix & Competencies  
**Database:** SQL Server; scripts currently target `EmployeeEngagementRequests`  
**Status:** Functional in the feature branch; resolve the release blockers below before production integration.

## Feature Overview

The Skills Matrix adds employee profile data and a skill catalogue to the Employee Dashboard. Employees can add skills, set proficiency, search and sort their skills, page through results, and edit or delete their entries. Skills display category badges and proficiency descriptions.

The Profile page also loads employee profile information from SQL Server. Release notes for the Skills Matrix are maintained locally in the frontend and shown once per release version; they do not use the Announcements table or Toastify.

## Business Purpose

The feature provides an employee-maintained view of professional skills and proficiency. It supports skill visibility, career-development discussions, learning opportunities, and future workforce planning.

## Architecture Overview

```text
React Profile page
  ├─ services/api.js (Axios)
  │    └─ Express routes: /api/profile and /api/skills
  │          └─ controllers/profileController.js, skillsController.js
  │                └─ config/database.js (ODBC helper)
  │                      └─ SQL Server
  └─ App.jsx: versioned, localStorage-backed release notes
```

- The backend is CommonJS Express and connects to SQL Server using ODBC and `backend/.env`.
- `backend/server.js` mounts `/api/profile` and `/api/skills`.
- `backend/config/database.js` provides `all`, `get`, and `run`; it does not create the Skills Matrix tables. `initializeDatabase()` currently initializes only the existing Requests table.
- The frontend uses React Router, Axios, Material UI, and React Toastify. Toastify is used for Skills action feedback; the release notes dialog is local-only.
- Frontend API URLs currently use `http://localhost:5000`; configure the API base URL for the target environment during integration.

## Database Changes

### Tables

| Table | Purpose | Primary key | Relationships / important columns |
|---|---|---|---|
| `EmployeeProfile` | Employee details shown on the Profile page. | `EmployeeId` (`NVARCHAR(20)`) | `EmployeeName`, `Designation`, `Email`, `DateOfJoining`, `Organization`, `Gender`, `ProjectTeam`, `GroupName`, `Segment`, `HFMCode`, `INDCostCenter`, `USCostCenter`, `ManagerName`, `NextLevelManager`, `Location`, `CreatedDate`, `ModifiedDate`; the current script also adds `CreatedBy` and `ModifiedBy`. |
| `SkillsMaster` | Catalogue of selectable skills and categories. | `SkillId` (`INT IDENTITY`) | `SkillName`, `Category`, `IsActive`. The seed script adds a unique constraint on `SkillName`. |
| `EmployeeSkills` | Employee-to-skill assignments and proficiency. | `EmployeeSkillId` (`INT IDENTITY`) | `EmployeeId`, `SkillId`, `ProficiencyLevel`, `CreatedBy`, `CreatedDate`, `ModifiedBy`, `ModifiedDate`. FK to `SkillsMaster.SkillId`; intended FK to `ProficiencyLevels.ProficiencyLevelId`. |
| `ProficiencyLevels` | Master labels and descriptions for proficiency levels 1–5. | `ProficiencyLevelId` (`INT`) | `LevelName`, `Description`; the seed script also adds audit columns. |

### Relationships

```text
EmployeeProfile.EmployeeId  1 ── * EmployeeSkills.EmployeeId
SkillsMaster.SkillId        1 ── * EmployeeSkills.SkillId
ProficiencyLevels.ProficiencyLevelId  1 ── * EmployeeSkills.ProficiencyLevel
```

The relationship between `EmployeeProfile` and `EmployeeSkills` is currently logical only: the supplied SQL does not define an FK on `EmployeeSkills.EmployeeId`. The Skill and Proficiency relationships are intended to be enforced by FKs.

### Seed Data Requirements

1. Insert the five proficiency levels using IDs `1` through `5`:
   - 1: Basic Awareness
   - 2: Beginner
   - 3: Working Knowledge
   - 4: Advanced
   - 5: Expert / Can Give KT
2. Seed `SkillsMaster` before inserting employee skills. `GET /api/skills` only returns rows where `IsActive = 1`.
3. Seed or load the matching employee row in `EmployeeProfile`. Current sample data uses `INT001`.
4. Optional development sample: `EmployeeSkills` associates `INT001` with `SkillId = 1` and proficiency level 4. Verify what `SkillId = 1` represents before using this seed.

### Required SQL Scripts

Paths below preserve the repository’s current folder and filenames (including spelling):

| Script | Intended responsibility | Important caution |
|---|---|---|
| `SQL Quries/EmployeeProfile.sql` | Create `EmployeeProfile`, optional indexes, and an `INT001` sample. | Includes later `UPDATE` and `ALTER TABLE ... ADD` statements outside the table-exists guard. Not safe to rerun unchanged. |
| `SQL Quries/SkillList.sql` | Create and seed `SkillsMaster`. | Contains an unconditional unique-constraint add and `DELETE FROM SkillsMaster` before seed inserts. Running it can fail or erase/replace catalogue data. |
| `SQL Quries/Profiency_Level_table.sql` | Create and seed `ProficiencyLevels` (filename is misspelled). | Table creation, seed inserts, and audit-column `ALTER TABLE` are unconditional. Not safe to rerun unchanged. |
| `SQL Quries/EmployeeSkillMap.sql` | Create and seed `EmployeeSkills`, then add constraints/audit fields. | Starts with `TRUNCATE TABLE EmployeeSkills`; also contains a `sp_rename` operation that conflicts with runtime code expecting `EmployeeSkills.ProficiencyLevel`. Do not run this script end-to-end as a production migration without reconciling it. |

**Migration warning:** These files are a mixture of initial DDL, seed data, and later manual alterations, not a clean ordered migration set. Review them against the target database, split DDL from seed/update operations, make migrations idempotent, and remove destructive development statements before deployment. Back up and test on a disposable database first. Ensure the API’s `DB_DATABASE` points to the same database as the migrations.

### Example Data Flow

1. Profile loads `GET /api/profile/:employeeId` for employee details.
2. Skills UI loads `GET /api/skills` for selectable active catalogue entries.
3. Skills UI loads `GET /api/profile/skills/:employeeId` for existing assignments and joins labels/descriptions from the master tables.
4. Add/edit/delete actions write `EmployeeSkills`; the page then reloads the employee skill list.
5. Search, sorting, and pagination are performed in the browser; they do not call the backend.

## API Documentation

All responses are JSON. Routes are mounted by `backend/server.js`.

### `GET /api/profile/:employeeId`

Fetch one employee profile.

**Request body:** None. Example: `GET /api/profile/INT001`

**Success `200 OK`:** Raw SQL row with PascalCase keys, for example:

```json
{
  "EmployeeId": "INT001",
  "EmployeeName": "Employee Name",
  "Designation": "Intern",
  "Email": "employee@example.com",
  "DateOfJoining": "2026-08-26T00:00:00.000Z",
  "Organization": "Example Corp",
  "Gender": "",
  "ProjectTeam": "",
  "GroupName": "",
  "Segment": "",
  "HFMCode": "",
  "INDCostCenter": "",
  "USCostCenter": "",
  "ManagerName": "",
  "NextLevelManager": "",
  "Location": "",
  "CreatedDate": "2026-08-26T00:00:00.000Z",
  "ModifiedDate": "2026-08-26T00:00:00.000Z"
}
```

**Errors:** `404` with `{ "message": "Employee profile not found" }`; `500` with `{ "message": "Unable to fetch employee profile" }`.

### `GET /api/skills`

Return active catalogue entries ordered by skill name.

**Request body:** None.

**Success `200 OK`:**

```json
[
  { "SkillId": 1, "SkillName": "React", "Category": "Frontend" }
]
```

**Error:** `500` with `{ "message": "Unable to fetch skills" }`.

### `GET /api/profile/skills/:employeeId`

**Intended purpose:** Return the employee’s skill assignments with catalogue and proficiency labels.

**Request body:** None. Example: `GET /api/profile/skills/INT001`

**Expected success shape:**

```json
[
  {
    "EmployeeSkillId": 1,
    "SkillId": 1,
    "SkillName": "React",
    "Category": "Frontend",
    "ProficiencyLevel": 4,
    "LevelName": "Advanced",
    "Description": "Can handle complex work and mentor team members."
  }
]
```

**Critical current defect:** The current controller passes `req.params.employeeId` to the database helper but the SQL has no `WHERE es.EmployeeId = ?` clause. As written, this endpoint returns assignments for all employees. Do not merge/deploy until the query is scoped to the requested employee and a test proves another employee’s rows are not returned.

**Error:** `500` with `{ "message": "Unable to fetch employee skills" }`.

### `POST /api/profile/skills`

Add a skill for an employee.

**Request body:**

```json
{
  "employeeId": "INT001",
  "skillId": 1,
  "proficiencyLevel": 4
}
```

**Success:** `201 Created`, `{ "message": "Skill added successfully" }`. `CreatedDate` uses the SQL Server column default; `CreatedBy` is set to `employeeId`.

**Errors:** `400` duplicate assignment, `{ "message": "Skill already exists for employee" }`; `500` with `{ "message": "Unable to add skill" }` for other failures. Validate required fields and IDs at the API boundary before production; currently invalid DB values may surface as a 500.

### `PUT /api/profile/skills/:id`

Update proficiency for an existing employee-skill row.

**Request body:**

```json
{ "proficiencyLevel": 5 }
```

**Success:** `200 OK`, `{ "message": "Skill updated successfully" }`.

**Errors:** `400` if level is outside 1–5; `404` if the skill assignment ID is unknown; `500` for database failures.

### `DELETE /api/profile/skills/:id`

Delete an employee-skill assignment.

**Request body:** None.

**Success:** `200 OK`, `{ "message": "Skill deleted successfully" }`.

**Error:** `500` with `{ "message": "Unable to delete skill" }`. The current handler does not verify that a row was deleted or that it belongs to the authenticated employee.

## Frontend Capabilities

| Capability | Implementation |
|---|---|
| Profile page and employee details | `frontend/src/pages/Profile.jsx`; profile loaded through `getEmployeeProfile`. Current employee ID is hard-coded as `INT001`. |
| Skills section and cards | Same Profile page; loads employee assignments and catalogue data. |
| Search | Client-side case-insensitive, trimmed partial match on skill name and category. |
| Sorting | Client-side: proficiency high/low, skill name A–Z/Z–A, category A–Z/Z–A; applied after search. |
| Pagination | Client-side, 15 items per page, after filtering and sorting. |
| Category badges | Rendered on each skill card from `Category`. |
| Proficiency indicator/tooltips | Dots, level name, and description from `ProficiencyLevels`. |
| Add Skill | MUI dialog with catalogue autocomplete and required proficiency selection; success/error feedback uses React Toastify. |
| Edit Skill | MUI dialog with read-only name and selected current proficiency. |
| Delete | MUI confirmation dialog. |
| Release notes | `frontend/src/App.jsx`; local `releaseNotes` object and versioned localStorage key `release_notes_skills-matrix-v1`; Explore Skills navigates to the Profile Skills anchor. No SQL or Toastify is used for release notes. |

Relevant frontend files: `frontend/src/pages/Profile.jsx`, `frontend/src/components/ProfileSection.jsx`, `frontend/src/services/api.js`, `frontend/src/styles/Profile.css`, `frontend/src/App.jsx`, and `frontend/src/styles/App.css`.

## Dependency Mapping

### Required Feature Files

| File | Role |
|---|---|
| `backend/controllers/profileController.js` | Profile and EmployeeSkills read/write handlers. |
| `backend/controllers/skillsController.js` | Active SkillsMaster catalogue endpoint. |
| `backend/routes/profileRoutes.js` | Profile and employee-skill routes. |
| `backend/routes/skillsRoutes.js` | `/api/skills` route. |
| `frontend/src/pages/Profile.jsx` | Profile and Skills Matrix UI and client-side interactions. |
| `frontend/src/components/ProfileSection.jsx` | Collapsible profile sections; supports the Skills anchor ID. |
| `frontend/src/services/api.js` | Axios service functions for profile, skills, and catalogue APIs. |
| `frontend/src/styles/Profile.css` | Profile and Skills UI styles. |
| `SQL Quries/EmployeeProfile.sql` | Employee profile schema/sample. |
| `SQL Quries/SkillList.sql` | SkillsMaster schema/seeds. |
| `SQL Quries/Profiency_Level_table.sql` | ProficiencyLevels schema/seeds. |
| `SQL Quries/EmployeeSkillMap.sql` | EmployeeSkills schema/seeds and later alterations; requires reconciliation. |

### Shared Integration Files

| File | Integration responsibility |
|---|---|
| `backend/server.js` | Mounts `/api/profile` and `/api/skills`; preserve existing application routes. |
| `backend/config/database.js` | Existing ODBC query helpers and SQL connection; shared with all backend features, not Skills-specific. |
| `frontend/src/App.jsx` | Shared route registration, ToastContainer, and release-notes modal. Merge deliberately; do not replace the main app shell. |
| `frontend/src/styles/App.css` | Shared application and release-notes styling. |
| `frontend/package.json` / `frontend/package-lock.json` | MUI and React Toastify dependencies; reconcile lockfile during merge. |

### Optional / Not Required for Skills Matrix

- `SQL Quries/Announcemet_table.sql` and the `GET /api/profile/announcements` handler are legacy SQL-announcement functionality. The current Skills release-notes modal uses local content and localStorage; it does not require this table or API.
- Existing Header/Sidebar files are shared navigation. No new Skills-specific navigation item is needed because Skills lives on Profile.

## Integration Guide

1. **Create a staging database backup.** Confirm the target database name matches backend `DB_DATABASE` and that SQL Server/ODBC access works.
2. **Reconcile the SQL scripts before execution.** Split table DDL, constraints, audit columns, and seeds into ordered migrations. Remove or guard `TRUNCATE`, `DELETE`, `sp_rename`, unconditional duplicate constraints, and repeated `ALTER TABLE` statements.
3. **Create and seed master data.** Create `EmployeeProfile`, `SkillsMaster`, and `ProficiencyLevels`; seed proficiency IDs 1–5 and active skills before `EmployeeSkills` rows.
4. **Create `EmployeeSkills`.** Ensure the deployed column names match controller queries. Runtime code expects `ProficiencyLevel`, not a renamed `ProficiencyLevelId` column. Add FKs to both master tables and consider a unique constraint on `(EmployeeId, SkillId)`.
5. **Fix and test employee scoping.** Add `WHERE es.EmployeeId = ?` to the `getEmployeeSkills` query before integration; add authorization/ownership checks to read, update, and delete operations.
6. **Merge backend controllers and routes.** Merge `profileController.js`, `profileRoutes.js`, `skillsController.js`, and `skillsRoutes.js`; keep existing route registrations and ensure static paths do not conflict with parameter paths.
7. **Merge frontend files.** Add ProfileSection and Profile page/service/styles. Merge the Profile route into the existing App router and retain the existing shared application shell.
8. **Configure API base URLs.** Replace local-only `http://localhost:5000` service URLs with the target environment configuration; verify CORS/auth settings.
9. **Resolve employee identity.** Replace `EMPLOYEE_ID = "INT001"` in the Profile page with the main application’s authenticated employee identity source.
10. **Run verification.** Execute the QA checklist below against staging, including cross-employee isolation and duplicate/concurrency tests.
11. **Deploy.** Apply reviewed migrations, deploy backend and frontend together, smoke-test Profile and all existing dashboard routes, and monitor SQL/ODBC logs.

## Deployment Notes

- SQL table initialization is not handled by `initializeDatabase()`; apply migrations explicitly.
- The SQL scripts use `USE EmployeeEngagementRequests`; adapt to the integration environment rather than assuming this database name.
- The app’s frontend API URLs are currently local development URLs and must be environment-configured.
- Install frontend dependencies from the merged lockfile. React Toastify is used for skill-operation feedback; MUI is used for dialogs, inputs, and icons.
- Keep release-note version state independent of SQL: `release_notes_skills-matrix-v1` is stored per browser origin. Increment `RELEASE_VERSION` when publishing a new release note.

## Testing Checklist

### Database and API

- [ ] Migrations work on a clean staging database and can be safely rerun or are explicitly versioned one-time migrations.
- [ ] All five proficiency rows and expected active skill catalogue rows exist.
- [ ] Profile lookup returns the correct employee and a missing employee returns 404.
- [ ] Employee skill lookup returns only the requested employee’s assignments (currently blocked until the missing SQL filter is fixed).
- [ ] Catalogue endpoint returns only active skills with `SkillId`, `SkillName`, and `Category`.
- [ ] Add valid skill returns 201 and creates the expected row.
- [ ] Duplicate add returns 400; invalid skill/proficiency values return a deliberate 4xx response.
- [ ] Update accepts levels 1–5, rejects out-of-range levels, and returns 404 for unknown assignment IDs.
- [ ] Delete removes only an authorized employee’s assignment and handles missing IDs accurately.
- [ ] Concurrent duplicate submissions cannot create duplicate employee-skill rows.

### Frontend

- [ ] Profile loads with employee data and presents loading/error states.
- [ ] Skills render with names, category badges, proficiency indicators, and level tooltips.
- [ ] Add Skill works; required fields, success/error toasts, and duplicate handling are correct.
- [ ] Edit Skill is prepopulated, read-only for the name, and refreshes after save.
- [ ] Delete confirmation cancels safely and refreshes after successful delete.
- [ ] Search matches skill name and category, ignoring case and surrounding whitespace.
- [ ] All six sort options work; sorting occurs after search.
- [ ] Pagination shows 15 filtered/sorted items per page and resets to page 1 on search/sort changes.
- [ ] Release notes appear once for an unseen version; dismissing records the version; Explore Skills opens and scrolls to the Skills section.
- [ ] Existing Engagement Requests, Approvals, and GCC Approvals pages still work after route integration.

## Known Limitations and Release Blockers

1. **Critical: employee-skill GET is not scoped.** `getEmployeeSkills` currently omits the employee predicate and can expose every employee’s skill rows. Fix and test this before any production release.
2. **Employee identity is hard-coded.** The Profile page uses `INT001`; integration must supply the authenticated employee ID.
3. **No authentication/authorization is enforced by these handlers.** Add the main application’s access-control and employee-ownership checks, especially for update/delete.
4. **Duplicate prevention is application-only.** The read-before-insert check can race; enforce uniqueness in SQL as well.
5. **SQL scripts are not clean migrations.** Some are destructive, non-idempotent, or internally inconsistent. The `EmployeeSkillMap.sql` contains `TRUNCATE`, a column rename incompatible with runtime code, and unguarded constraints/alterations. Do not run as-is on production.
6. **Delete behavior is optimistic.** The handler does not check affected row count and does not scope deletion by employee.
7. **Profile identity/data source is basic.** There is no employee search, profile editing, or external HR data synchronization in this feature.
8. **No certifications, asset integration, team analytics, manager dashboard, or skill endorsements are implemented.**

## Future Roadmap

- Certifications Module
- Asset History Module
- Team Skills Dashboard
- Manager Skill Insights
- Skill Endorsements
- HR-system synchronization and role-based skill templates
