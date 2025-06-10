using System.ComponentModel.DataAnnotations;

namespace AnimeVotingAPI.Models;


public class User
{
    [Key]
    public Guid ID { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
}
