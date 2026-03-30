import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'models.forgeai.dev'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*` 
          : 'http://localhost:4000/api/v1/:path*',
      },
      {
        source: '/brain/:path*',
        destination: process.env.NEXT_PUBLIC_BRAIN_URL 
          ? `${process.env.NEXT_PUBLIC_BRAIN_URL}/brain/:path*` 
          : 'http://localhost:3001/brain/:path*',
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ],
      },
    ];
  },
};

export default nextConfig;
