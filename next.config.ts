import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com']  // Allow Unsplash images to be loaded
    }
};

export default nextConfig;
