export function getReleaseNoteContent(note) {
  if (!note?.ContentJson) {
    return [];
  }

  try {
    const content = JSON.parse(note.ContentJson);

    return Array.isArray(content) ? content : [];
  } catch {
    return [];
  }
}

function getContentBlock(note, blockType) {
  return getReleaseNoteContent(note).find(
    (block) => block.type === blockType
  ) || null;
}

export function getPublishedDate(note) {
  const isDraft =
    note?.IsPublished !== undefined &&
    note?.IsPublished !== null &&
    !(
      note.IsPublished === true ||
      Number(note.IsPublished) === 1
    );

  if (isDraft) {
    return "-";
  }

  const publishedInfo = getContentBlock(
    note,
    "publishedInfo"
  );

  return typeof publishedInfo?.value === "string" &&
    publishedInfo.value.trim()
    ? publishedInfo.value
    : "-";
}

export function getReleaseType(note) {
  const releaseType = getContentBlock(note, "releaseType")?.value;

  return typeof releaseType === "string" && releaseType.trim()
    ? releaseType
    : "-";
}

export function getReleaseAudience(note) {
  const audience = getContentBlock(note, "audience")?.value;

  if (Array.isArray(audience)) {
    const audiences = audience.filter(
      (item) => typeof item === "string" && item.trim()
    );

    return audiences.length ? audiences.join(", ") : "-";
  }

  return typeof audience === "string" && audience.trim()
    ? audience
    : "-";
}
