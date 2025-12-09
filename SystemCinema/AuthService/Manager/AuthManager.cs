using AuthService.Infrastructure.Data;
using AuthService.Manager.Dto;
using AuthService.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Manager
{
    public interface IAuthManager {
        Task RegisterUser(RegisterRequest input);
        Task<AuthToken> Authenticate(LoginRequest login);
         Task<AuthToken> RefreshToken(string refreshToken);

    }

    public class AuthManager : IAuthManager
    {
        private readonly AuthContext _context;
        private IPasswordHasher<AuthUser> _passwordHasher;
        private readonly IRsaKeyService _rsaKeyService;
        private readonly IConfiguration _configuration;
        public AuthManager(AuthContext context,IPasswordHasher<AuthUser> passwordHasher,IConfiguration configuration,IRsaKeyService rsaKeyService)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
            _rsaKeyService = rsaKeyService;
        }

        public AuthUser FindByNameOrEmail(string userNameOrEmail)
        {
            var user = _context.AuthUsers
                .FirstOrDefault(x => x.Email.Equals(userNameOrEmail));

            if (user == null)
            {
                user = _context.AuthUsers
                    .FirstOrDefault(x => x.Name.Equals(userNameOrEmail));
            }

            return user;
        }

        private bool CheckPassword(AuthUser user, string password)
        {
            if (user == null || string.IsNullOrEmpty(password)) return false;

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password,password);

            if(verificationResult == PasswordVerificationResult.Success) return true;
            return false;
        }

        public async Task RegisterUser(RegisterRequest input)
        {
            var isUserExist = FindByNameOrEmail(input.Email);
            if (isUserExist != null)
            {
                throw new Exception("Acount is Exist !");
            }
                var authUser = new AuthUser
                {
                    Email = input.Email,
                    Name = input.FullName,
                    IsActive = true
                };
                string hashedPassword = _passwordHasher.HashPassword(authUser, input.Password);
                authUser.Password = hashedPassword;
                _context.Add(authUser);
               await _context.SaveChangesAsync();
            
            
        }

        public string GenerateJwt(AuthUser user)
        {
            var claim = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.Name ,user.Name.ToString()),
                new Claim(ClaimTypes.UserData ,user.Id.ToString())

            };
            var key = _rsaKeyService.GetRsaSecurityKey();
            var now  = DateTime.UtcNow;
            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.RsaSha256);

            var token = new JwtSecurityToken(
                   issuer: _configuration["Authentication:Issuer"],
                   audience: _configuration["Authentication:Audience"],
                   claims: claim,
                   expires: now.AddMinutes(15),
                   signingCredentials: signingCredentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthToken> Authenticate(LoginRequest login)
        {
            var user = FindByNameOrEmail(login.Email);
            if (user == null)
            {
                throw new Exception("Invalid credentials.");
            }
            if (!user.IsActive)
            {
                throw new ApplicationException("User account is not active.");
            }
            var isCheckPassword = CheckPassword(user, login.Password);
            if (!isCheckPassword)
            {
                throw new Exception("Invalid credentials.");
            }
            await RevokeAllTokensForUserAsync(user.Id);
                        var refreshToken = new RefresherToken
            {
                UserId = user.Id,
                RefreshToken = Guid.NewGuid().ToString(), // Token Opaque
                ExpireAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                IssuedAt = DateTime.UtcNow

            };
            _context.RefresherToken.Add(refreshToken);
            await _context.SaveChangesAsync();
            var accessToken = GenerateJwt(user);
            return new AuthToken
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.RefreshToken,
            };
            
        }

        public async Task <AuthToken> RefreshToken(string refreshToken)
        {
            var refresh =await _context.RefresherToken.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
            if (refresh == null || refresh.ExpireAt < DateTime.UtcNow || refresh.IsRevoked)
            {
               
                if (refresh != null && refresh.IsRevoked)
                {
                    await RevokeAllTokensForUserAsync(refresh.UserId);
                    throw new ApplicationException("Token reused. All sessions revoked.");
                }
                throw new ApplicationException("Invalid or expired refresh token.");
            }

            var user =await _context.AuthUsers.FirstOrDefaultAsync(x => x.Id == refresh.UserId);
            if (user == null || !user.IsActive)
            {
                throw new ApplicationException("User associated with refresh token not found or inactive.");
            }
            refresh.IsRevoked = true;
            var newRefreshToken = new RefresherToken
            {
                UserId = user.Id,
                RefreshToken = Guid.NewGuid().ToString(), // Token Opaque
                ExpireAt = DateTime.UtcNow.AddDays(7),
                IsRevoked = false,
                IssuedAt = DateTime.UtcNow

            };
            _context.RefresherToken.Add(newRefreshToken);
            await _context.SaveChangesAsync();
            var accessToken = GenerateJwt(user);
            return new AuthToken
            {
                AccessToken = accessToken,
                RefreshToken = newRefreshToken.RefreshToken,
            };

        }

        private async Task RevokeAllTokensForUserAsync(Guid userId)
        {
            var activeTokens = await _context.RefresherToken
                .Where(x => x.UserId == userId && !x.IsRevoked && x.ExpireAt > DateTime.UtcNow)
                .ToListAsync();

            foreach (var token in activeTokens)
            {
                token.IsRevoked = true;
            }
            await _context.SaveChangesAsync();
        }
    }
}
