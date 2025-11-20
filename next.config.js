const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:locale",
        destination: "/:locale/users",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

