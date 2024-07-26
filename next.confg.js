/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      // 필요한 다른 경로들을 여기에 추가합니다.
    };
  },
}

module.exports = nextConfig
