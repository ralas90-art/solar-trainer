const fs = require('fs');
const path = require('path');

const root = process.cwd();

const replacements = [
    { from: /btn-primary/g, to: 'btn-primary' },
    { from: /badge-primary/g, to: 'badge-primary' },
    { from: /brand-glow-subtle/g, to: 'brand-glow-subtle' },
    { from: /brand-glow/g, to: 'brand-glow' },
    { from: /secondary-glow/g, to: 'secondary-glow' },
    { from: /animate-brand-pulse/g, to: 'animate-brand-pulse' },
    { from: /animate-secondary-pulse/g, to: 'animate-secondary-pulse' },
    { from: /brand-progress/g, to: 'brand-progress' }
];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== 'node_modules' && f !== '.next') {
                walk(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

const targetExtensions = ['.tsx', '.ts', '.js', '.css'];

walk(root, (filePath) => {
    const ext = path.extname(filePath);
    if (targetExtensions.includes(ext)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        replacements.forEach(r => {
            content = content.replace(r.from, r.to);
        });
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${path.relative(root, filePath)}`);
        }
    }
});

console.log('UI Neutralization Complete.');
