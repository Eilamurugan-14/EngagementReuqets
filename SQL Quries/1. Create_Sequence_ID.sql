IF NOT EXISTS (
    SELECT *
    FROM sys.sequences
    WHERE name = 'RequestIdSequence'
)
BEGIN
    CREATE SEQUENCE RequestIdSequence
    AS INT
    START WITH 1
    INCREMENT BY 1;
END;
GO