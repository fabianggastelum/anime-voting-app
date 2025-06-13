using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeVotingAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLoserIdFromVoteProperly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoserId",
                table: "Votes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "LoserId",
                table: "Votes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
