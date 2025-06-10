using System.ComponentModel.DataAnnotations;

namespace AnimeVotingAPI.DTOs;

public class LoginUserDto
{
    [Required]
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
