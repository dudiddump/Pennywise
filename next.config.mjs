/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "media.zenfs.com",
            },
        ],
    },
    // Skip API routes during static export
    output: 'standalone',
    // Exclude API routes from being generated during build
    experimental: {
        excludeRoutes: [
            '/api/budget/get-budget',
            '/api/budget/latest-budget',
            '/api/dashboard-data/barChart-data',
            '/api/dashboard-data/dashboard-inside',
            '/api/dashboard-data/lineChart-data',
            '/api/notifications'
        ]
    }
};

export default nextConfig;