/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL || "http://localhost:5000/api",
  },
};

module.exports = nextConfig;
