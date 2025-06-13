using AnimeVotingAPI.Data;
using AnimeVotingAPI.DTOs;
using AnimeVotingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnimeVotingAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CharactersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CharactersController (AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Character>>> getCharacters()
        {
            var characters = await _context.Characters.ToListAsync();

            // Convert each Character entity into a CharacterDto
            var characterDtos = characters.Select(c => new CharacterDto
            {
                Id = c.Id,
                Name = c.Name,
                Anime = c.Anime,
                ImageUrl = c.ImageUrl,
                Votes = _context.Votes.Count(v => v.WinnerId == c.Id) // This counts the votes for each character
            });
            return Ok(characterDtos);
        }
    }
}
