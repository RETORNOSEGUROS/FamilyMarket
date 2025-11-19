/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para produção
  reactStrictMode: true,
  
  // Otimização de imagens
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com', // Para avatares do Google
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // PWA - Progressive Web App
  // Os arquivos manifest.json e service worker estão em /public
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
