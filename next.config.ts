import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https://*.google.com https://www.google-analytics.com",
              "frame-src https://www.google.com https://maps.google.com",
              "connect-src 'self' https://maps.googleapis.com https://www.google-analytics.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
