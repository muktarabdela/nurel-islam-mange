/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  // Enable static optimization for PWA
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;