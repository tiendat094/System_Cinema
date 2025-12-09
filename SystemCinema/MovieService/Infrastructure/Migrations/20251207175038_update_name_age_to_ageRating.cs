using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieService.Migrations
{
    /// <inheritdoc />
    public partial class update_name_age_to_ageRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Age",
                table: "Movies",
                newName: "AgeRating");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AgeRating",
                table: "Movies",
                newName: "Age");
        }
    }
}
