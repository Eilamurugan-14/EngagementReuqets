IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_Budget'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_Budget
    CHECK (
        Budget > 0
        AND Budget <= 10000000
    );
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_Headcount'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_Headcount
    CHECK (
        Headcount > 0
    );
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_Status'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_Status
    CHECK (
        Status IN
        (
            'Pending Manager',
            'Pending GCC Leader',
            'Approved',
            'Rejected'
        )
    );
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_EmployeeName'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_EmployeeName
    CHECK (
        LEN(LTRIM(RTRIM(EmployeeName))) > 0
    );
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_EventTitle'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_EventTitle
    CHECK (
        LEN(LTRIM(RTRIM(EventTitle))) > 0
    );
END;
GO


IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_Category'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_Category
    CHECK (
        LEN(LTRIM(RTRIM(Category))) > 0
    );
END;
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.check_constraints
    WHERE name = 'CK_Requests_Venue'
)
BEGIN
    ALTER TABLE Requests
    ADD CONSTRAINT CK_Requests_Venue
    CHECK (
        LEN(LTRIM(RTRIM(Venue))) > 0
    );
END;
GO