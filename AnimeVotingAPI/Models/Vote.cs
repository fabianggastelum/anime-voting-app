namespace AnimeVotingAPI.Models;

public class Vote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid VoterId { get; set; }
    public Guid WinnerId { get; set; }
    public Guid LoserId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

}
