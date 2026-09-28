IF OBJECT_ID('dbo.Requests', 'U') IS NULL
BEGIN
    CREATE TABLE Requests
    (
        Id NVARCHAR(20) PRIMARY KEY,

        EmployeeName NVARCHAR(100) NOT NULL,

        Department NVARCHAR(100) NOT NULL,

        Category NVARCHAR(100) NOT NULL,

        EventTitle NVARCHAR(255) NOT NULL,

        EventDate DATE NOT NULL,

        Venue NVARCHAR(255) NOT NULL,

        Headcount INT NOT NULL,

        Budget DECIMAL(18,2) NOT NULL,

        Description NVARCHAR(MAX) NULL,

        Quarter NVARCHAR(MAX) NOT NULL,

        Status NVARCHAR(100) NOT NULL
            CONSTRAINT DF_Requests_Status
            DEFAULT 'Pending Manager',

        ManagerComments NVARCHAR(MAX) NULL,

        GCCLeaderComments NVARCHAR(MAX) NULL,

        CreatedDate DATETIME NOT NULL,

        ManagerActionDate DATETIME NULL,

        GCCLeaderActionDate DATETIME NULL
    );
END;
GO