USE EmployeeEngagementRequests;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID('dbo.EmployeeProfile', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.EmployeeProfile
    (
        EmployeeId NVARCHAR(20) NOT NULL
            CONSTRAINT PK_EmployeeProfile PRIMARY KEY CLUSTERED,
        EmployeeName NVARCHAR(150) NOT NULL,
        Designation NVARCHAR(100) NULL,
        Email NVARCHAR(255) NULL,
        DateOfJoining DATE NULL,
        Organization NVARCHAR(100) NULL,
        Gender NVARCHAR(50) NULL,
        ProjectTeam NVARCHAR(150) NULL,
        GroupName NVARCHAR(100) NULL,
        Segment NVARCHAR(100) NULL,
        HFMCode NVARCHAR(50) NULL,
        INDCostCenter NVARCHAR(50) NULL,
        USCostCenter NVARCHAR(50) NULL,
        ManagerName NVARCHAR(150) NULL,
        NextLevelManager NVARCHAR(150) NULL,
        Location NVARCHAR(100) NULL,
        CreatedDate DATETIME2(0) NOT NULL
            CONSTRAINT DF_EmployeeProfile_CreatedDate
            DEFAULT SYSUTCDATETIME(),
        ModifiedDate DATETIME2(0) NOT NULL
            CONSTRAINT DF_EmployeeProfile_ModifiedDate
            DEFAULT SYSUTCDATETIME()
    );
END;
GO

-- The primary key supports the profile lookup by EmployeeId.
-- These indexes are optional and useful for email or manager-based searches.
IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_EmployeeProfile_Email'
      AND object_id = OBJECT_ID('dbo.EmployeeProfile')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_EmployeeProfile_Email
        ON dbo.EmployeeProfile (Email)
        INCLUDE (EmployeeName)
        WHERE Email IS NOT NULL;
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_EmployeeProfile_ManagerName'
      AND object_id = OBJECT_ID('dbo.EmployeeProfile')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_EmployeeProfile_ManagerName
        ON dbo.EmployeeProfile (ManagerName)
        INCLUDE (EmployeeId, EmployeeName)
        WHERE ManagerName IS NOT NULL;
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM dbo.EmployeeProfile
    WHERE EmployeeId = N'INT001'
)
BEGIN
    INSERT INTO dbo.EmployeeProfile
    (
        EmployeeId,
        EmployeeName,
        Designation,
        Email,
        DateOfJoining,
        Organization,
        Gender,
        ProjectTeam,
        GroupName,
        Segment,
        HFMCode,
        INDCostCenter,
        USCostCenter,
        ManagerName,
        NextLevelManager,
        Location
    )
    VALUES
    (
        N'INT001',
        N'Eilamurugan S A',
        N'Intern',
        N'sa.eilamurugan.sankar@xylem.com',
        '2026-08-26',
        N'Xylem',
        N'Male',
        N'-',
        N'-',
        N'-',
        N'-',
        N'-',
        N'-',
        N'Venkateshwara Rao',
        N'Ramakrishnan Purushothaman',
        N'Chennai'
    );
END;
GO
