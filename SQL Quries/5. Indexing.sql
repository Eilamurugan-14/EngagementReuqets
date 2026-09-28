USE EmployeeEngagementRequests;

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_Requests_Status'
)
BEGIN
    CREATE INDEX IX_Requests_Status
    ON Requests(Status);
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_Requests_CreatedDate'
)
BEGIN
    CREATE INDEX IX_Requests_CreatedDate
    ON Requests(CreatedDate);
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_RequestAudit_RequestId'
)
BEGIN
    CREATE INDEX IX_RequestAudit_RequestId
    ON RequestAudit(RequestId);
END;
GO

SELECT
    name,
    type_desc
FROM sys.indexes
WHERE object_id = OBJECT_ID('Requests');

SELECT
    name,
    type_desc
FROM sys.indexes
WHERE object_id = OBJECT_ID('RequestAudit');