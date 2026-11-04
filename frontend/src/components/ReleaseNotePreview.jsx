import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { getPublishedDate, getReleaseNoteContent, getReleaseType } from "../utils/releaseNoteUtils";
import ReleaseNoteSection from "./ReleaseNoteSection";
import "../styles/ReleaseNoteExperience.css";

function ReleaseNotePreview({
  releaseNote,
  publishedDate,
  onClose,
}) {
  const content = getReleaseNoteContent(releaseNote);
  const displayedPublishedDate =
    publishedDate ?? getPublishedDate(releaseNote);
  const releaseType = getReleaseType(releaseNote);

  const visibilityBlock = content.find(
    (block) => block.type === "visibility"
  );
  const visibleSections = visibilityBlock?.sections || [
    "summary",
    "features",
    "benefits",
    "improvements",
    "knownIssues",
    "actionRequired",
  ];

  const features = content.find(
    (block) => block.type === "features"
  )?.items || [];
  const benefits = content.find(
    (block) => block.type === "benefits"
  )?.items || [];
  const improvements = content.find(
    (block) => block.type === "improvements"
  )?.items || [];
  const knownIssues = content.find(
    (block) => block.type === "knownIssues"
  )?.items || [];
  const actionRequired = content.find(
    (block) => block.type === "actionRequired"
  )?.content || "";
  const sectionsToDisplay = new Set(visibleSections);

  if (knownIssues.length > 0) {
    sectionsToDisplay.add("knownIssues");
  }

  if (actionRequired) {
    sectionsToDisplay.add("actionRequired");
  }

  const sections = [
    {
      key: "summary",
      title: "Summary",
      icon: DescriptionOutlinedIcon,
      content: releaseNote?.Summary,
    },
    {
      key: "features",
      title: "Features",
      icon: AutoAwesomeOutlinedIcon,
      items: features,
    },
    {
      key: "benefits",
      title: "Benefits",
      icon: EmojiEventsOutlinedIcon,
      items: benefits,
    },
    {
      key: "improvements",
      title: "Improvements",
      icon: TrendingUpOutlinedIcon,
      items: improvements,
    },
    {
      key: "knownIssues",
      title: "Known Issues",
      icon: WarningAmberOutlinedIcon,
      items: knownIssues,
    },
    {
      key: "actionRequired",
      title: "Action Required",
      icon: AssignmentTurnedInOutlinedIcon,
      content: actionRequired,
      emphasis: true,
    },
  ];

  return (
    <div className="release-note-preview">
      <header className="release-note-sticky-header">
        <div className="release-note-header-copy">
          <div className="release-note-eyebrow">
            <span aria-hidden="true">🚀</span>
            <span>What&apos;s New</span>
          </div>
          <h2 className="release-note-title">
            {releaseNote?.Title || "Release Title"}
          </h2>
          <div className="release-note-meta">
            <span className="release-note-version">
              Version {releaseNote?.Version || "1.0"}
            </span>
            {releaseType !== "-" && (
              <span className="release-note-type">{releaseType}</span>
            )}
            {releaseNote && displayedPublishedDate !== "-" && (
              <span className="release-note-date">
                Published {displayedPublishedDate}
              </span>
            )}
          </div>
        </div>
        {onClose && (
          <IconButton
            className="release-note-close"
            aria-label="Close release note"
            onClick={onClose}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </header>

      <div className="release-note-sections">
        {sections.map((section) => (
          sectionsToDisplay.has(section.key) && (
            <ReleaseNoteSection
              key={section.key}
              title={section.title}
              icon={section.icon}
              content={section.content}
              items={section.items}
              emphasis={section.emphasis}
            />
          )
        ))}
      </div>
    </div>
  );
}

export default ReleaseNotePreview;
