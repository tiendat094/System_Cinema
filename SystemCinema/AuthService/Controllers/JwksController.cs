using AuthService.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace AuthService.Controllers
{
    [ApiController]
    [Route(".well-known")]
    public class JwksController : Controller
    {
        private readonly IRsaKeyService _keyService;
        public JwksController(IRsaKeyService keyService)
        {
            _keyService = keyService;
        }
        [HttpGet("jwks.json")]
        public IActionResult GetJsonWebKeySet()
        {
            var key = _keyService.GetRsaSecurityKey(); 


            var jwks = new JsonWebKeySet();

            var jsonWebKey = JsonWebKeyConverter.ConvertFromRSASecurityKey(key);
            jsonWebKey.Use = "sig";
            jsonWebKey.Alg = SecurityAlgorithms.RsaSha256;
            jsonWebKey.Kid = _keyService.GetKeyId();
            jwks.Keys.Add(jsonWebKey);

            // Trả về JWKS (JSON Web Key Set)
            return Ok(jwks);
        }
    }
}
