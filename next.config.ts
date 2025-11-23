import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bbva.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.santander.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.banorte.com',
      },
      {
        protocol: 'https',
        hostname: 'www.citibanamex.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hsbc.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.scotiabank.com.mx',
      },
      {
        protocol: 'https',
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bbva.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.santander.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.banorte.com',
      },
      {
        protocol: 'https',
        hostname: 'www.citibanamex.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hsbc.com.mx',
      },
      {
        protocol: 'https',
        hostname: 'www.scotiabank.com.mx',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;