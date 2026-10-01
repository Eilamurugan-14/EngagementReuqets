USE EmployeeEngagementRequests;

IF OBJECT_ID('dbo.SkillsMaster', 'U') IS NULL
BEGIN
    CREATE TABLE SkillsMaster
    (
        SkillId INT IDENTITY(1,1)
        PRIMARY KEY,

        SkillName NVARCHAR(100)
        NOT NULL,

        Category NVARCHAR(100)
        NULL,

        IsActive BIT
        NOT NULL
        DEFAULT 1
    );
END;
GO

INSERT INTO SkillsMaster
(
    SkillName,
    Category
)
VALUES
('React', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),

('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Java', 'Backend'),
('Spring Boot', 'Backend'),
('Python', 'Backend'),

('SQL Server', 'Database'),
('MySQL', 'Database'),
('PostgreSQL', 'Database'),

('Azure', 'Cloud'),
('AWS', 'Cloud'),

('Power BI', 'Analytics'),
('Excel', 'Analytics'),

('Git', 'Tools'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps');
GO

SELECT *
FROM SkillsMaster;