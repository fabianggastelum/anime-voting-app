using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AnimeVotingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Securecontroller : ControllerBase
    {
        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetUserProfile()
        {
            //Access the current user's ID and username from JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var username = User.FindFirstValue(ClaimTypes.Name);

            return Ok(new
            {
                message = "This is a protected route.",
                userId,
                username
            });
        }
    }
}
