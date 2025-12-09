using Microsoft.IdentityModel.Tokens;

namespace Gateway.Helper
{
    public static class JwksRetriever
    {
        private static JsonWebKeySet _cachedJwks;
        private static DateTime _lastFetch = DateTime.MinValue;
        private static readonly HttpClient _httpClient = new HttpClient();

        public static IEnumerable<SecurityKey> GetSigningKeys(string jwksUrl, string kid)
        {

            if (string.IsNullOrEmpty(kid))
            {
                
                return Enumerable.Empty<SecurityKey>();
            }
            if (_cachedJwks == null || DateTime.UtcNow > _lastFetch.AddHours(1))
            {
                RefreshCache(jwksUrl);
            }

            var matchingKey = _cachedJwks.Keys.FirstOrDefault(k => k.Kid == kid);

            if(matchingKey == null)
            {
                RefreshCache(jwksUrl);
                matchingKey = _cachedJwks.Keys.FirstOrDefault(k => k.Kid == kid);
            }
            if (matchingKey == null)
            {
                // Vẫn không thấy -> Token fake hoặc Key đã bị thu hồi
                throw new SecurityTokenSignatureKeyNotFoundException("Key ID not found in JWKS");
            }
            return new List<SecurityKey> { matchingKey };
        }

        private static void RefreshCache(string url)
        {
             var json = _httpClient.GetStringAsync(url).Result; 
             _cachedJwks = new JsonWebKeySet(json);
            _lastFetch = DateTime.UtcNow;

        }
    }
}
