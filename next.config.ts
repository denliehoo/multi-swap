import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA)
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
};

export default nextConfig;
