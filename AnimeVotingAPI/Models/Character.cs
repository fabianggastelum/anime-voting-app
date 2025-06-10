using System.ComponentModel.DataAnnotations;

namespace AnimeVotingAPI.Models;

public class Character
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Anime { get; set; } = string.Empty;

    [Required]
    [Url]
    public string ImageUrl { get; set; } = string.Empty;
}
