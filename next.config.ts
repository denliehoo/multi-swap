import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export', // Outputs a Single-Page Application (SPA), can't use this if want API routes to be public
  distDir: 'build', // Changes the build output directory to `build`
  webpack: (config) => {
    config.externals.push(
      '@keyv/redis',
      '@keyv/mongo',
      '@keyv/sqlite',
      '@keyv/postgres',
      '@keyv/mysql',
      '@keyv/etcd',
    );
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
