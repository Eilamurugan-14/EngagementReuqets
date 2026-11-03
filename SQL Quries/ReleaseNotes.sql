USE EmployeeEngagementRequests;

CREATE TABLE XopsReleaseNotes
(
    ReleaseNoteId INT IDENTITY(1,1)
        PRIMARY KEY,

    Title NVARCHAR(200)
        NOT NULL,

    Version NVARCHAR(50)
        NOT NULL,

    Summary NVARCHAR(MAX)
        NULL,

    ContentJson NVARCHAR(MAX)
        NOT NULL,

    IsPublished BIT
        NOT NULL DEFAULT 0,

    PublishedDate DATETIME
        NULL,

    CreatedBy NVARCHAR(100)
        NOT NULL,

    CreatedDate DATETIME
        NOT NULL DEFAULT GETDATE(),

    ModifiedBy NVARCHAR(100)
        NULL,

    ModifiedDate DATETIME
        NULL
);

INSERT INTO XopsReleaseNotes
(
    Title,
    Version,
    Summary,
    ContentJson,
    CreatedBy
)
VALUES
(
    'Skills Matrix',
    '1.0',
    'Skills Matrix module released.',
    '[]',
    'Eila'
);

ALTER TABLE XopsReleaseNotes
DROP COLUMN ContentJson;

ALTER TABLE XopsReleaseNotes
ADD ContentJson NVARCHAR(MAX) NULL;

SELECT  *
FROM XopsReleaseNotes;

sp_help XopsReleaseNotes

ALTER TABLE XopsReleaseNotes
ADD PublishedDateText NVARCHAR(50) NULL;

UPDATE XopsReleaseNotes
SET PublishedDateText =
  CONVERT(
    VARCHAR(50),
    PublishedDate,
    106
  )
WHERE PublishedDate IS NOT NULL;