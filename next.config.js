/** @type {import('next').NextConfig} */

let apiUrl = "http://localhost:3000/api";
switch (process.env.NODE_ENV) {
  case "production":
    apiUrl = "http://minhsang.space/api";
    break;
  case "development":
    apiUrl = "http://localhost:8080/api";
    break;
  case "local":
    break;
  default:
    apiUrl = "http://localhost:3000/api";
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    apiUrl: apiUrl
  }
}

module.exports = nextConfig
