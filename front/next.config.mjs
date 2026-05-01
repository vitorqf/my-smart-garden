/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  serverExternalPackages: ["pg"]
};

export default nextConfig;
