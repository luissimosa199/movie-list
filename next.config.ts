import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "artworks.thetvdb.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
