/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/auth/:path*",
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + "/auth/:path*",
            },
            {
                source: "/api/projects/:path*",
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + "/projects/:path*",
            },
            {
                source: "/api/tasks/:path*",
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + "/tasks/:path*",
            },
            {
              source: '/api/employee/:path*',
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + '/employee/:path*',
            },
            {
                source: '/api/assignee/:path*',
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + '/assignee/:path*',
            },
            {
                source:'/api/message/:path*',
                destination: process.env.NEXT_PUBLIC_BACKEND_IP + '/message/:path*',
            }
        ];
    },
};

export default nextConfig;