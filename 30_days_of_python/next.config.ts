import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empêche Turbopack de remonter jusqu'au home directory
  // (qui contient son propre package.json / package-lock.json).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
