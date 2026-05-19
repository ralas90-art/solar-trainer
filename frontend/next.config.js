/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/training',
                destination: '/my-training',
                permanent: false,
            },
            {
                source: '/simulator',
                destination: '/ai-simulator',
                permanent: false,
            },
            {
                source: '/profile',
                destination: '/settings',
                permanent: false,
            },
        ];
    },
    webpack: (config) => {
        // Required for react-pdf/pdfjs — prevent webpack from bundling the canvas module
        config.externals = [...(config.externals || []), { canvas: 'canvas' }]
        return config
    },
}

module.exports = nextConfig
