const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');
const fs = require('fs');
const path = require('path');

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Solar Trainer';
    pptx.title = 'In-Home Presentation';

    const slides = ['slide1.html', 'slide2.html', 'slide3.html', 'slide4.html', 'slide5.html'];

    console.log('Generating presentation...');

    for (const file of slides) {
        console.log(`Processing ${file}...`);
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const { slide, placeholders } = await html2pptx(filePath, pptx);

            // Inject Images into Placeholders
            if (placeholders) {
                for (const ph of placeholders) {
                    if (ph.id === 'inflation_img') {
                        console.log('Adding inflation_curve.png');
                        slide.addImage({ path: path.join(__dirname, 'inflation_curve.png'), x: ph.x, y: ph.y, w: ph.w, h: ph.h });
                    }
                    if (ph.id === 'pillars_img') {
                        console.log('Adding three_reasons_shield.png');
                        slide.addImage({ path: path.join(__dirname, 'three_reasons_shield.png'), x: ph.x, y: ph.y, w: ph.w, h: ph.h });
                    }
                    if (ph.id === 'valuestack_img') {
                        console.log('Adding value_stack_pyramid.png');
                        slide.addImage({ path: path.join(__dirname, 'value_stack_pyramid.png'), x: ph.x, y: ph.y, w: ph.w, h: ph.h });
                    }
                }
            }

        } else {
            console.error(`File not found: ${file}`);
        }
    }

    const outputPath = path.join(__dirname, 'In_Home_Presentation.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation saved to: ${outputPath}`);
}

createPresentation().catch(err => {
    console.error('Error generating presentation:', err);
    process.exit(1);
});
