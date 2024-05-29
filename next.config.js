/** @type {import('next').NextConfig} */
const path = require('path');

let apiUrl = "http://localhost:8088";
let awsUrl = "https://s3.cloudfly.vn";
switch (process.env.NODE_ENV) {
  case "production":
    apiUrl = "http://103.82.135.49:8088";
    // apiUrl = "https://sangapi.pro.vn";
    break;
  case "development":
    apiUrl = "http://localhost:8088";
    break;
  case "local":
    break;
  default:
    apiUrl = "http://localhost:8088";
    break;
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
    localeDetection: false
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "_variables.scss";`
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config
  },
  experimental: {
    proxyTimeout: 1000 * 120
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: apiUrl +'/api/:path*' // Proxy to Backend
      },
      {
        source: '/public/:path*',
        destination: apiUrl +'/public/:path*' // Proxy to Backend
      },
      {
        source: '/Callback',
        destination: apiUrl +'/Callback' // Proxy to Backend
      },
      {
        source: '/cover/:path*',
        destination: awsUrl +'/cover/:path*' // Cover
      },
      {
        source: '/avatar/:path*',
        destination: awsUrl +'/avatar/:path*' // Avatar
      },
    ]
  }
}

module.exports = nextConfig
