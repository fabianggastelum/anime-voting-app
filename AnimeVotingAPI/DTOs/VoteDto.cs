namespace AnimeVotingAPI.DTOs
{
    // This DTO represents a vote cast by a user.
    public class VoteDto
    {
        // ID of the voter
        public Guid Id { get; set; }
        // Id of the character who received the vote.
        public Guid Winner {  get; set; }
        // Timestamp of when the vote ocurred
        public DateTime Timestamp { get; set; }
    }
}
