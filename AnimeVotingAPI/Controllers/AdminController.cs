using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AnimeVotingAPI.Data;
using AnimeVotingAPI.Models;
using AnimeVotingAPI.Services;

namespace AnimeVotingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IJikanService _jikanService;

        public AdminController(AppDbContext context, IJikanService jikanService)
        {
            _context = context;
            _jikanService = jikanService;
        }

        // GET /api/admin/test
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new
            {
                message = "Admin access confirmed",
                timestamp = DateTime.UtcNow,
                user = User.Identity?.Name
            });
        }

        // GET /api/admin/characters
        [HttpGet("characters")]
        public async Task<IActionResult> GetAllCharacters()
        {
            var characters = await _context.Characters
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(characters);
        }

        // POST /api/admin/characters/{animeId}
        [HttpPost("characters/{animeId}")]
        public async Task<IActionResult> AddCharactersFromAnime(int animeId)
        {
            try
            {
                var characters = await _jikanService.GetCharactersAsync(animeId);
                var animeTitle = await _jikanService.GetAnimeTitleAsync(animeId);

                foreach (var jikanCharacter in characters)
                {
                    var existingCharacter = await _context.Characters
                        .FirstOrDefaultAsync(c => c.Name == jikanCharacter.Name && c.Anime == jikanCharacter.Anime);

                    if (existingCharacter == null)
                    {
                        // Convert JikanCharacter to internal Character model
                        var character = new Character
                        {
                            Id = Guid.NewGuid(),
                            Name = jikanCharacter.Name,
                            Anime = animeTitle ?? jikanCharacter.Anime ?? "Unknown Unime",
                            ImageUrl = jikanCharacter.Images?.Jpg?.ImageUrl ??
                                       jikanCharacter.Images?.Webp?.ImageUrl ??
                                       string.Empty
                        };
                        _context.Characters.Add(character);
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Characters from anime {animeId} added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE /api/admin/characters/{id}
        [HttpDelete("characters/{id}")]
        public async Task<IActionResult> DeleteCharacter(Guid id)
        {
            var character = await _context.Characters.FindAsync(id);

            if (character == null)
            {
                return NotFound(new { error = "Character not found" });
            }

            // Check if character has votes
            var hasVotes = await _context.Votes.AnyAsync(v => v.WinnerId == id);

            if (hasVotes)
            {
                return BadRequest(new { error = "Cannot delete character with existing votes" });
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Character deleted successfully" });
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.ID,
                    u.Username,
                    u.Role,
                    VoteCount = _context.Votes.Count(v => v.VoterId == u.ID)
                })
                .OrderBy(u => u.Username)
                .ToListAsync();

            return Ok(users);
        }

        // PUT /api/admin/users/{id}/role
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateRoleRequest request)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            if (request.Role != "Admin" && request.Role != "User")
            {
                return BadRequest(new { error = "Invalid role. Must be 'Admin' or 'User'" });
            }

            user.Role = request.Role;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User role updated to {request.Role}" });
        }

        // GET /api/admin/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetSystemStats()
        {
            try
            {
                // Get the most voted character separately to avoid nested async issues
                var mostVotedCharacterData = await _context.Votes
                    .GroupBy(v => v.WinnerId)
                    .OrderByDescending(g => g.Count())
                    .Select(g => new {
                        CharacterId = g.Key,
                        VoteCount = g.Count()
                    })
                    .FirstOrDefaultAsync();

                string? characterName = null;
                if (mostVotedCharacterData != null)
                {
                    var character = await _context.Characters
                        .Where(c => c.Id == mostVotedCharacterData.CharacterId)
                        .FirstOrDefaultAsync();
                    characterName = character?.Name;
                }

                var stats = new
                {
                    TotalUsers = await _context.Users.CountAsync(),
                    TotalCharacters = await _context.Characters.CountAsync(),
                    TotalVotes = await _context.Votes.CountAsync(),
                    AdminUsers = await _context.Users.CountAsync(u => u.Role == "Admin"),
                    RegularUsers = await _context.Users.CountAsync(u => u.Role == "User"),
                    MostVotedCharacter = mostVotedCharacterData != null ? new
                    {
                        CharacterId = mostVotedCharacterData.CharacterId,
                        VoteCount = mostVotedCharacterData.VoteCount,
                        CharacterName = characterName
                    } : null
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                // Log the error for debugging
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }
}