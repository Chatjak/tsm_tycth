/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/auth/:path*",
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + "/auth/:path*",
            },
            {
                source: "/projects/:path*",
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + "/projects/:path*",
            },
        ];
    },
};

export default nextConfig;