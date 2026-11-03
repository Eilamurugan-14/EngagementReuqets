# Release Notes Feature

## Overview

The release notes feature lets administrators create, preview, publish, edit, and delete release notes. Employees can see the newest published note in a popup and browse published notes from the header notification menu.

The feature is implemented across:

- `frontend/src/pages/ReleaseNotesAdmin.jsx` and `frontend/src/components/grids/ReleaseNotesGrid.jsx` — administration and list.
- `frontend/src/components/ReleaseNotePopup.jsx` — automatic latest-note popup.
- `frontend/src/components/Header.jsx` and `frontend/src/components/ReleaseNotePreviewDialog.jsx` — notification feed and note preview.
- `frontend/src/components/ReleaseNotePreview.jsx` — shared note renderer.
- `frontend/src/services/api.js` — frontend API calls.
- `backend/routes/releaseNotesRoutes.js` and `backend/controllers/releaseNotesController.js` — REST endpoints.
- `SQL Quries/ReleaseNotes.sql` — SQL Server table script.

## Administrator workflow

The `/release-notes` route opens the Admin Panel. The administrator can search the grid, add a note, preview it, edit it, delete it, and toggle its publish status. The grid displays title, version, status, published date, creator, and creation date.

The editor accepts:

- Release title, version, and summary.
- Release type: Major Release, Minor Release, Hotfix, or Announcement.
- Target audiences: All Employees, HR, Managers, and Engineering.
- Optional visible sections: summary, features, benefits, improvements, known issues, and action required.
- Feature, benefit, improvement, and known-issue items as newline-separated text.

An editor preview uses the same renderer as the employee-facing views. Saving creates or updates a row in `XopsReleaseNotes`; new notes are drafts by default. Publishing changes `IsPublished` and adds or updates a published-date entry in `ContentJson`.

## Employee workflow

### Latest-note popup

`ReleaseNotePopup` is mounted globally in `App.jsx`. On mount, it requests the latest published note. If a note exists and its `release_note_<ReleaseNoteId>` key is absent from browser `localStorage`, the popup opens.

- **Acknowledge / close icon:** stores `"seen"` for that note in local storage and closes the popup.
- **View Later, Escape, or backdrop close:** closes the popup without storing an acknowledgement. The popup can therefore appear again on a later app mount until acknowledged.
- The popup only requests the latest published note; older notes are available from the notification menu.

### Header notification feed

The notification menu requests all published notes in descending `ReleaseNoteId` order, shows an unread count and note summaries, and opens a selected note in a preview dialog. Opening a note marks it read using `read_release_note_<ReleaseNoteId>`. Read markers are stored in browser `localStorage`.

The menu also displays an Announcements tab and a “View Release History” footer, but announcements are not implemented and the history footer currently has no navigation action.

## Note content and storage

The SQL Server table stores note metadata (`Title`, `Version`, `Summary`, publication status, creator, and dates) plus the structured `ContentJson` payload. The editor serializes blocks such as:

| Block type | Stored values |
|---|---|
| `publishedInfo` | Published date text |
| `visibility` | Sections to display |
| `releaseType` | Selected release type |
| `audience` | Selected target audiences |
| `summary` | Summary content |
| `features`, `benefits`, `improvements`, `knownIssues` | Arrays of text items |
| `actionRequired` | Action text |

`ReleaseNotePreview` renders the title, version, published date, summary, and content sections. A missing visibility block defaults to all supported sections. Although release type and audience are stored by the editor, the preview does not currently display them, and audience selection does not restrict which employees receive a note.

## API

The backend mounts these endpoints under `/api/release-notes`:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | List all notes for the admin grid. |
| `POST` | `/` | Create a draft note. |
| `GET` | `/published` | List all published notes for the notification feed. |
| `GET` | `/latest-published` | Return the published note with the greatest `ReleaseNoteId`, or `null`. |
| `PUT` | `/:id` | Update a note. |
| `DELETE` | `/:id` | Delete a note. |
| `PATCH` | `/:id/publish` | Toggle publication status. |

## Current limitations and future enhancements

The following are recommendations based on the current implementation; they are not existing behavior.

### Priority 1 — Correctness and access control

1. **Protect administrative operations.** Add authentication and administrator authorization for create, update, delete, publish, and the all-notes endpoint. The release-note routes currently show no route-level authorization middleware.
2. **Use one employee-specific read state.** Replace the two local-storage key formats with one read/acknowledgement model. Persist read state by authenticated employee (and note ID) if it should follow the employee across browsers and devices. Decide whether acknowledging the popup should also mark the notification-feed item as read.
3. **Validate and version `ContentJson`.** Validate request fields and block shapes on the server, handle malformed stored JSON without crashing the UI, and define a versioned payload contract for future editor changes.
4. **Keep publication metadata consistent.** The publish handler changes `IsPublished` and `ContentJson`, but does not update the table's `PublishedDate` column. Set and clear the canonical date consistently and use it in the grid and employee views.

### Priority 2 — Complete the employee experience

5. **Implement release history navigation.** Make “View Release History” open a history page or route with published notes, search/filter, and pagination.
6. **Enforce audience targeting.** Resolve the employee's role or group and filter the published feed and latest-note popup accordingly. Until then, treat audience selections as informational only.
7. **Make publication timing explicit.** Add publish/unpublish actions rather than a single toggle, prevent accidental publication, and consider scheduled publication and expiration.
8. **Improve popup delivery and dismissal.** Decide whether “View Later” should defer redisplay for a defined period, prevent repeated popups across tabs, and support notifying the user when a newer note arrives while the app remains open.
9. **Finish or remove the Announcements tab.** Connect it to an announcements data source and workflow, or hide the disabled tab until that feature exists.

### Priority 3 — Maintainability and quality

10. **Add API and UI tests.** Cover CRUD, publication transitions, invalid or legacy JSON, latest-note ordering, acknowledgement, read counts, and audience filtering.
11. **Improve error feedback and observability.** Replace console-only error handling with user-visible messages for failed loads/saves and structured server logging.
12. **Review migration scripts.** Keep the SQL script safe to rerun and aligned with the runtime schema; review its existing `ALTER TABLE ... DROP COLUMN ContentJson` statement before using it as a deployment migration.
13. **Improve accessibility and localization.** Verify keyboard and screen-reader behavior for dialogs and notification menus, and centralize user-facing text and date formatting.
