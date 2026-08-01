import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ewha-gis-lab",
  assetPrefix: "/ewha-gis-lab/",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
