/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    autoPrerender: false,
  },
  serverRuntimeConfig: {
    port: 80,
  },
};

module.exports = nextConfig;
