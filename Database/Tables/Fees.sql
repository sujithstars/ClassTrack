-- ClassTrack Database
-- Fees Table

CREATE TABLE Fees
(
Id INT IDENTITY(1,1) PRIMARY KEY,
StudentId INT NOT NULL,
Amount DECIMAL(18,2) NOT NULL,
PaymentDate DATETIME2 NOT NULL,
PaymentStatus NVARCHAR(20) NOT NULL,
CONSTRAINT FK_Fees_Students
FOREIGN KEY (StudentId) REFERENCES Students(Id)
);
