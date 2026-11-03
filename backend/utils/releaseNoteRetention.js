const RETENTION_PERIOD_MS =
  7 * 24 * 60 * 60 * 1000;

function getPublishedDate(note) {
  if (note?.ContentJson) {
    try {
      const content = JSON.parse(note.ContentJson);
      const publishedInfo = content.find(
        (block) => block.type === "publishedInfo"
      );
      const publishedDate = new Date(
        publishedInfo?.value
      );

      if (!Number.isNaN(publishedDate.getTime())) {
        return publishedDate;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function isDeleteLocked(note) {
  const isPublished =
    Number(note?.IsPublished) === 1 ||
    note?.IsPublished === true;

  if (!isPublished) {
    return false;
  }

  const publishedDate = getPublishedDate(note);

  return publishedDate
    ? Date.now() - publishedDate.getTime() >
        RETENTION_PERIOD_MS
    : false;
}

module.exports = {
  isDeleteLocked,
};
