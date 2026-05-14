const fs = require('fs');
const path = require('path');

const files = [
    'app/settings/billing/page.tsx',
    'app/payment/cancel/page.tsx',
    'app/payment/success/page.tsx',
    'app/manager/page.tsx',
    'app/login/page.tsx',
    'app/dashboard/reps/[userId]/page.tsx',
    'components/platform/certification-components.tsx',
    'components/platform/analytics-components.tsx',
    'components/platform/dashboard-widgets.tsx'
];

const root = 'c:\\Users\\12132\\Desktop\\Antigravity Solar Sales Trainer Agent\\solar-trainer\\frontend';

const replacements = [
    { from: /brand-glow-subtle/g, to: 'brand-glow-subtle' },
    { from: /brand-glow/g, to: 'brand-glow' },
    { from: /secondary-glow/g, to: 'secondary-glow' },
    { from: /animate-brand-pulse/g, to: 'animate-brand-pulse' },
    { from: /animate-secondary-pulse/g, to: 'animate-secondary-pulse' }
];

files.forEach(file => {
    const filePath = path.join(root, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        replacements.forEach(r => {
            content = content.replace(r.from, r.to);
        });
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${file}`);
        } else {
            console.log(`No changes needed for ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});
