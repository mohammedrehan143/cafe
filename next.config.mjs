/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "banhmivietnam.xyz",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Avoid build interruptions during Vercel CI deployments
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow clean production builds
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
