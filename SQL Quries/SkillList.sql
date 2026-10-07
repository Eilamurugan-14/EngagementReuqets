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


SELECT *
FROM SkillsMaster;

ALTER TABLE SkillsMaster
ADD CONSTRAINT UQ_SkillsMaster_SkillName
UNIQUE (SkillName);

DELETE FROM SkillsMaster;


INSERT INTO SkillsMaster (SkillName, Category)
VALUES

-- Frontend
('HTML', 'Frontend'),
('CSS', 'Frontend'),
('JavaScript', 'Frontend'),
('TypeScript', 'Frontend'),
('React', 'Frontend'),
('Next.js', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Redux', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Bootstrap', 'Frontend'),
('Material UI', 'Frontend'),
('jQuery', 'Frontend'),
('SASS', 'Frontend'),
('Webpack', 'Frontend'),
('Vite', 'Frontend'),
('Responsive Design', 'Frontend'),
('Accessibility', 'Frontend'),
('PWA', 'Frontend'),


-- Backend
('Node.js', 'Backend'),
('Express.js', 'Backend'),
('Java', 'Backend'),
('Spring Boot', 'Backend'),
('Python', 'Backend'),
('Django', 'Backend'),
('Flask', 'Backend'),
('FastAPI', 'Backend'),
('C#', 'Backend'),
('.NET', 'Backend'),
('ASP.NET Core', 'Backend'),
('PHP', 'Backend'),
('Laravel', 'Backend'),
('Ruby', 'Backend'),
('Ruby on Rails', 'Backend'),
('Go', 'Backend'),
('Rust', 'Backend'),
('GraphQL', 'Backend'),
('REST API', 'Backend'),
('Microservices', 'Backend'),

