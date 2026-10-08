USE EmployeeEngagementRequests;

CREATE TABLE Announcements
(
    AnnouncementId INT IDENTITY(1,1)
        PRIMARY KEY,

    Title NVARCHAR(200)
        NOT NULL,

    Message NVARCHAR(MAX)
        NOT NULL,

    IsActive BIT
        NOT NULL
        DEFAULT 1,

    CreatedBy NVARCHAR(100)
        NOT NULL,

    CreatedDate DATETIME
        NOT NULL
        DEFAULT GETDATE(),

    ModifiedBy NVARCHAR(100)
        NULL,

    ModifiedDate DATETIME
        NULL
);

INSERT INTO Announcements
(
    Title,
    Message,
    IsActive,
    CreatedBy
)
VALUES
(
    'Skills Module Released',

    'Employees can now manage skills and competencies directly from the Profile page.',

    1,

    'SYSTEM'
);

SELECT
    AnnouncementId,
    Title,
    Message,
    CreatedDate
FROM Announcements
WHERE IsActive = 1
ORDER BY CreatedDate DESC;

SELECT SCHEMA_NAME(schema_id) AS TableSchema
FROM sys.tables
WHERE name = N'Announcements';