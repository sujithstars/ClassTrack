-- ClassTrack Database
-- Attendance Table

CREATE TABLE Attendance
(
Id INT IDENTITY(1,1) PRIMARY KEY,
StudentId INT NOT NULL,
AttendanceDate DATETIME2 NOT NULL,
Status NVARCHAR(20) NOT NULL,
CONSTRAINT FK_Attendance_Students
FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
