import {
  getPublishedDate as getPublishedDateText,
} from "./releaseNoteUtils.js";

const RETENTION_PERIOD_MS =
  7 * 24 * 60 * 60 * 1000;

function getPublishedDateValue(note) {
  const publishedDateText = getPublishedDateText(note);

  if (publishedDateText === "-") {
    return null;
  }

  const publishedDate = new Date(publishedDateText);

  return Number.isNaN(publishedDate.getTime())
    ? null
    : publishedDate;
}

export function isDeleteLocked(note) {
  const isPublished =
    Number(note?.IsPublished) === 1 ||
    note?.IsPublished === true;

  if (!isPublished) {
    return false;
  }

  const publishedDate = getPublishedDateValue(note);

  return publishedDate
    ? Date.now() - publishedDate.getTime() >
        RETENTION_PERIOD_MS
    : false;
}
