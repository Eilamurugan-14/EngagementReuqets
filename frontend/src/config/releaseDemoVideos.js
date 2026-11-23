import skillMatrixDemoVideo from "../../videos/Employee Skills Matrix and Workforce Competency Enhancement Platform.webm";

export const releaseDemoVideos = {
  "Skill Matrix": skillMatrixDemoVideo,
  "Skills Matrix": skillMatrixDemoVideo,
};

export function getReleaseDemoVideoUrl(title) {
  if (typeof title !== "string") {
    return null;
  }

  const normalizedTitle = title.trim().toLowerCase();
  const matchingVideo = Object.entries(releaseDemoVideos).find(
    ([releaseTitle]) =>
      normalizedTitle.includes(releaseTitle.toLowerCase())
  );

  return matchingVideo?.[1] || null;
}
