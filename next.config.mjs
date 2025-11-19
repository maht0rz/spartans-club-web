/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30
  },
  experimental: {
    // Compile for modern evergreen browsers only (no legacy transforms/polyfills)
    legacyBrowsers: false,
    // Respect browserslist targets for SWC so transforms match our modern target
    browsersListForSwc: true
  }
};

export default nextConfig;

