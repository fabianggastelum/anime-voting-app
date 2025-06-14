using AnimeVotingAPI.Data;
using AnimeVotingAPI.DTOs;
using AnimeVotingAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AnimeVotingAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class VotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Constructor: Inject the database context
        public VotesController(AppDbContext context)
        {
            _context = context;
        }
        // POST /votes - Submit a new vote
        [HttpPost("{winnerId}")]
        public async Task<ActionResult<VoteDto>> CastVote(Guid winnerId) // Put Guid voterId, before Guid winnerId if it breaks
        {
            // Extract the user ID from JWT token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            // Convert string claim to a GUID
            var voterId = Guid.Parse(userIdClaim.Value);

            // Validate if character exists
            var exists = await _context.Characters.AnyAsync(c => c.Id == winnerId);
            if(!exists)
            {
                return NotFound("Character not found");
            }

            // Create a new vote
            var vote = new Vote
            {
                VoterId = voterId,
                WinnerId = winnerId,
                Timestamp = DateTime.UtcNow
            };

            // Save the vote into the database
            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();

            // Convert Vote entity to VoteDto to return
            var voteDto = new VoteDto
            {
                Id = vote.Id,
                Winner = vote.WinnerId,
                Timestamp = vote.Timestamp,
            };

            // Return 201 Created with the DTO
            return CreatedAtAction(nameof(GetVoteById), new { id = vote.Id }, voteDto);
        }

        // Get a vote by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<VoteDto>> GetVoteById(Guid id)
        {
            var vote = await _context.Votes.FindAsync(id);
            if (vote == null)
                return NotFound();

            var voteDto = new VoteDto
            {
                Id = vote.Id,
                Winner = vote.WinnerId,
                Timestamp = vote.Timestamp,
            };
            return Ok(voteDto);
        }

        // List all votes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VoteDto>>> GetAllVotes()
        {
            var votes = await _context.Votes.ToListAsync();

            var voteDtos = votes.Select(v => new VoteDto
            {
                Id = v.Id,
                Winner = v.WinnerId,
                Timestamp = v.Timestamp
            });

            return Ok(voteDtos);
        }

    }

}
