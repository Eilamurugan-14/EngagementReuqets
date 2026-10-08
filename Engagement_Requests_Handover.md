# Engagement Requests Feature Handover

**Audience:** Main Employee Dashboard integration team  
**Feature:** Engagement Requests, Manager Approval, GCC Leader Approval, and audit history  
**Backend:** Express / Node.js / ODBC  
**Database:** SQL Server; SQL scripts target `EmployeeEngagementRequests`

> **Integration blockers:** The backend currently has no authentication/role authorization, and the auto-created `Requests` table in `database.js` does not match the canonical SQL schema/controller. Do not expose this feature in production until both are resolved. Details are in [Known Limitations](#known-limitations-and-release-blockers).

## Feature Overview

Engagement Requests lets employees submit event or engagement proposals, managers review them, and GCC Leaders review requests escalated to them. The feature tracks request status, manager/GCC comments, action dates, and status-change audit history. Requests can be soft-deleted and displayed in employee, manager, and GCC views.

## Business Purpose

The feature standardizes the request-and-approval process for employee engagement activities. It records the event details, expected headcount, budget, selected quarter(s), approval decisions, and comments in one workflow.

### Users and Typical Workflow

The UI presents Employee, Manager, and GCC Leader views. These are currently client-side role selectors, not authenticated authorization boundaries.

```text
Employee
  ↓ Create request
Pending Manager
  ├─ Manager approves ───────────────→ Approved (final)
  ├─ Manager rejects ────────────────→ Rejected (final)
  └─ Manager escalates ──────────────→ Pending GCC Leader
                                          ├─ GCC approves → Approved (final)
                                          └─ GCC rejects  → Rejected (final)
```

- **Request creation:** Employee fills the request form. The backend assigns an `ENG-###` ID and starts status at `Pending Manager`.
- **Manager approval:** Manager can approve directly, reject, or escalate to GCC Leader. Manager comments and action date are submitted through the status-update endpoint.
- **Manager rejection:** Manager sends status `Rejected`; the request becomes terminal.
- **GCC Leader approval:** GCC can act on `Pending GCC Leader` requests and sends status `Approved` with GCC comments/action date.
- **GCC Leader rejection:** GCC sends status `Rejected` with optional comments/action date.
- **Status tracking:** Status appears in grids and detail modals. Status changes are written to `RequestAudit` and shown in Approval History.

## Architecture Overview

```text
React pages and modals
  ├─ Employee request list/form and AG Grid
  ├─ Manager approval/history and AG Grid
  └─ GCC approval/history, KPIs, export, and AG Grid
          ↓ Axios (frontend/src/services/api.js)
Express routes (/api/requests, /api/audit)
          ↓
requestController.js / auditController.js
          ↓
requestValidator.js / statusValidator.js / auditLogger.js
          ↓
config/database.js (ODBC helpers)
          ↓
SQL Server Requests, RequestAudit, RequestIdSequence
```

The client loads request lists with `GET /api/requests`; details are opened from the selected row. Status changes use `PUT /api/requests/:id`; there are no separate manager/GCC action routes. Audit history is fetched from `/api/audit/:id`.

## Database Changes

### Database Objects

| Object | Purpose | Primary key | Important fields / relationships |
|---|---|---|---|
| `Requests` | Engagement request and current workflow state. | `Id` (`NVARCHAR(20)`) | EmployeeName, Department, Category, EventTitle, EventDate, Venue, Headcount, Budget, Description, Quarter, Status, ManagerComments, GCCLeaderComments, CreatedDate, ManagerActionDate, GCCLeaderActionDate, IsDeleted. |
| `RequestIdSequence` | Generates numeric request IDs. | SQL Server sequence | Backend formats each value as `ENG-` plus a minimum three-digit number. |
| `RequestAudit` | Records status transitions and comments. | `AuditId` (`INT IDENTITY`) | RequestId, OldStatus, NewStatus, Comments, ActionBy, ActionDate. An index exists on RequestId; the supplied DDL does not define an FK to Requests. |

`Requests.Id` is the main request key. `RequestAudit.RequestId` is a logical reference; add a foreign key if the target retention/deletion policy permits. No other reference tables are required for the current form: department, category, quarter, and status choices are currently frontend/server constants.

### Constraints and Indexes

`SQL Quries/3. Create_Constraints_Column.sql` adds checks for:

- `Budget > 0 AND Budget <= 10000000`
- `Headcount > 0`
- Status in `Pending Manager`, `Pending GCC Leader`, `Approved`, `Rejected`
- Nonblank EmployeeName, EventTitle, Category, and Venue

`SQL Quries/5. Indexing.sql` creates:

- `IX_Requests_Status` on `Requests(Status)`
- `IX_Requests_CreatedDate` on `Requests(CreatedDate)`
- `IX_RequestAudit_RequestId` on `RequestAudit(RequestId)`

### Required SQL Scripts and Order

Run against a backed-up staging database first. The scripts assume `EmployeeEngagementRequests` unless changed for the target environment.

| Order | Script | Dependency / purpose |
|---:|---|---|
| 1 | `SQL Quries/0. Create_Requests_table.sql` | Creates Requests. |
| 2 | `SQL Quries/1. Create_Sequence_ID.sql` | Creates RequestIdSequence before request creation is used. |
| 3 | `SQL Quries/2. Create_Audit_table.sql` | Creates RequestAudit before status changes are processed. |
| 4 | `SQL Quries/3. Create_Constraints_Column.sql` | Adds check constraints to Requests. |
| 5 | `SQL Quries/4. Soft_Delete.sql` | Adds/backfills IsDeleted. |
| 6 | `SQL Quries/5. Indexing.sql` | Adds list/audit indexes; run after the tables exist. |

No request rows are required to deploy. Use representative test requests only in nonproduction. Before applying on a database with existing ENG IDs, ensure `RequestIdSequence` will not generate an ID already present in `Requests`.

**Critical schema note:** `backend/config/database.js` has a fallback `CREATE TABLE Requests` with columns such as `employee`, `event`, and `status`, and no `IsDeleted`. The controller and canonical SQL script expect `EmployeeName`, `EventTitle`, `Status`, `IsDeleted`, and other canonical columns. On a clean database, the fallback table can be created first and then request APIs fail. Use reviewed SQL migrations as the source of truth; update or remove the fallback initializer before integrating into a fresh database.

## API Documentation

Base URL in local development: `http://localhost:5000`. Frontend URLs are hard-coded in `frontend/src/services/api.js`; make them environment-configurable in the main application.

### `GET /api/requests`

Returns all non-soft-deleted requests ordered by CreatedDate descending, then ID descending. There is **no** `GET /api/requests/:id` endpoint; detail modals use the selected request row.

**Request body:** None.

**Success `200 OK` example:**

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

**Error:** `500` `{ "message": "Unable to fetch requests" }`.

### `POST /api/requests`

Creates a request. The server allocates the ID, stores Quarter as JSON text, and starts at `Pending Manager`.

**Request body:**

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

**Success:** `201 Created`, response is the mapped request object (same shape as GET).

**Validation error `400`:**

```json
{
  "success": false,
  "errors": ["Headcount must be greater than zero."]
}
```

**Database error:** `500` `{ "message": "Unable to create request" }`.

### `PUT /api/requests/:id`

Updates request fields and/or status. This is the endpoint used by employee edits, manager actions, and GCC Leader actions.

**Employee edit request body:** same editable fields as POST.

**Manager escalation:**

```json
{
  "status": "Pending GCC Leader",
  "managerComments": "Please review the proposal.",
  "actionDate": "2026-10-08"
}
```

**Manager approval or rejection:** set `status` to `Approved` or `Rejected` and include `managerComments` and `actionDate`.

**GCC approval/rejection:**

```json
{
  "status": "Approved",
  "gccLeaderComments": "Approved for the requested quarter.",
  "gccLeaderActionDate": "2026-10-08"
}
```

**Success:** `200 OK`, returns the updated mapped request object.

**Errors:** `400` validation error or invalid transition; `404` `{ "message": "Request not found" }`; `500` `{ "message": "Unable to update request" }`.

Current transition validator allows:

| Current status | Allowed next statuses |
|---|---|
| Pending Manager | Approved, Rejected, Pending GCC Leader |
| Pending GCC Leader | Approved, Rejected |
| Approved | None |
| Rejected | None |

Same-status updates are allowed. The endpoint does not authorize the action by role.

### `DELETE /api/requests/:id`

Soft-deletes a request by setting IsDeleted to 1; it does not physically delete the row.

**Request body:** None.

**Success:** `200 OK` `{ "message": "Request deleted successfully" }`.

**Errors:** `404` `{ "message": "Request not found" }`; `500` `{ "message": "Unable to delete request" }`.

### `GET /api/audit/:id`

Returns status audit history for the request, newest first. Used by Manager and GCC request detail modals.

**Request body:** None. Example: `GET /api/audit/ENG-001`.

**Success `200 OK` example:**

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

**Error:** `500` `{ "message": "Unable to fetch audit history" }`.

## Frontend Documentation

| Feature | Files / behavior |
|---|---|
| Employee request list | `frontend/src/pages/EngagementRequests.jsx`; fetches request list and provides New/Edit/View modal actions. |
| Request form/details | `frontend/src/components/RequestModal.jsx`; create/edit/view modes; editing is populated from selected list item. |
| Request list grid | `frontend/src/components/grids/EmployeeGrid.jsx`; AG Grid, quick search, pagination, status and edit/view actions. |
| Manager approvals | `frontend/src/pages/ApprovalRequests.jsx`; pending manager tab, history tab, search/year/quarter/department/status filters, KPI-independent list, Excel export. |
| Manager decision/details | `frontend/src/components/ApprovalModal.jsx`; manager comments, Approve/Reject/Escalate actions, audit history. |
| GCC approvals | `frontend/src/pages/GCCApprovalRequests.jsx`; pending/history tabs, filters, KPI cards, Excel export. |
| GCC decision/details | `frontend/src/components/GCCApprovalModal.jsx`; read-only view for Pending Manager, comments and Approve/Reject for Pending GCC Leader, audit history. |
| Approval grids | `frontend/src/components/grids/ManagerApprovalGrid.jsx`, `GCCApprovalGrid.jsx`; AG Grid tables, paging, status display. |
| KPI cards | `frontend/src/components/KPICards.jsx`; totals by status and approved budget summary for GCC view. |
| Search and filters | Employee grid quick filter; manager/GCC filters are client-side on ID, employee, department, category, event, event year, quarter, department, and status. |
| Validation | `frontend/src/utils/validation.js` gives field-level validation, touched state, date minimum, numeric limits, quarter and description checks. |
| Excel export | `frontend/src/utils/exportExcel.js`; uses AG Grid Enterprise Excel export and generates dated filenames. A valid Enterprise license is required for production use. |
| API service | `frontend/src/services/api.js`; `getRequests`, `createRequest`, `updateRequest`, `deleteRequest`, `getAuditHistory`. |

The current `userType` drop-downs are presentation controls. They do not establish identity or secure the backend.

## Dependency Mapping

### Required Feature Files

**Backend**

- `backend/controllers/requestController.js`
- `backend/routes/requestRoutes.js`
- `backend/controllers/auditController.js`
- `backend/routes/auditRoutes.js`
- `backend/utils/requestValidator.js`
- `backend/utils/statusValidator.js`
- `backend/utils/auditLogger.js`

**SQL**

- `SQL Quries/0. Create_Requests_table.sql`
- `SQL Quries/1. Create_Sequence_ID.sql`
- `SQL Quries/2. Create_Audit_table.sql`
- `SQL Quries/3. Create_Constraints_Column.sql`
- `SQL Quries/4. Soft_Delete.sql`
- `SQL Quries/5. Indexing.sql`

**Frontend**

- `frontend/src/pages/EngagementRequests.jsx`
- `frontend/src/pages/ApprovalRequests.jsx`
- `frontend/src/pages/GCCApprovalRequests.jsx`
- `frontend/src/components/RequestModal.jsx`
- `frontend/src/components/ApprovalModal.jsx`
- `frontend/src/components/GCCApprovalModal.jsx`
- `frontend/src/components/grids/EmployeeGrid.jsx`
- `frontend/src/components/grids/ManagerApprovalGrid.jsx`
- `frontend/src/components/grids/GCCApprovalGrid.jsx`
- `frontend/src/components/KPICards.jsx`
- `frontend/src/services/api.js`
- `frontend/src/utils/validation.js`
- `frontend/src/utils/exportExcel.js`
- `frontend/src/styles/EngagementRequests.css`
- `frontend/src/styles/ApprovalRequests.css`
- `frontend/src/styles/GCCApprovalRequests.css`
- `frontend/src/styles/RequestModal.css`
- `frontend/src/styles/RequestTable.css`
- `frontend/src/styles/EmployeeGrid.css`
- `frontend/src/styles/ManagerApprovalGrid.css`
- `frontend/src/styles/GCCApprovalGrid.css`

### Shared Files

- `backend/config/database.js`: SQL Server ODBC and query helper; shared, and its fresh-install fallback schema must be reconciled.
- `backend/server.js`: route mounting and middleware; merge routes rather than replacing the server.
- `frontend/src/App.jsx`: route registration and application shell.
- `frontend/src/styles/App.css`: shared layout styling.
- `frontend/src/components/Header.jsx`, `Sidebar.jsx`: shared shell/navigation; preserve existing routes and layout.
- `frontend/src/main.jsx`, `frontend/src/styles/global.css`: app bootstrap and global styles.
- `frontend/package.json` / lockfile: React, Axios, AG Grid, and MUI dependencies; reconcile with the destination app’s versions.

### Optional / Legacy Files

- `frontend/src/components/RequestTable.jsx`, `ApprovalTable.jsx`, `GCCApprovalTable.jsx`: legacy table components; current pages use the AG Grid components instead.
- `postman/collections/x_Ops Employee Dashboard - Requests/POST.request.yaml`, `Update.request.yaml`, and `AUDIT.request.yaml`: useful request examples, not runtime dependencies.
- Existing request mocks/specs can be integrated if the target team uses those test artifacts.

## Integration Guide

1. **Inventory the destination app.** Confirm route ownership, auth/identity provider, database name, and whether the app already has equivalent request/audit tables.
2. **Back up and migrate SQL.** Apply the six request scripts in the order above on staging. Review table/column definitions first; do not rely on the Node initializer for a clean database.
3. **Synchronize sequence state.** If Requests already has IDs, ensure `RequestIdSequence` starts above the largest existing ENG number to avoid primary-key collisions.
4. **Configure SQL Server access.** Set backend environment values (`DB_DRIVER`, `DB_SERVER`, `DB_DATABASE`, `DB_TRUST_CERT`) in the target secret/config system. Do not commit secrets.
5. **Merge backend logic.** Merge request/audit controllers, routes, validators, status validator, and audit logger. Keep existing app middleware and route mounts.
6. **Add authorization before exposure.** Derive employee and role from authenticated identity; enforce ownership and role checks in every read/write action. Do not trust the UI role dropdown or employee name from request body.
7. **Merge frontend pages/components.** Add the three pages, form/detail modals, AG Grid components, KPI cards, validation, export utility, and styles. Register the routes in the existing React Router tree.
8. **Configure API endpoints.** Replace hard-coded localhost URLs in `services/api.js` with environment-configured base URLs and verify CORS.
9. **Resolve Excel export licensing.** Verify AG Grid Enterprise license and allowed deployment usage before enabling export in production.
10. **Fix and test blockers.** At minimum add the EmployeeId predicate to the skills query (if Skills is also merged), fix Requests fallback schema, enforce server authorization, and make audit/status updates transactional.
11. **Run QA and smoke tests.** Follow the checklist below in staging, including each workflow path and existing dashboard pages.
12. **Deploy in coordinated order.** Database migrations first, then backend, then frontend; monitor API and SQL logs after rollout.

## Workflow Diagram

```text
Employee
  │ Submit request (POST /api/requests)
  ▼
Pending Manager
  ├── Manager approves ─────────────────────────► Approved (final)
  ├── Manager rejects ──────────────────────────► Rejected (final)
  └── Manager escalates (Pending GCC Leader)
             │
             ▼
       Pending GCC Leader
          ├── GCC Leader approves ───────────────► Approved (final)
          └── GCC Leader rejects ────────────────► Rejected (final)

Each status transition is intended to append a RequestAudit record.
```

## Testing Checklist

### Database and API

- [ ] Requests table has canonical columns, IsDeleted, constraints, and expected indexes.
- [ ] RequestIdSequence produces an ID that does not collide with existing requests.
- [ ] RequestAudit is present before any status-change API is exercised.
- [ ] GET returns only nondeleted rows, newest first.
- [ ] POST with valid fields returns 201, generated ENG ID, and Pending Manager status.
- [ ] POST invalid employee/category/title/date/venue/headcount/budget/quarter is rejected with 400 errors.
- [ ] PUT edit updates request details without changing the status unexpectedly.
- [ ] Manager transitions Pending Manager to Approved, Rejected, and Pending GCC Leader.
- [ ] GCC transitions Pending GCC Leader to Approved and Rejected.
- [ ] Invalid transitions return 400; unknown IDs return 404.
- [ ] Manager and GCC comments/action dates persist as expected.
- [ ] Status changes add RequestAudit entries with old/new status, actor label, comments, and date.
- [ ] Audit history is ordered newest first and renders in both detail modals.
- [ ] DELETE sets IsDeleted=1; GET no longer returns that row; the row remains in SQL for audit/retention.
- [ ] Search and year/quarter/department/status filters work in Manager and GCC views.
- [ ] Employee quick search works across configured grid fields.
- [ ] Excel export includes expected columns, date formats, and filename; Enterprise license is valid.

### UI and Regression

- [ ] Employee can create, edit, and view a request.
- [ ] Employee sees validation messages and cannot submit invalid form data.
- [ ] Manager can open a pending request, add comments, approve, reject, or escalate.
- [ ] GCC sees Pending Manager items read-only and can act on Pending GCC Leader items.
- [ ] Event History tabs display terminal/escalated history according to their configured status lists.
- [ ] Export success/failure notification appears.
- [ ] Existing Profile/Skills routes remain available after app-shell integration.

## Audit and Security

| Field / behavior | Current implementation |
|---|---|
| Request CreatedDate | Set by backend on create; no CreatedBy column exists in the supplied Requests schema. |
| ManagerActionDate | Set during updates when `managerComments` is supplied; manager UI sends `actionDate`. |
| GCCLeaderActionDate | Set during updates when `gccLeaderComments` is supplied; GCC UI sends `gccLeaderActionDate`. |
| RequestAudit.ActionBy | Inferred from the request’s previous status (`Manager` or `GCC Leader`), not from authenticated identity. |
| RequestAudit.ActionDate | Generated by auditLogger in Asia/Kolkata local time. |
| ModifiedBy / ModifiedDate | Not columns on Requests in the supplied request schema. Audit is append-only per status transition; comments-only edits are not audited. |
| Authorization | No backend authentication/authorization is implemented in these handlers. Role dropdowns are client-side only. |

**Production requirement:** Integrate with the main app’s identity provider. Enforce who can read a request, who owns/edit-submits it, and whether the actor is a Manager or GCC Leader. Derive ActionBy from authenticated claims, not from request status. Consider recording every change, not only status changes, and execute update + audit insert in a database transaction.

## Known Limitations and Release Blockers

1. **Fresh database initializer mismatch:** `database.js` creates a fallback Requests table with columns that do not match `requestController.js` and omits IsDeleted. A database initialized only by this fallback will not support the request APIs. Use/fix canonical migrations.
2. **No authorization:** APIs do not enforce employee ownership or Manager/GCC roles. This is a production blocker for employee data and budget information.
3. **Audit is not transactional:** request update occurs before `logAudit`; if audit insert fails, the status may change while the API returns 500 and no audit row exists.
4. **Duplicate manager audit request:** `ApprovalModal.jsx` currently requests audit history twice when opening a request, and the first call is outside its error handler. Remove the duplicate call before integration.
5. **No details endpoint:** frontend dialogs use a selected row from GET list; there is no GET-by-ID endpoint.
6. **CreatedBy is absent:** Requests has no CreatedBy; EmployeeName is submitted by the client and cannot be trusted as identity.
7. **Audit coverage is limited:** only status changes produce RequestAudit records; comments-only or detail edits are not captured.
8. **Date/time handling:** CreatedDate uses ISO UTC input while auditLogger formats an Asia/Kolkata local timestamp. Align and standardize timezone handling across services.
9. **Status/UI label mismatch:** manager history includes the label `Escalated to GCC Leader`, while stored status is `Pending GCC Leader`; ensure filters/labels use a deliberate mapping.
10. **Direct manager final decisions:** the manager UI permits direct Approved/Rejected statuses, so GCC review is not mandatory in every workflow.
11. **No email/Teams notifications, bulk approvals, workflow automation, or unified reporting.**
12. **AG Grid Enterprise dependency:** Excel export requires a valid Enterprise license; the current environment has emitted a missing-license warning.
13. **Request form department/category choices are fixed in the frontend.** There is no admin-managed lookup/catalog API.

## Future Roadmap

- Email and Microsoft Teams notifications on submit, escalation, approval, rejection, and due dates.
- Authenticated role/ownership enforcement and configurable approval chains.
- Bulk approvals with explicit audit logging.
- Approval dashboard, SLA tracking, department/budget analytics, and scheduled reports.
- Export formats and templates controlled by policy and a valid AG Grid Enterprise license.
- Configurable departments, categories, quarters, budgets, and approver mappings.
- Workflow automation, reminders, delegation, and escalation rules.
- Complete audit coverage and request revision history.
