using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace AuthService.Model
{
    public interface IRsaKeyService {
        RsaSecurityKey GetRsaSecurityKey();
        string GetKeyId();
    }

    public class RsaKeyService : IRsaKeyService
    {
        private readonly RsaSecurityKey _rsaSecurityKey;
        private readonly string _keyId;

        public RsaKeyService()
        {
            var rsa = RSA.Create(2048);

            _rsaSecurityKey = new RsaSecurityKey(rsa);

            // KeyID (kid) cực kỳ quan trọng để Gateway biết dùng key nào (khi xoay vòng key)
            _keyId = "dev-key-id-" + Guid.NewGuid().ToString();
            _rsaSecurityKey.KeyId = _keyId;
        }
        public RsaSecurityKey GetRsaSecurityKey() => _rsaSecurityKey;
        public string GetKeyId() => _keyId;
    }
}
