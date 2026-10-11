/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'view',
            value: 'tienda',
          },
        ],
        destination: '/tienda',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'view',
            value: 'hombres',
          },
        ],
        destination: '/hombres',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'view',
            value: 'mujeres',
          },
        ],
        destination: '/mujeres',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'view',
            value: 'nosotros',
          },
        ],
        destination: '/nosotros',
        permanent: true,
      },
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'id',
            value: '(?<id>\\d+)',
          },
        ],
        destination: '/producto/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
