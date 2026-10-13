# Employee Dashboard API Documentation

**Document purpose:** Integration, maintenance, testing, and support reference  
**API style:** JSON over HTTP  
**Backend:** Express / Node.js  
**Database:** Microsoft SQL Server via ODBC

> This document describes routes currently registered in `backend/server.js` and their controller behavior. “Approvals” are operations on the Requests API; there is no separate `/api/approvals` endpoint. No unimplemented routes are included.

## Table of Contents

1. [Base URL and Conventions](#base-url-and-conventions)
2. [API Inventory](#api-inventory)
3. [System API](#system-api)
4. [Authentication and Authorization](#authentication-and-authorization)
5. [Engagement Request APIs](#engagement-request-apis)
6. [Approval Workflow APIs](#approval-workflow-apis)
7. [Audit APIs](#audit-apis)
8. [Profile APIs](#profile-apis)
9. [Skills Matrix APIs](#skills-matrix-apis)
10. [Workflow Mapping](#workflow-mapping)
11. [Database Dependencies](#database-dependencies)
12. [Validation and Error Responses](#validation-and-error-responses)
13. [Postman Testing Guide](#postman-testing-guide)
14. [Configuration and Integration Notes](#configuration-and-integration-notes)
15. [Known Limitations](#known-limitations)

## Base URL and Conventions

Local development defaults to:

```text
http://localhost:5000
```

`PORT` can override the backend listener port. The frontend service file currently hard-codes `http://localhost:5000` API roots; change these for the target environment.

- Requests and responses use JSON where a body is present.
- Send `Accept: application/json`; send `Content-Type: application/json` for JSON request bodies.
- There is no version prefix such as `/v1`.
- Route prefixes are mounted in `backend/server.js`: `/api/requests`, `/api/audit`, `/api/profile`, and `/api/skills`.
- Dates are sent as ISO date strings (`YYYY-MM-DD`) by the UI. SQL/ODBC response date serialization can vary by driver/runtime.
- Query parameters are not used by the current API routes.

## API Inventory

| Module | Method | Endpoint | Purpose |
|---|---|---|---|
| System | GET | `/` | Return the backend running message. |
| Engagement Requests | GET | `/api/requests` | List requests that are not soft-deleted. |
| Engagement Requests | POST | `/api/requests` | Create a request with a generated ENG ID. |
| Engagement Requests / Approvals | PUT | `/api/requests/:id` | Edit request fields or change workflow status/comments. |
| Engagement Requests | DELETE | `/api/requests/:id` | Soft-delete a request. |
| Audit | GET | `/api/audit/:id` | Get status history for a request ID. |
| Profile | GET | `/api/profile/:employeeId` | Fetch employee profile data. |
| Announcements | GET | `/api/profile/announcements` | Fetch active announcement rows. |
| Skills Matrix | GET | `/api/profile/skills/:employeeId` | Fetch employee skill assignments with skill/proficiency labels. |
| Skills Matrix | POST | `/api/profile/skills` | Add an employee skill assignment. |
| Skills Matrix | PUT | `/api/profile/skills/:id` | Update an assignment's proficiency. |
| Skills Matrix | DELETE | `/api/profile/skills/:id` | Delete an employee skill assignment. |
| Skills Catalogue | GET | `/api/skills` | List active skill catalogue entries. |

There is no implemented `GET /api/requests/:id` endpoint. Request detail views use the selected object from `GET /api/requests`.

## System API

### Backend Health/Root Message

- **Purpose:** Basic root response confirming the Express app is serving requests. This is not a database health check.
- **Method:** `GET`
- **Route:** `/`
- **Headers:** None required; `Accept: text/plain` is optional.
- **Path/query parameters:** None
- **Request body:** None
- **Database:** None

**Postman request:**

```http
GET http://localhost:5000/
```

**Success `200 OK`:** Plain text:

```text
Backend Running...
```

## Authentication and Authorization

**Authentication is currently not implemented.** The server configures Express and CORS but no authentication middleware. Request/profile/skills routes do not enforce employee ownership or Manager/GCC Leader roles.

The Employee, Manager, and GCC Leader selectors in the UI are client-side presentation controls, not security controls. Do not expose these APIs to production users until authentication and server-side role/ownership checks are added. Never trust `EmployeeName`, `employeeId`, or actor role supplied by the browser as proof of identity.

Future integration should derive employee identity and role from the main application's authenticated principal, and check authorization for every read and write.

## Engagement Request APIs

### List Requests

- **Purpose:** Return all Requests rows where `IsDeleted = 0`, newest first.
- **Method:** `GET`
- **Route:** `/api/requests`
- **Headers:** `Accept: application/json`
- **Path parameters:** None
- **Query parameters:** None
- **Request body:** None
- **Database:** `Requests`

**Postman request:**

```http
GET http://localhost:5000/api/requests
Accept: application/json
```

**Success `200 OK`:** Array of mapped request objects. Quarter is parsed from its database JSON string into an array when possible.

```json
[
  {
    "id": "ENG-001",
    "employee": "Asha Rao",
    "department": "Engineering",
    "category": "Workshop",
    "event": "Cloud Architecture Workshop",
    "title": "Cloud Architecture Workshop",
    "eventDate": "2026-11-12",
    "venue": "Bengaluru",
    "headcount": 20,
    "budget": 25000,
    "description": "Internal learning session",
    "quarter": ["Q4"],
    "status": "Pending Manager",
    "managerComments": "",
    "gccLeaderComments": "",
    "actionDate": null,
    "gccLeaderActionDate": null,
    "createdDate": "2026-10-08T08:00:00.000Z"
  }
]
```

**Error `500 Internal Server Error`:**

```json
{ "message": "Unable to fetch requests" }
```

### Create Request

- **Purpose:** Validate and insert a request, assign its ID from `RequestIdSequence`, and initialize status to `Pending Manager`.
- **Method:** `POST`
- **Route:** `/api/requests`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Path/query parameters:** None
- **Database:** `RequestIdSequence`, `Requests`

**Postman request:**

```http
POST http://localhost:5000/api/requests
Content-Type: application/json
Accept: application/json
```

```json
{
  "employee": "Asha Rao",
  "department": "Engineering",
  "category": "Workshop",
  "event": "Cloud Architecture Workshop",
  "eventDate": "2026-11-12",
  "venue": "Bengaluru",
  "headcount": 20,
  "budget": 25000,
  "description": "Internal learning session",
  "quarter": ["Q4"]
}
```

`event` is the normal field; the backend also accepts `title` as an alias. It stores quarter values as JSON text. The response is the newly mapped request object.

**Success `201 Created`:** Same object shape as `GET /api/requests`, with generated `id` and `status: "Pending Manager"`.

**Validation error `400 Bad Request`:**

```json
{
  "success": false,
  "errors": [
    "Employee name is required.",
    "Headcount must be greater than zero."
  ]
}
```

**Database error `500 Internal Server Error`:**

```json
{ "message": "Unable to create request" }
```

### Update Request or Workflow Status

- **Purpose:** Partial update of request fields, comments/action dates, or status. The same endpoint is used for employee edits, manager actions, and GCC actions.
- **Method:** `PUT`
- **Route:** `/api/requests/:id`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Path parameter:** `id` is the request ID (for example `ENG-001`).
- **Query parameters:** None
- **Database:** `Requests`; `RequestAudit` when the status changes.

#### Edit request fields

Send editable fields using the same schema as create. Current controller validation has an important behavior: if any editable request field is provided, it validates a complete set of fields, substituting empty defaults for omitted fields. Therefore, partial detail edits may fail validation; send the full valid detail set or fix the backend's partial-update validation before relying on patch-like updates.

#### Manager approve/reject/escalate

Approval UI sends `status`, `managerComments`, and `actionDate`.

```http
PUT http://localhost:5000/api/requests/ENG-001
Content-Type: application/json
Accept: application/json
```

```json
{
  "status": "Pending GCC Leader",
  "managerComments": "Please review the proposal.",
  "actionDate": "2026-10-08"
}
```

For direct manager approval or rejection, set `status` to `Approved` or `Rejected`.

#### GCC approve/reject

```json
{
  "status": "Approved",
  "gccLeaderComments": "Approved for the requested quarter.",
  "gccLeaderActionDate": "2026-10-08"
}
```

The backend writes a current date when the corresponding comment field is supplied and no action date is supplied. Status changes call the audit logger. The actor label is inferred from the *previous status*, not an authenticated identity.

**Success `200 OK`:** Updated mapped request object (same shape as GET).

**Validation error `400 Bad Request`:** Same `success:false, errors:[...]` structure as create.

**Invalid status transition `400 Bad Request`:**

```json
{
  "success": false,
  "message": "Invalid status transition from 'Approved' to 'Pending Manager'."
}
```

**Not found `404 Not Found`:**

```json
{ "message": "Request not found" }
```

**Database/update error `500 Internal Server Error`:**

```json
{ "message": "Unable to update request" }
```

### Delete Request (Soft Delete)

- **Purpose:** Set `IsDeleted = 1`; the row remains in SQL.
- **Method:** `DELETE`
- **Route:** `/api/requests/:id`
- **Headers:** `Accept: application/json`
- **Path parameter:** `id` request ID
- **Query/body:** None
- **Database:** `Requests`

**Postman request:** `DELETE http://localhost:5000/api/requests/ENG-001`

**Success `200 OK`:**

```json
{ "message": "Request deleted successfully" }
```

**Not found `404 Not Found`:**

```json
{ "message": "Request not found" }
```

**Database error `500 Internal Server Error`:**

```json
{ "message": "Unable to delete request" }
```

## Approval Workflow APIs

There are no separate Manager Approval or GCC Approval routes. Both use `PUT /api/requests/:id`.

### Current Status Transitions

| Current status | Allowed next status values |
|---|---|
| `Pending Manager` | `Approved`, `Rejected`, `Pending GCC Leader` |
| `Pending GCC Leader` | `Approved`, `Rejected` |
| `Approved` | No different status allowed |
| `Rejected` | No different status allowed |

Same-status updates are allowed. The manager UI can approve/reject directly, so GCC review is not mandatory for all requests. The client chooses the status string; API authorization by role is not implemented.

### Typical API Sequence

```text
POST /api/requests
  → 201 with status Pending Manager

PUT /api/requests/ENG-001
  → status Pending GCC Leader (manager escalates)

PUT /api/requests/ENG-001
  → status Approved or Rejected (GCC final decision)

GET /api/audit/ENG-001
  → status transition history
```

## Audit APIs

### Get Request Audit History

- **Purpose:** Return status-change history for the requested ID, ordered by `ActionDate DESC, AuditId DESC`.
- **Method:** `GET`
- **Route:** `/api/audit/:id`
- **Headers:** `Accept: application/json`
- **Path parameter:** `id` request ID.
- **Database:** `RequestAudit`

**Postman request:** `GET http://localhost:5000/api/audit/ENG-001`

**Success `200 OK`:**

```json
[
  {
    "AuditId": 1,
    "RequestId": "ENG-001",
    "OldStatus": "Pending Manager",
    "NewStatus": "Pending GCC Leader",
    "Comments": "Please review the proposal.",
    "ActionBy": "Manager",
    "ActionDate": "2026-10-08T08:30:00.000Z"
  }
]
```

No matching rows returns an empty array. The handler does not return 404 for an unknown request ID.

**Error `500 Internal Server Error`:**

```json
{ "message": "Unable to fetch audit history" }
```

## Profile APIs

### Get Employee Profile

- **Purpose:** Fetch one employee profile.
- **Method:** `GET`
- **Route:** `/api/profile/:employeeId`
- **Headers:** `Accept: application/json`
- **Path parameter:** `employeeId` (for example `INT001`).
- **Query/body:** None
- **Database:** `EmployeeProfile`

**Postman request:** `GET http://localhost:5000/api/profile/INT001`

**Success `200 OK`:** Raw row using PascalCase names; ODBC controls date serialization.

```json
{
  "EmployeeId": "INT001",
  "EmployeeName": "Asha Rao",
  "Designation": "Employee",
  "Email": "asha@example.com",
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

**Errors:** `404` `{ "message": "Employee profile not found" }`; `500` `{ "message": "Unable to fetch employee profile" }`.

### Get Active Announcements

- **Purpose:** Return announcement rows where `IsActive = 1`.
- **Method:** `GET`
- **Route:** `/api/profile/announcements`
- **Headers:** `Accept: application/json`
- **Path/query/body parameters:** None
- **Database:** `Announcements`

**Success `200 OK`:** Array containing `AnnouncementId`, `Title`, `Message`. The current query has no `ORDER BY` and does not return `CreatedDate`.

```json
[
  {
    "AnnouncementId": 1,
    "Title": "Skills Module Released",
    "Message": "Employees can now manage skills and competencies from Profile."
  }
]
```

**Error:** `500`; current response includes `{ "message": error.message, "details": error.odbcErrors }` rather than a stable generic message. This endpoint is separate from the frontend’s local, versioned Release Notes dialog.

## Skills Matrix APIs

### Get Skills Catalogue

- **Purpose:** List active selectable skills, ordered by name.
- **Method:** `GET`
- **Route:** `/api/skills`
- **Headers:** `Accept: application/json`
- **Path/query/body parameters:** None
- **Database:** `SkillsMaster`

**Success `200 OK`:**

```json
[
  { "SkillId": 12, "SkillName": "React", "Category": "Frontend" }
]
```

**Error `500`:** `{ "message": "Unable to fetch skills" }`.

### Get Employee Skills

- **Purpose (intended):** Return employee skill assignments joined to skill and proficiency labels.
- **Method:** `GET`
- **Route:** `/api/profile/skills/:employeeId`
- **Headers:** `Accept: application/json`
- **Path parameter:** `employeeId`.
- **Database:** `EmployeeSkills`, `SkillsMaster`, `ProficiencyLevels`

**Postman request:** `GET http://localhost:5000/api/profile/skills/INT001`

**Expected row shape based on the SELECT:**

```json
[
  {
    "EmployeeSkillId": 5,
    "SkillId": 12,
    "SkillName": "React",
    "Category": "Frontend",
    "ProficiencyLevel": 4,
    "LevelName": "Advanced",
    "Description": "Can handle complex work and mentor team members."
  }
]
```

**Critical implementation defect:** The current SQL has no `WHERE es.EmployeeId = ?` clause, although the controller supplies `req.params.employeeId` as a parameter. The endpoint therefore is not scoped to the requested employee and may return all joined employee skills. Fix this and verify tenant/employee isolation before integration.

**Error `500`:** `{ "message": "Unable to fetch employee skills" }`.

### Add Employee Skill

- **Purpose:** Insert a skill assignment for an employee.
- **Method:** `POST`
- **Route:** `/api/profile/skills`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Path/query parameters:** None
- **Database:** `EmployeeSkills`; FK to `SkillsMaster`; intended FK to `ProficiencyLevels`.

**Postman request:**

```http
POST http://localhost:5000/api/profile/skills
Content-Type: application/json
Accept: application/json
```

```json
{
  "employeeId": "INT001",
  "skillId": 12,
  "proficiencyLevel": 4
}
```

**Success `201 Created`:**

```json
{ "message": "Skill added successfully" }
```

**Errors:** `400` duplicate `{ "message": "Skill already exists for employee" }`; `500` `{ "message": "Unable to add skill" }`. There is no explicit required-field/range validation in the controller; SQL constraints/FKs may turn invalid inputs into 500 errors.

### Update Employee Skill Proficiency

- **Purpose:** Update one assignment’s proficiency.
- **Method:** `PUT`
- **Route:** `/api/profile/skills/:id`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`
- **Path parameter:** `id` is `EmployeeSkillId`.
- **Database:** `EmployeeSkills`

**Postman request:**

```http
PUT http://localhost:5000/api/profile/skills/5
Content-Type: application/json
Accept: application/json
```

```json
{ "proficiencyLevel": 5 }
```

**Success `200 OK`:**

```json
{ "message": "Skill updated successfully" }
```

**Errors:** `400` `{ "message": "Proficiency level must be between 1 and 5" }`; `404` `{ "message": "Skill not found" }`; `500` `{ "message": "Unable to update skill" }`. The controller checks numeric bounds but not integer-ness explicitly.

### Delete Employee Skill

- **Purpose:** Delete an assignment row.
- **Method:** `DELETE`
- **Route:** `/api/profile/skills/:id`
- **Headers:** `Accept: application/json`
- **Path parameter:** `id` is `EmployeeSkillId`.
- **Database:** `EmployeeSkills`

**Postman request:** `DELETE http://localhost:5000/api/profile/skills/5`

**Success `200 OK`:**

```json
{ "message": "Skill deleted successfully" }
```

**Error `500`:** `{ "message": "Unable to delete skill" }`. Current handler does not check affected row count and does not scope the delete by authenticated employee.

## Workflow Mapping

### Engagement Request

```text
GET /api/requests
  ├─ Employee form → POST /api/requests
  └─ Employee list/edit/detail uses selected list row
       ├─ edit → PUT /api/requests/:id
       └─ soft delete → DELETE /api/requests/:id
```

### Manager / GCC Approvals

```text
GET /api/requests
  └─ Client-side filters divide pending/history views
       └─ PUT /api/requests/:id with status + role comments/action date
            └─ status changed → INSERT RequestAudit
                 └─ GET /api/audit/:id for history display
```

### Profile / Skills

```text
GET /api/profile/:employeeId
GET /api/skills                 (catalogue)
GET /api/profile/skills/:employeeId (assignments; currently unscoped defect)
  ├─ POST /api/profile/skills   (add)
  ├─ PUT /api/profile/skills/:id (proficiency edit)
  └─ DELETE /api/profile/skills/:id
```

Search, filters, sorting, and pagination are client-side and do not have API endpoints.

## Error Documentation

| Status | Implemented use | Example payload |
|---:|---|---|
| `200` | Successful GET/PUT/DELETE; empty lists are `[]`. | Request-specific object/array or `{ "message": "Skill updated successfully" }`. |
| `201` | Request or skill assignment created. | Created request object or `{ "message": "Skill added successfully" }`. |
| `400` | Request validation, invalid status transition, duplicate skill, invalid proficiency. | `{ "success": false, "errors": ["..."] }` or `{ "message": "..." }`. |
| `404` | Missing request/profile/skill in handlers that check existence. | `{ "message": "Request not found" }`. |
| `409` | **Not implemented** by current controllers. Duplicate skill currently returns `400`, not `409`. |
| `500` | ODBC/database/handler failure. | Endpoint-specific `{ "message": "Unable to ..." }`; announcements currently returns raw error message/details. |

Unknown routes use Express's default not-found response; there is no custom global error middleware in the inspected server.

## Testing Guide (Postman)

Set a collection variable such as `baseUrl = http://localhost:5000`. For JSON requests, set `Content-Type: application/json`.

| Test | Method and URL | Body | Expected result |
|---|---|---|---|
| List requests | `GET {{baseUrl}}/api/requests` | None | `200`, array; verify deleted rows omitted. |
| Create request | `POST {{baseUrl}}/api/requests` | Valid create JSON shown above | `201`, generated ENG ID and Pending Manager. |
| Invalid request | `POST {{baseUrl}}/api/requests` | Omit employee or use zero headcount | `400`, `success:false`, `errors`. |
| Edit request | `PUT {{baseUrl}}/api/requests/ENG-001` | Full valid editable fields | `200`, updated mapped object. |
| Manager escalate | `PUT {{baseUrl}}/api/requests/ENG-001` | `{"status":"Pending GCC Leader","managerComments":"Review","actionDate":"2026-10-08"}` | `200`, status updated; audit row created. |
| Manager reject | `PUT {{baseUrl}}/api/requests/ENG-001` | `{"status":"Rejected","managerComments":"Declined","actionDate":"2026-10-08"}` | `200`, final status Rejected. |
| GCC approve | `PUT {{baseUrl}}/api/requests/ENG-001` | `{"status":"Approved","gccLeaderComments":"Approved","gccLeaderActionDate":"2026-10-08"}` | `200`, final status Approved. |
| Invalid transition | `PUT {{baseUrl}}/api/requests/ENG-001` | `{"status":"Pending Manager"}` from terminal status | `400`, invalid-transition message. |
| Audit history | `GET {{baseUrl}}/api/audit/ENG-001` | None | `200`, history array; unknown ID currently returns `[]`. |
| Soft delete | `DELETE {{baseUrl}}/api/requests/ENG-001` | None | `200`, message; subsequent list omits row. |
| Profile | `GET {{baseUrl}}/api/profile/INT001` | None | `200` profile object or `404`. |
| Active announcements | `GET {{baseUrl}}/api/profile/announcements` | None | `200`, active rows with ID/title/message; ordering unspecified. |
| Skill catalogue | `GET {{baseUrl}}/api/skills` | None | `200`, active skill array ordered by name. |
| Employee skills | `GET {{baseUrl}}/api/profile/skills/INT001` | None | `200`, joined skill/proficiency rows; **test fails isolation until controller filter is fixed**. |
| Add skill | `POST {{baseUrl}}/api/profile/skills` | `{"employeeId":"INT001","skillId":12,"proficiencyLevel":4}` | `201`; duplicate returns `400`. |
| Edit skill | `PUT {{baseUrl}}/api/profile/skills/5` | `{"proficiencyLevel":5}` | `200`; invalid level `400`, unknown ID `404`. |
| Delete skill | `DELETE {{baseUrl}}/api/profile/skills/5` | None | `200`, delete message. |

No API uses authentication headers today. Do not interpret this as a production authorization recommendation.

## Integration Notes

### Dependencies

- Backend: `express`, `cors`, `dotenv`, `odbc`.
- Frontend: React, React Router, Axios, AG Grid Community/Enterprise/React, Material UI. `xlsx`/AG Grid Excel export behavior depends on the current Enterprise integration/license.
- Existing frontend API service points to localhost and must be configured for target environments.

### Environment Variables

Backend reads these through dotenv:

| Variable | Purpose |
|---|---|
| `DB_DRIVER` | ODBC SQL Server driver name. |
| `DB_SERVER` | SQL Server host/instance. |
| `DB_DATABASE` | Database name. |
| `DB_TRUST_CERT` | ODBC trust-server-certificate setting. |
| `PORT` | Optional HTTP listener port; defaults to `5000`. |

The connection string uses Windows `Trusted_Connection=Yes`; deployment must provide a service identity with least-privilege SQL permissions. Never put secrets in source control.

### Database Prerequisites

- Apply reviewed SQL migrations from `SQL Quries/` in a staging environment first.
- `Requests`, `RequestIdSequence`, `RequestAudit`, and `IsDeleted` are required by runtime code.
- Keep the controller schema and SQL DDL aligned. The fallback `initializeDatabase()` schema is not equivalent to the canonical Requests script.
- Align the request ID sequence above existing IDs when migrating data.

### Future Modules

No future-module APIs should be inferred from UI roadmap/release notes. Current routes are exactly those in the API inventory; future modules require new routes/controllers and documentation when implemented.
