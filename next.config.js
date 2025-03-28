/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't run ESLint during build, we'll handle it separately
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['images.unsplash.com']  // Allow Unsplash images to be loaded
  }
};

module.exports = nextConfig; 