const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/lib/modules.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace "Solar" (case sensitive) with ${INDUSTRY}
// First, identify strings that need to become template literals
content = content.replace(/(["'])([^"']*(?:Solar|solar)[^"']*)(["'])/g, (match, quote, text, endQuote) => {
    let newText = text.replace(/Solar/g, '${INDUSTRY}');
    newText = newText.replace(/solar/g, '${INDUSTRY.toLowerCase()}');
    return '`' + newText + '`';
});

// Fix potential double backticks or other issues
content = content.replace(/``/g, '`');

// Save the file
fs.writeFileSync(filePath, 'utf8');
console.log('Modules neutralization complete.');