-- Database
('SQL Server', 'Database'),
('MySQL', 'Database'),
('PostgreSQL', 'Database'),
('Oracle Database', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Cassandra', 'Database'),
('DynamoDB', 'Database'),
('SQLite', 'Database'),
('Cosmos DB', 'Database'),
('Database Design', 'Database'),
('Stored Procedures', 'Database'),
('Query Optimization', 'Database'),
('Indexing', 'Database'),
('ETL', 'Database'),

-- Cloud
('Microsoft Azure', 'Cloud'),
('AWS', 'Cloud'),
('Google Cloud Platform', 'Cloud'),
('Azure Functions', 'Cloud'),
('AWS Lambda', 'Cloud'),
('Azure App Service', 'Cloud'),
('Azure Storage', 'Cloud'),
('Azure DevOps', 'Cloud'),
('Cloud Architecture', 'Cloud'),
('Cloud Security', 'Cloud'),
('Serverless Computing', 'Cloud'),
('Azure Kubernetes Service', 'Cloud'),
('Amazon EC2', 'Cloud'),
('Amazon S3', 'Cloud'),
('Azure Active Directory', 'Cloud'),

-- DevOps
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('Terraform', 'DevOps'),
('Jenkins', 'DevOps'),
('GitHub Actions', 'DevOps'),
('GitLab CI/CD', 'DevOps'),
('Azure Pipelines', 'DevOps'),
('Ansible', 'DevOps'),
('Helm', 'DevOps'),
('Prometheus', 'DevOps'),
('Grafana', 'DevOps'),
('Linux Administration', 'DevOps'),
('Shell Scripting', 'DevOps'),
('CI/CD', 'DevOps'),
('Infrastructure as Code', 'DevOps'),

-- Testing
('Manual Testing', 'Testing'),
('Automation Testing', 'Testing'),
('Selenium', 'Testing'),
('Playwright', 'Testing'),
('Cypress', 'Testing'),
('JUnit', 'Testing'),
('TestNG', 'Testing'),
('Postman', 'Testing'),
('API Testing', 'Testing'),
('Performance Testing', 'Testing'),
('Load Testing', 'Testing'),
('Security Testing', 'Testing'),
('Regression Testing', 'Testing'),
('UAT', 'Testing'),
('Quality Assurance', 'Testing'),

-- Data & Analytics
('Power BI', 'Analytics'),
('Tableau', 'Analytics'),
('Excel', 'Analytics'),
('Advanced Excel', 'Analytics'),
('Data Visualization', 'Analytics'),
('Data Analysis', 'Analytics'),
('SQL Analytics', 'Analytics'),
('SSRS', 'Analytics'),
('SSIS', 'Analytics'),
('Data Warehousing', 'Analytics'),
('Business Intelligence', 'Analytics'),
('Dashboard Development', 'Analytics'),
('ETL Development', 'Analytics'),
('Data Modeling', 'Analytics'),
('Reporting', 'Analytics'),

-- AI & ML
('Machine Learning', 'AI'),
('Deep Learning', 'AI'),
('Natural Language Processing', 'AI'),
('Computer Vision', 'AI'),
('Generative AI', 'AI'),
('OpenAI', 'AI'),
('Prompt Engineering', 'AI'),
('LangChain', 'AI'),
('TensorFlow', 'AI'),
('PyTorch', 'AI'),
('Scikit-Learn', 'AI'),
('LLMs', 'AI'),
('RAG', 'AI'),
('AI Agents', 'AI'),
('MLOps', 'AI'),

-- Microsoft Ecosystem
('Power Apps', 'Microsoft'),
('Power Automate', 'Microsoft'),
('SharePoint', 'Microsoft'),
('Microsoft Teams', 'Microsoft'),
('Copilot Studio', 'Microsoft'),
('Dynamics 365', 'Microsoft'),
('Office 365', 'Microsoft'),
('Microsoft Fabric', 'Microsoft'),
('Dataverse', 'Microsoft'),
('Power Pages', 'Microsoft'),
('Microsoft Graph', 'Microsoft'),
('Azure Logic Apps', 'Microsoft'),
('Teams Development', 'Microsoft'),
('Exchange Online', 'Microsoft'),
('Entra ID', 'Microsoft'),

-- Security
('Cyber Security', 'Security'),
('Identity Management', 'Security'),
('OAuth', 'Security'),
('JWT', 'Security'),
('Network Security', 'Security'),
('Penetration Testing', 'Security'),
('Application Security', 'Security'),
('SIEM', 'Security'),
('SOC Operations', 'Security'),
('Threat Modeling', 'Security'),

-- Project & Agile
('Agile', 'Project Management'),
('Scrum', 'Project Management'),
('Kanban', 'Project Management'),
('Project Management', 'Project Management'),
('JIRA', 'Project Management'),
('Confluence', 'Project Management'),
('Risk Management', 'Project Management'),
('Stakeholder Management', 'Project Management'),
('Release Management', 'Project Management'),
('Change Management', 'Project Management'),

-- Soft Skills
('Communication', 'Soft Skills'),
('Leadership', 'Soft Skills'),
('Problem Solving', 'Soft Skills'),
('Critical Thinking', 'Soft Skills'),
('Presentation Skills', 'Soft Skills'),
('Negotiation', 'Soft Skills'),
('Mentoring', 'Soft Skills'),
('Team Collaboration', 'Soft Skills'),
('Time Management', 'Soft Skills'),
('Decision Making', 'Soft Skills'),

-- Mobile
('Android Development', 'Mobile'),
('iOS Development', 'Mobile'),
('Flutter', 'Mobile'),
('React Native', 'Mobile'),
('Swift', 'Mobile'),
('Kotlin', 'Mobile'),
('Mobile Testing', 'Mobile'),
('Xamarin', 'Mobile'),
('Ionic', 'Mobile'),
('Mobile UI Design', 'Mobile'),

-- ERP & Enterprise
('SAP', 'ERP'),
('SAP ABAP', 'ERP'),
('SAP HANA', 'ERP'),
('Oracle ERP', 'ERP'),
('Workday', 'ERP'),
('Salesforce', 'ERP'),
('ServiceNow', 'ERP'),
('CRM Administration', 'ERP'),
('ERP Integration', 'ERP'),
('Business Process Management', 'ERP');


INSERT INTO SkillsMaster
(
    SkillName,
    Category
)
VALUES

-- Mechanical Engineering
('AutoCAD', 'Mechanical'),
('SolidWorks', 'Mechanical'),
('CATIA', 'Mechanical'),
('Creo', 'Mechanical'),
('Mechanical Design', 'Mechanical'),
('Product Design', 'Mechanical'),
('Sheet Metal Design', 'Mechanical'),
('GD&T', 'Mechanical'),
('Tolerance Stack-Up Analysis', 'Mechanical'),
('Hydraulics', 'Mechanical'),
('Pneumatics', 'Mechanical'),
('Thermodynamics', 'Mechanical'),
('Heat Transfer', 'Mechanical'),
('Machine Design', 'Mechanical'),
('Finite Element Analysis', 'Mechanical'),

-- Manufacturing
('Lean Manufacturing', 'Manufacturing'),
('Six Sigma', 'Manufacturing'),
('Kaizen', 'Manufacturing'),
('5S Methodology', 'Manufacturing'),
('Process Improvement', 'Manufacturing'),
('Production Planning', 'Manufacturing'),
('Value Stream Mapping', 'Manufacturing'),
('Root Cause Analysis', 'Manufacturing'),
('Capacity Planning', 'Manufacturing'),
('Manufacturing Operations', 'Manufacturing'),

-- Quality
('Quality Management', 'Quality'),
('ISO 9001', 'Quality'),
('APQP', 'Quality'),
('PPAP', 'Quality'),
('SPC', 'Quality'),
('MSA', 'Quality'),
('8D Problem Solving', 'Quality'),
('Internal Auditing', 'Quality'),
('Supplier Quality Management', 'Quality'),
('Corrective and Preventive Actions', 'Quality'),

-- Electrical
('PLC Programming', 'Electrical'),
('SCADA', 'Electrical'),
('Control Systems', 'Electrical'),
('Instrumentation', 'Electrical'),
('Electrical Design', 'Electrical'),
('Motor Control Systems', 'Electrical'),
('VFD Configuration', 'Electrical'),
('Electrical Safety', 'Electrical'),
('Power Distribution Systems', 'Electrical'),
('Industrial Automation', 'Electrical'),

-- General Engineering
('Engineering Change Management', 'Engineering'),
('Failure Analysis', 'Engineering'),
('Design Review', 'Engineering'),
('Technical Documentation', 'Engineering'),
('Requirements Management', 'Engineering'),
('Continuous Improvement', 'Engineering'),
('Risk Assessment', 'Engineering'),
('Engineering Standards', 'Engineering'),
('Technical Drawing Interpretation', 'Engineering');

SELECT * from SkillsMaster; 

SELECT
    Category,
    COUNT(*) AS SkillCount
FROM SkillsMaster
GROUP BY Category
ORDER BY Category;

ALTER TABLE SkillsMaster
ADD

CreatedBy NVARCHAR(100) NOT NULL
DEFAULT 'SYSTEM',

CreatedDate DATETIME NOT NULL
DEFAULT GETDATE(),

ModifiedBy NVARCHAR(100) NULL,

ModifiedDate DATETIME NULL;