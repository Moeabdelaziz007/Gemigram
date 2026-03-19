import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
// output: 'export', // Removed to support NextAuth middleware
  transpilePackages: ['framer-motion'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.google.com https://*.googleapis.com; connect-src 'self' https://*.googleapis.com wss://*.googleapis.com https://*.firebase.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
          },
          {
            key: 'Permissions-Policy',
            value: 'microphone=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
