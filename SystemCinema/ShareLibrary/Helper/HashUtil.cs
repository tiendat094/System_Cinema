using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ShareLibrary.Helper
{
    public static class HashUtil
    {
        public static String HmacSha512(string key, string inputDat)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputDat);
            using(var hmac = new HMACSHA512(keyBytes))
            {
                byte[] HasValue = hmac.ComputeHash(inputBytes);
                foreach(var theByte in HasValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }

        public static String HmacSHA256(string key, string inputDat)
        {
            byte[] keyByte = Encoding.UTF8.GetBytes(key);
            byte[] messageByte = Encoding.UTF8.GetBytes(inputDat);  
            using( var hmac256 = new HMACSHA256(keyByte))
            {
                byte[] hashmessage = hmac256.ComputeHash(messageByte);
                string hex = BitConverter.ToString(hashmessage);
                hex = hex.Replace("-", "").ToLower();
                return hex;
            }
        }
    }
}
