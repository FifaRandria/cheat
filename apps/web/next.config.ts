import type { NextConfig } from "next";

const api = process.env.API_INTERNAL_URL ?? "http://localhost:4000";

const config: NextConfig = {
  output: "standalone",
  transpilePackages: ["@rustine/shared"],
  poweredByHeader: false,
  // Le navigateur ne parle qu'à Next.js : /api/* est relayé vers Express.
  // Même origine = cookie de session httpOnly sans configuration CORS.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default config;
