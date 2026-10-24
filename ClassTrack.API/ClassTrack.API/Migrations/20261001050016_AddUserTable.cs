using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF OBJECT_ID(N'[dbo].[Users]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Users]
                    (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [Username] nvarchar(max) NOT NULL,
                        [PasswordHash] nvarchar(max) NOT NULL,
                        [Role] nvarchar(max) NOT NULL,
                        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
                    );
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
