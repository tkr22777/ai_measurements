/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'ewagpaawhgbheftf.public.blob.vercel-storage.com'],
  },
};

module.exports = nextConfig;
