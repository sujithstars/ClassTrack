using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF OBJECT_ID(N'[dbo].[Teachers]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Teachers]
                    (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [TeacherName] nvarchar(max) NOT NULL,
                        [Mobile] nvarchar(max) NOT NULL,
                        [Subject] nvarchar(max) NOT NULL,
                        CONSTRAINT [PK_Teachers] PRIMARY KEY ([Id])
                    );
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Teachers");
        }
    }
}
