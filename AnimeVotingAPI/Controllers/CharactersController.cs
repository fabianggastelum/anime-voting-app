using AnimeVotingAPI.Data;
using AnimeVotingAPI.DTOs;
using AnimeVotingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AnimeVotingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        // Method for getting a pair of random characters from the database.
        [HttpGet("pair")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetRandomPair()
        {
            // Check if we have enough characters for voting
            var totalCharacters = await _context.Characters.CountAsync();

            if (totalCharacters < 2)
            {
                return BadRequest("Not enough characters available for voting. Need at least 2 characters");
            }

            // Get 2 random characters from database
            var random = new Random();
            var skip1 = random.Next(0, totalCharacters); // Random position between 0 and total-1
            var character1 = await _context.Characters
                .Skip(skip1) // Skip to random position
                .Take(1) //Take 1 character
                .FirstAsync(); //Get the character

            // Get second random character (making sure it's different from first)
            var skip2 = random.Next(0, totalCharacters - 1); // One less option since we exclude character1
            if (skip2 >= skip1) // If skip2 would land on the same position as character1
            {
                skip2++; // Move to next position to avoid duplicate
            }

            var character2 = await _context.Characters
                .Skip(skip2) // Skip to second random position
                .Take(1) // Take 1 character
                .FirstAsync(); // Get the character

            // Put both characters in a list
            var characters = new List<Character> { character1, character2 };

            // Convert characters to CharacterDtos (same logic as the getCharacter method)
            var characterDtos = characters.Select(c => new CharacterDto
            {
                Id = c.Id,
                Name = c.Name,
                Anime = c.Anime,
                ImageUrl = c.ImageUrl,
                Votes = _context.Votes.Count(v => v.WinnerId == c.Id) // Count votes for each character
            }).ToList();

            // Return the pair of characters.
            return Ok(characterDtos);
        }

        [HttpGet("leaderboard")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetLeaderboard()
        {
            // Get all characters with their vote counts calculated from Votes table
            var charactersWithVotes = await _context.Characters
                .Select (c => new
                {
                    Character = c, // Actual Character entity
                    VoteCount = _context.Votes.Count(v => v.WinnerId == c.Id) // Count votes for this character
                })
                .OrderByDescending(x => x.VoteCount) // Sort by vote count, highest first
                .Take(10) // Take the top 10 characters
                .ToListAsync(); // Execute the database query

            // Convert to CharacterDtos (same logic as your other methods)
            var characterDtos = charactersWithVotes.Select(x => new CharacterDto
            {
                Id = x.Character.Id,
                Name = x.Character.Name,
                Anime = x.Character.Anime,
                ImageUrl = x.Character.ImageUrl,
                Votes = x.VoteCount  // Use the already calculated vote count
            }).ToList();

            // Return the Leaderboard
            return Ok(characterDtos);
        }


    }
}
