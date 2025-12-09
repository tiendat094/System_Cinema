using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieService.Migrations
{
    /// <inheritdoc />
    public partial class update_properties_in_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Capacity",
                table: "Rooms",
                newName: "Type");

            migrationBuilder.AddColumn<int>(
                name: "SeatStatus",
                table: "Seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Rooms",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateAt",
                table: "Rooms",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "TrainerUrl",
                table: "Movies",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Backdropurl",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cast",
                table: "Movies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OriginalTitle",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "subtitles",
                table: "Movies",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CinemaStatus",
                table: "Cinemas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Cinemas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Cinemas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Cinemas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<List<string>>(
                name: "Facilities",
                table: "Cinemas",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<List<string>>(
                name: "Imgaes",
                table: "Cinemas",
                type: "text[]",
                nullable: false);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Cinemas",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Cinemas",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OpeningHours",
                table: "Cinemas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Cinemas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "Cinemas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalRooms",
                table: "Cinemas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalSeats",
                table: "Cinemas",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeatStatus",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "UpdateAt",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Backdropurl",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "Cast",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "OriginalTitle",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "subtitles",
                table: "Movies");

            migrationBuilder.DropColumn(
                name: "CinemaStatus",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Facilities",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Imgaes",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "TotalRooms",
                table: "Cinemas");

            migrationBuilder.DropColumn(
                name: "TotalSeats",
                table: "Cinemas");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Rooms",
                newName: "Capacity");

            migrationBuilder.AlterColumn<string>(
                name: "TrainerUrl",
                table: "Movies",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
