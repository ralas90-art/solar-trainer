/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    webpack: (config) => {
        // Required for react-pdf/pdfjs — prevent webpack from bundling the canvas module
        config.externals = [...(config.externals || []), { canvas: 'canvas' }]
        return config
    },
}

module.exports = nextConfig
