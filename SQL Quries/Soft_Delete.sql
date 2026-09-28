USE EmployeeEngagementRequests;

ALTER TABLE Requests
ADD IsDeleted BIT
CONSTRAINT DF_Requests_IsDeleted DEFAULT 0;

SELECT
    Id,
    IsDeleted
FROM Requests
WHERE Id = 'ENG-003';

SELECT COUNT(*)
FROM Requests
WHERE IsDeleted = 1;

SELECT COLUMN_NAME
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Requests';

UPDATE Requests
SET IsDeleted = 0
WHERE IsDeleted IS NULL;

SELECT TOP 10
    Id,
    IsDeleted
FROM Requests;