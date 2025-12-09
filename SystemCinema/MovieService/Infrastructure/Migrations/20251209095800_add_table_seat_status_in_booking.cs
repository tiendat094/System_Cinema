using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieService.Migrations
{
    /// <inheritdoc />
    public partial class add_table_seat_status_in_booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeatStatus",
                table: "Seats");

            migrationBuilder.CreateTable(
                name: "SeatsStatusInShowTimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ShowTimeId = table.Column<Guid>(type: "uuid", nullable: false),
                    SeatId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeatsStatusInShowTimes", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SeatsStatusInShowTimes");

            migrationBuilder.AddColumn<int>(
                name: "SeatStatus",
                table: "Seats",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
