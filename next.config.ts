import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@catalog": path.resolve(process.cwd(), "catalog"),
    },
  },
};

export default nextConfig;
