/** @type {import('next').NextConfig} */
const nextConfig = {
     images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
    ],
  },
  // This is required to ensure middleware behaves as expected
  experimental: {
    serverActions: {
      // Add properties as needed, e.g.
      bodySizeLimit: '10MB', // or some other valid SizeLimit value
      allowedOrigins: ['https://localhost:3000'], // or some other valid string[]
    },
  },
};

export default nextConfig;
