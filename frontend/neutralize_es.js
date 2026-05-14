const fs = require('fs');
const path = require('path');

const targetFile = 'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\modules_es.ts';

if (!fs.existsSync(targetFile)) {
    console.error('File not found:', targetFile);
    process.exit(1);
}

let content = fs.readFileSync(targetFile, 'utf8');

// Replacement 1: "Solar" -> "${WHITE_LABEL.industry}"
content = content.replace(/Solar(?!\s*\?)/g, '${WHITE_LABEL.industry}');

// Replacement 2: "solar" -> "${WHITE_LABEL.industry.toLowerCase()}"
content = content.replace(/solar/g, '${WHITE_LABEL.industry.toLowerCase()}');

// Replacement 3: "Solares" -> "${WHITE_LABEL.industry}s"
content = content.replace(/Solares/g, '${WHITE_LABEL.industry}s');

// Replacement 4: "solares" -> "${WHITE_LABEL.industry.toLowerCase()}s"
content = content.replace(/solares/g, '${WHITE_LABEL.industry.toLowerCase()}s');

// Add import if missing
if (!content.includes('import { WHITE_LABEL }')) {
    content = 'import { WHITE_LABEL } from "./white-label.config";\n' + content;
}

fs.writeFileSync(targetFile, content);
console.log('Neutralized modules_es.ts');
