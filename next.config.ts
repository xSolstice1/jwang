import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/jwang",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
