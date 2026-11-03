import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
function ReleaseNotePreview({
  releaseNote,
  onClose,
}) {

  const content =
    releaseNote?.ContentJson
      ? JSON.parse(
          releaseNote.ContentJson
        )
      : [];

  const publishedInfo =
    content.find(
      block =>
        block.type ===
        "publishedInfo"
    );

  const visibilityBlock =
    content.find(
      block =>
        block.type ===
        "visibility"
    );

const visibleSections =
  visibilityBlock?.sections || [
    "summary",
    "features",
    "benefits",
    "improvements",
    "knownIssues",
    "actionRequired",
  ];

  const features =
    content.find(
      block =>
        block.type ===
        "features"
    )?.items || [];

  const benefits =
    content.find(
      block =>
        block.type ===
        "benefits"
    )?.items || [];

  const improvements =
    content.find(
      block =>
        block.type ===
        "improvements"
    )?.items || [];

  const knownIssues =
    content.find(
      block =>
        block.type ===
        "knownIssues"
    )?.items || [];

  const actionRequired =
    content.find(
      block =>
        block.type ===
        "actionRequired"
    )?.content || "";

  return (
    <>

     <div className="release-preview-header">

  <div className="release-preview-header-row">

    <div className="release-preview-badge">
      🚀 What's New
    </div>

    {onClose && (
      <IconButton
        size="small"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    )}

  </div>

        <h2 className="release-preview-title">
          {releaseNote?.Title ||
            "Release Title"}
        </h2>

        <div className="release-preview-version">
          Version {
            releaseNote?.Version ||
            "1.0"
          }
        </div>

        {publishedInfo?.value && (

          <div className="release-preview-date">
            Published on{" "}
            {publishedInfo.value}
          </div>

        )}

      </div>

      {visibleSections.includes(
        "summary"
      ) &&
        releaseNote?.Summary && (

        <section className="preview-section">

          <div className="preview-title-row">
            <DescriptionOutlinedIcon
              fontSize="small"
            />
            Summary
          </div>

          <div className="preview-summary">
            {releaseNote.Summary}
          </div>

        </section>

      )}

      {visibleSections.includes(
        "features"
      ) &&
        features.length > 0 && (

        <section className="preview-section">

          <div className="preview-title-row">
            <AutoAwesomeOutlinedIcon
              fontSize="small"
            />
            Features
          </div>

          <div className="preview-list">

            {features.map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

          </div>

        </section>

      )}

      {visibleSections.includes(
        "benefits"
      ) &&
        benefits.length > 0 && (

        <section className="preview-section">

          <div className="preview-title-row">
            <EmojiEventsOutlinedIcon
              fontSize="small"
            />
            Benefits
          </div>

          <div className="preview-list">

            {benefits.map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

          </div>

        </section>

      )}

      {visibleSections.includes(
        "improvements"
      ) &&
        improvements.length > 0 && (

        <section className="preview-section">

          <div className="preview-title-row">
            <TrendingUpOutlinedIcon
              fontSize="small"
            />
            Improvements
          </div>

          <div className="preview-list">

            {improvements.map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

          </div>

        </section>

      )}

      {visibleSections.includes(
        "knownIssues"
      ) &&
        knownIssues.length > 0 && (

        <section className="preview-section">

          <div className="preview-title-row">
            <WarningAmberOutlinedIcon
              fontSize="small"
            />
            Known Issues
          </div>

          <div className="preview-list">

            {knownIssues.map(item => (

              <div
                key={item}
                className="preview-list-item"
              >
                • {item}
              </div>

            ))}

          </div>

        </section>

      )}

      {visibleSections.includes(
        "actionRequired"
      ) &&
        actionRequired && (

        <section className="preview-section">

          <div className="preview-title-row">
            <AssignmentTurnedInOutlinedIcon
              fontSize="small"
            />
            Action Required
          </div>

          <div
            className="preview-summary"
            style={{
              borderLeft:
                "4px solid #007DA3",
            }}
          >
            {actionRequired}
          </div>

        </section>

      )}

    </>
  );
}

export default ReleaseNotePreview;