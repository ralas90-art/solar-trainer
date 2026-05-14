const fs = require('fs');
const path = require('path');

/**
 * Robustly neutralizes a file by:
 * 1. Replacing hardcoded industry terms with dynamic variables.
 * 2. Converting strings to template literals (backticks) if they contain interpolation.
 */
function neutralizeFile(filePath, replacements, imports) {
    if (!fs.existsSync(filePath)) {
        console.warn('File not found:', filePath);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Apply replacements
    replacements.forEach(r => {
        // Find strings that contain the pattern and convert them to backticks
        // This is a bit tricky with regex, so we'll do it in stages.
        content = content.replace(r.search, r.replace);
    });

    // Post-process to fix quotes: Find any double or single quoted string that contains ${...}
    // and convert the surrounding quotes to backticks.
    // Regex for double quotes: "([^"\\]*(\\.[^"\\]*)*\$\{.*\}[^"\\]*(\\.[^"\\]*)*)"
    content = content.replace(/"([^"\\]*(\\.[^"\\]*)*\$\{.*?\}[^"\\]*(\\.[^"\\]*)*)"/g, '`$1`');
    // Regex for single quotes: '([^'\\]*(\\.[^'\\]*)*\$\{.*?\}[^'\\]*(\\.[^'\\]*)*)'
    content = content.replace(/'([^'\\]*(\\.[^'\\]*)*\$\{.*?\}[^'\\]*(\\.[^'\\]*)*)'/g, '`$1`');

    // Add imports
    imports.forEach(imp => {
        if (!content.includes(imp.check)) {
            if (content.includes('import {')) {
                content = content.replace(/import {/, `import { ${imp.name},`);
            } else {
                content = `import { ${imp.name} } from "${imp.path}";\n` + content;
            }
        }
    });

    fs.writeFileSync(filePath, content);
    console.log('Neutralized:', filePath);
}

const industryReplacements = [
    { search: /Solar/g, replace: '${INDUSTRY}' },
    { search: /solar/g, replace: '${INDUSTRY.toLowerCase()}' }
];

const esReplacements = [
    { search: /Solar/g, replace: '${WHITE_LABEL.industry}' },
    { search: /solar/g, replace: '${WHITE_LABEL.industry.toLowerCase()}' },
    { search: /Solares/g, replace: '${WHITE_LABEL.industry}s' },
    { search: /solares/g, replace: '${WHITE_LABEL.industry.toLowerCase()}s' }
];

const industryImports = [{ name: 'INDUSTRY', check: 'import { INDUSTRY }', path: '@/lib/white-label.config' }];
const whiteLabelImports = [{ name: 'WHITE_LABEL', check: 'import { WHITE_LABEL }', path: './white-label.config' }];

// English Files
const enFiles = [
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\scenarios.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day1_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day3_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day4_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day5_additive_modules.ts'
];

enFiles.forEach(f => neutralizeFile(f, industryReplacements, industryImports));

// Spanish File
neutralizeFile(
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\modules_es.ts', 
    esReplacements, 
    whiteLabelImports
);

console.log('All module files processed.');
