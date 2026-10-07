USE EmployeeEngagementRequests;

sp_help ProficiencyLevels;

CREATE TABLE ProficiencyLevels
(
    ProficiencyLevelId INT PRIMARY KEY,

    LevelName NVARCHAR(100)
        NOT NULL,

    Description NVARCHAR(500)
        NOT NULL
);
INSERT INTO ProficiencyLevels
(
    ProficiencyLevelId,
    LevelName,
    Description
)
VALUES

(
    1,
    'Basic Awareness',
    'Understands fundamental concepts and terminology.'
),

(
    2,
    'Beginner',
    'Can perform simple tasks with guidance.'
),

(
    3,
    'Working Knowledge',
    'Can work independently on routine tasks.'
),

(
    4,
    'Advanced',
    'Can handle complex work and mentor team members.'
),

(
    5,
    'Expert / Can Give KT',
    'Subject matter expert capable of training and guiding others.'
);


SELECT * FROM ProficiencyLevels;