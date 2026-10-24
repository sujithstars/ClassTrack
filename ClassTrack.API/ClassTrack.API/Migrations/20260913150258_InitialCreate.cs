using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF OBJECT_ID(N'[dbo].[Students]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Students]
                    (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [StudentName] nvarchar(max) NOT NULL,
                        [ParentName] nvarchar(max) NOT NULL,
                        [Mobile] nvarchar(max) NOT NULL,
                        [Class] nvarchar(max) NOT NULL,
                        CONSTRAINT [PK_Students] PRIMARY KEY ([Id])
                    );
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
