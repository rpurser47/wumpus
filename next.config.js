/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we can use public directory assets
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
