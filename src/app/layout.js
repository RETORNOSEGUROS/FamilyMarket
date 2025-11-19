// src/app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Lista de Supermercado - Organize suas compras em família',
  description: 'App colaborativo para gerenciar listas de supermercado, controlar estoque e economizar',
  manifest: '/manifest.json',
  themeColor: '#4caf50',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lista Mercado',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
