function ReleaseNotePreview({
  releaseNote,
}) {

  const content =
    releaseNote?.ContentJson
      ? JSON.parse(
          releaseNote.ContentJson
        )
      : [];

  return (
    <>
      <section className="preview-section">

        <h3 className="preview-section-title">
          Summary
        </h3>

        <div className="preview-summary">
          {releaseNote?.Summary}
        </div>

      </section>

      {content.find(
        block =>
          block.type === "features"
      )?.items?.length > 0 && (

        <section className="preview-section">

          <h3 className="preview-section-title">
            ✨ Features
          </h3>

          <div className="preview-list">

            {content
              .find(
                block =>
                  block.type === "features"
              )
              .items.map(item => (

                <div
                  key={item}
                  className="preview-list-item"
                >
                  ✓ {item}
                </div>

              ))}

          </div>

        </section>

      )}

      {content.find(
        block =>
          block.type === "benefits"
      )?.items?.length > 0 && (

        <section className="preview-section">

          <h3 className="preview-section-title">
            🎯 Benefits
          </h3>

          <div className="preview-list">

            {content
              .find(
                block =>
                  block.type === "benefits"
              )
              .items.map(item => (

                <div
                  key={item}
                  className="preview-list-item"
                >
                  ✓ {item}
                </div>

              ))}

          </div>

        </section>

      )}

    </>
  );
}

export default ReleaseNotePreview;