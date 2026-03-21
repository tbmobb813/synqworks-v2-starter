import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow builds to complete even with TypeScript errors during development
  // Set to false before production deployment
  typescript: {
    ignoreBuildErrors: false,
  },

  // Same for ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Image domains — add your Supabase project URL here
  // so Next.js Image component can serve avatars/uploads
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Required if wrapping with Tauri for desktop
  // Tauri serves the app as a local file, not a domain
  // Comment this out if running web-only
  ...(process.env.TAURI_ENV === 'true' && {
    output: 'export',
    trailingSlash: true,
  }),
}

export default nextConfig