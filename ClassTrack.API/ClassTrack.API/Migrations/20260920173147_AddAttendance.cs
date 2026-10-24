using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF OBJECT_ID(N'[dbo].[Attendances]', N'U') IS NULL
                   AND OBJECT_ID(N'[dbo].[Attendance]', N'U') IS NOT NULL
                BEGIN
                    EXEC sp_rename N'[dbo].[Attendance]', N'Attendances';
                END

                IF OBJECT_ID(N'[dbo].[Attendances]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Attendances]
                    (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [StudentId] int NOT NULL,
                        [AttendanceDate] datetime2 NOT NULL,
                        [Status] nvarchar(max) NOT NULL,
                        CONSTRAINT [PK_Attendances] PRIMARY KEY ([Id])
                    );
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Attendances");
        }
    }
}
