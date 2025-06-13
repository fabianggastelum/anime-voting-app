using System.ComponentModel.DataAnnotations;

namespace AnimeVotingAPI.Models;

public class Vote
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Required]
    public Guid VoterId { get; set; }
    [Required]
    public Guid WinnerId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

}
