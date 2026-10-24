using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                IF OBJECT_ID(N'[dbo].[Fees]', N'U') IS NULL
                BEGIN
                    CREATE TABLE [dbo].[Fees]
                    (
                        [Id] int IDENTITY(1,1) NOT NULL,
                        [StudentId] int NOT NULL,
                        [Amount] decimal(18,2) NOT NULL,
                        [PaymentDate] datetime2 NOT NULL,
                        [PaymentStatus] nvarchar(max) NOT NULL,
                        CONSTRAINT [PK_Fees] PRIMARY KEY ([Id])
                    );
                END
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fees");
        }
    }
}
