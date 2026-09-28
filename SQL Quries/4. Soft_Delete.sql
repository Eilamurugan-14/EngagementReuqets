IF COL_LENGTH('Requests', 'IsDeleted') IS NULL
BEGIN
    ALTER TABLE Requests
    ADD IsDeleted BIT
    CONSTRAINT DF_Requests_IsDeleted
    DEFAULT 0;
END;
GO

UPDATE Requests
SET IsDeleted = 0
WHERE IsDeleted IS NULL;
GO
