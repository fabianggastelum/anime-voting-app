namespace AnimeVotingAPI.DTOs
{
    // This DTO is used to send character data to the frontend without exposing internal DB info.
    public class CharacterDto
    {
        // Publicly exposed ID of the character
        public Guid Id { get; set; }
        // Name of the character
        public string Name { get; set; } = string.Empty;
        // Title of the show the character belongs to
        public string Anime { get; set; } = string.Empty;
        // Image URL to display the character picture
        public string ImageUrl { get; set; } = string.Empty;
        // Number of votes this character has received
        public int Votes { get; set; } = 0;

    }
}
