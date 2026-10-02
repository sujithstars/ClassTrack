-- ClassTrack Database
-- Teachers Table

CREATE TABLE Teachers
(
Id INT IDENTITY(1,1) PRIMARY KEY,
TeacherName NVARCHAR(100) NOT NULL,
Mobile NVARCHAR(20) NOT NULL,
Subject NVARCHAR(100) NOT NULL
);
