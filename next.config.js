const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      { source: "/:locale", destination: "/:locale/users", permanent: true },
    ];
  },
};

module.exports = nextConfig;
