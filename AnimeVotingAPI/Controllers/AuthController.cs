using AnimeVotingAPI.Data;
using AnimeVotingAPI.DTOs;
using AnimeVotingAPI.Models;
using AnimeVotingAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnimeVotingAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, IPasswordHasher<User> passwordHasher, TokenService tokenService)
    {
        _context = context;
        _passwordHasher = new PasswordHasher<User>();
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
        {
            return BadRequest("Username already taken.");
        }

        var user = new User
        {
            Username = dto.Username,
            Role = "User"
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return Ok("User registered succesfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginUserDto dto)
    {
        var normalizedUsername = dto.Username.ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == normalizedUsername);
        if (user == null)
            return Unauthorized("Invalid username or password.");

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid username or password.");

        //JWT 
        var token = _tokenService.CreateToken(user);
        //Return token and basic info
        return Ok(new
        {
            message = "Login successful",
            token,
            user = new
            {
                userId = user.ID,
                username = user.Username,
                role = user.Role
            }
        });
    }
}
