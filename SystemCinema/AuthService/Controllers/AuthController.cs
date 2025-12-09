using AuthService.Manager;
using AuthService.Manager.Dto;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly IAuthManager _authManager;
        public AuthController(IAuthManager authManager)
        {
            _authManager = authManager;
        }
        [HttpPost("register")]
        public async Task Register([FromBody]RegisterRequest input)
        {
            await _authManager.RegisterUser(input);
        }
        [HttpPost("authenticate")]
        public async Task<AuthToken> Authenticate([FromBody] LoginRequest login)
        {
            return await _authManager.Authenticate(login);
        }
        [HttpPost("refreshToken")]

        public async Task<AuthToken> RefreshToken(string refreshToken)
        {
            return await (_authManager.RefreshToken(refreshToken));
        }

    }
}
