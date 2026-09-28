IF OBJECT_ID('dbo.RequestAudit', 'U') IS NULL
BEGIN
    CREATE TABLE RequestAudit
    (
        AuditId INT IDENTITY(1,1) PRIMARY KEY,

        RequestId NVARCHAR(20) NOT NULL,

        OldStatus NVARCHAR(100) NOT NULL,

        NewStatus NVARCHAR(100) NOT NULL,

        Comments NVARCHAR(MAX) NULL,

        ActionBy NVARCHAR(100) NOT NULL,

        ActionDate DATETIME NOT NULL
    );
END;
GO