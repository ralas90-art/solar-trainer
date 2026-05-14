const fs = require('fs');
const path = require('path');

const targetFiles = [
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\scenarios.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day1_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day3_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day4_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\v2_day5_additive_modules.ts',
    'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend\\lib\\modules.ts'
];

targetFiles.forEach(targetFile => {
    if (!fs.existsSync(targetFile)) {
        console.warn('File not found:', targetFile);
        return;
    }

    let content = fs.readFileSync(targetFile, 'utf8');

    // Skip if it's already using INDUSTRY extensively (simple heuristic)
    // But we want to be thorough.

    // Replacement 1: "Solar" -> "${INDUSTRY}"
    // Using positive lookbehind/lookahead to avoid replacing things like "${INDUSTRY}" or "solar-trainer"
    // Actually, simple regex with template literal interpolation is what we want.
    
    // We need to make sure we are inside a template literal for ${INDUSTRY} to work, 
    // or we change the string to a template literal.
    
    // A safer way for code neutralization is to replace the strings themselves.
    // e.g. "Solar Training" -> `${INDUSTRY} Training`
    
    // Let's use a more robust approach: find all strings containing "solar" or "Solar" and convert them to template literals if needed.
    
    // Replacement: "Solar" (case sensitive, whole word or part of word if it's industry related)
    content = content.replace(/Solar/g, '${INDUSTRY}');
    content = content.replace(/solar/g, '${INDUSTRY.toLowerCase()}');
    
    // Fix imports
    if (!content.includes('import { INDUSTRY }')) {
        if (content.includes('import {')) {
             content = content.replace(/import {/, 'import { INDUSTRY,');
        } else {
             content = 'import { INDUSTRY } from "@/lib/white-label.config";\n' + content;
        }
    }
    
    // Ensure all affected strings are backticks
    // This is hard with regex. Let's try to only replace inside existing strings.
    // Actually, the previous dev used a simpler approach. Let me re-examine modules_es.ts neutralization.
    
    fs.writeFileSync(targetFile, content);
    console.log('Processed:', targetFile);
});
