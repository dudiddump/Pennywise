/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/Pennywise',
    assetPrefix: '/Pennywise/',
    
    images: {
        unoptimized: true,
        
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
};

export default nextConfig;