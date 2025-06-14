using AnimeVotingAPI.Data;
using AnimeVotingAPI.Models;
using AnimeVotingAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnimeVotingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly IJikanService _jikanService;
        private readonly AppDbContext _context;

        public ImportController(IJikanService jikanService, AppDbContext context)
        {
            _jikanService = jikanService;
            _context = context;
        }

        [HttpPost("{animeId}")]
        public async Task<IActionResult> ImportCharacters(int animeId)
        {
            // Fetch anime title from external Jikan API.
            var animeTitle = await _jikanService.GetAnimeTitleAsync(animeId);
            if (string.IsNullOrEmpty(animeTitle))
            {
                return NotFound($"Anime with ID {animeId} not found.");
            }
            // Fetch characters from external Jikan API
            var characters = await _jikanService.GetCharactersAsync(animeId);
            // Check if characters are null or empty
            if (characters == null || characters.Length == 0)
            {
                return NotFound($"No characters found for anime ID {animeId}");
            }
            
            // Convert JikanCharacter to my local Character entity.
            foreach (var jc in characters)
            {
                // Prevent duplicates (check if the character already exists by name and anime).
                var exists = await _context.Characters.AnyAsync(c => c.Name == jc.Name && c.Anime == jc.Anime);
                if (!exists)
                {
                    var character = new Character
                    {
                        Id = Guid.NewGuid(),
                        Name = jc.Name ?? "",
                        Anime = animeTitle,
                        ImageUrl = jc.Images?.Jpg?.ImageUrl ?? ""
                    };

                    _context.Characters.Add(character);
                }
            }

            // Save all new characters to database
            await _context.SaveChangesAsync();
            
            return Ok($"Imported {characters.Length} characters from anime ID {animeTitle}");

        }
    }
}
