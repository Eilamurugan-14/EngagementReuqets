USE EmployeeEngagementRequests;

TRUNCATE TABLE EmployeeSkills;

IF OBJECT_ID('dbo.EmployeeSkills', 'U') IS NULL
BEGIN
    CREATE TABLE EmployeeSkills
    (
        EmployeeSkillId INT IDENTITY(1,1)
        PRIMARY KEY,

        EmployeeId NVARCHAR(20)
        NOT NULL,

        SkillId INT
        NOT NULL,

        ProficiencyLevel INT
        NOT NULL,

        CreatedDate DATETIME
        NOT NULL
        DEFAULT GETDATE(),

        CONSTRAINT FK_EmployeeSkills_Skill
        FOREIGN KEY (SkillId)
        REFERENCES SkillsMaster(SkillId)
    );
END;
GO

ALTER TABLE EmployeeSkills
ADD CONSTRAINT CK_EmployeeSkills_Proficiency
CHECK (
    ProficiencyLevel BETWEEN 1 AND 5
);
GO

INSERT INTO EmployeeSkills
(
    EmployeeId,
    SkillId,
    ProficiencyLevel
)
VALUES
(
    'INT001',
    1,
    4
);

SELECT
    es.EmployeeId,
    sm.SkillName,
    es.ProficiencyLevel
FROM EmployeeSkills es
INNER JOIN SkillsMaster sm
    ON es.SkillId = sm.SkillId;

SELECT * FROM EmployeeSkills;

EXEC sp_rename
'EmployeeSkills.ProficiencyLevel',
'ProficiencyLevelId',
'COLUMN';

EXEC sp_help EmployeeSkills;

ALTER TABLE EmployeeSkills
ADD CONSTRAINT
FK_EmployeeSkills_ProficiencyLevels

FOREIGN KEY
(
    ProficiencyLevel
)

REFERENCES ProficiencyLevels
(
    ProficiencyLevelId
);

SELECT
    sm.SkillName,
     pl.ProficiencyLevelId,
    pl.LevelName,
    pl.Description
   
FROM EmployeeSkills es
INNER JOIN SkillsMaster sm
    ON es.SkillId = sm.SkillId
INNER JOIN ProficiencyLevels pl
    ON es.ProficiencyLevel = pl.ProficiencyLevelId

ALTER TABLE EmployeeSkills
ADD

CreatedBy NVARCHAR(100) NOT NULL
DEFAULT 'SYSTEM',

ModifiedBy NVARCHAR(100) NULL,

ModifiedDate DATETIME NULL;