using System.Security.Claims;

namespace AnimeVotingAPI.Middleware
{
    public class AdminAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AdminAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if the request path starts with /api/admin
            if (context.Request.Path.StartsWithSegments("/api/admin"))
            {
                // Get the current user from the HTTP context
                var user = context.User;

                // Check if user identity exists and is authenticated
                if (user.Identity == null || !user.Identity.IsAuthenticated)
                {
                    context.Response.StatusCode = 401; // Unauthorized
                    await context.Response.WriteAsync("Authentication required");
                    return;
                }

                // Extract the user's role from JWT claims - try multiple claim names
                var userRole = user.FindFirst("role")?.Value ??
                              user.FindFirst(ClaimTypes.Role)?.Value ??
                              user.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

                // Check if user has admin role
                if (userRole != "Admin")
                {
                    context.Response.StatusCode = 403; // Forbidden
                    await context.Response.WriteAsync("Admin access required");
                    return;
                }
            }

            // If not an admin route OR user is authorized admin, continue to next middleware
            await _next(context);
        }
    }
}