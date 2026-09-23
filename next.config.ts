import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Vibe's preview proxy sends a non-localhost Host header.
  allowedDevOrigins: ["**.*"],
  turbopack: {
    resolveAlias: {
      "@catalog": path.resolve(process.cwd(), "catalog"),
    },
  },
};

export default nextConfig;
