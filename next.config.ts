import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // pro.calmkept.com serves the Calmkept Pro page at its root.
        // The vercel.app domain is unaffected (LeadBuilder home stays at /).
        {
          source: "/",
          has: [{ type: "host", value: "pro.calmkept.com" }],
          destination: "/pro",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
