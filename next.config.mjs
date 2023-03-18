import 'dotenv/config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DUNE_API_KEY: process.env.DUNE_API_KEY,
  },
  reactStrictMode: true,
  staticPageGenerationTimeout: 1000,
}

export default nextConfig
