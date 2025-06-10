using System.ComponentModel.DataAnnotations;

namespace AnimeVotingAPI.DTOs;

public class RegisterUserDto
{
    [Required]
    [MinLength(2, ErrorMessage = "Username must be between 2 and 15 characters long.")]
    [MaxLength(15, ErrorMessage = "Username must be between 2 and 15 characters long.")]
    [RegularExpression(@"^[^\p{P}\p{Sm}]*$", ErrorMessage = "Username must not contain special characters.")]
    public string Username {  get; set; } = string.Empty;
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
    public string Password { get; set; } = string.Empty;
}
