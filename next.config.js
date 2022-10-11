/** @type {import('next').NextConfig} */
const path = require('path');

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
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'fr', 'vi', 'nl-NL'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'vi',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "_variables.scss";`
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config
  },
}

module.exports = nextConfig
