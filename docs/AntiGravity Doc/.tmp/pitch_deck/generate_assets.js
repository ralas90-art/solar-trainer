const sharp = require('sharp');
const path = require('path');

async function createGradientBackground(filename) {
    // 16:9 aspect ratio (1920x1080 for high quality)
    const width = 1920;
    const height = 1080;

    // deeply dark space theme
    // Colors: Dark Blue/Purple (#0f0c29) -> Purple (#302b63) -> Lighter (#24243e)
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#0f0c29"/> 
        <stop offset="50%" style="stop-color:#302b63"/>
        <stop offset="100%" style="stop-color:#24243e"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    
    <!-- Subtle geometric accents for "Antigravity" feel -->
    <path d="M0,0 L1920,0 L1920,50 L0,150 Z" fill="#00d2ff" opacity="0.05" />
    <circle cx="1800" cy="900" r="300" fill="#7b2cbf" opacity="0.1" filter="blur(50px)" />
  </svg>`;

    await sharp(Buffer.from(svg))
        .png()
        .toFile(filename);

    console.log(`Created ${filename}`);
}

createGradientBackground(path.join(__dirname, 'background.png'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
