using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuthService.Migrations
{
    /// <inheritdoc />
    public partial class update_schema_AuthService_version2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Token",
                table: "RefresherToken",
                newName: "RefreshToken");

            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "AuthUsers",
                newName: "Name");

            migrationBuilder.AddColumn<DateTime>(
                name: "IssuedAt",
                table: "RefresherToken",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IssuedAt",
                table: "RefresherToken");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "RefresherToken",
                newName: "Token");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "AuthUsers",
                newName: "UserName");
        }
    }
}
