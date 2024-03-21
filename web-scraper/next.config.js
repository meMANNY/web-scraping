/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages:['moongoose']
    },
    images: { 
        domains :['m.media-amazon.com']}
}

module.exports = nextConfig
