using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieService.Migrations
{
    /// <inheritdoc />
    public partial class update_schema_db : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Perfomer",
                table: "Movies",
                newName: "Director");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Director",
                table: "Movies",
                newName: "Perfomer");
        }
    }
}
