const pptxgen = require('pptxgenjs');
const html2pptx = require('./html2pptx');

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Antigravity Solar';
    pptx.title = 'In-Home Presentation';

    // Slide 1
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide1.html', pptx);
    // Slide 2
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide2.html', pptx);
    // Slide 3
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide3.html', pptx);
    // Slide 4
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide4.html', pptx);
    // Slide 5
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide5.html', pptx);
    // Slide 6
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide6.html', pptx);
    // Slide 7
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide7.html', pptx);
    // Slide 8
    await html2pptx('c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/.tmp/in_home_slides/slide8.html', pptx);

    // Save
    await pptx.writeFile({ fileName: 'c:/Users/12132/Desktop/Antigravity Solar Sales Trainer Agent/AntiGravity Doc/training_materials/In_Home_Presentation.pptx' });
    console.log('In-Home Presentation created successfully!');
}

createPresentation().catch(console.error);
