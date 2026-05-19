const fs = require('fs');
const content = fs.readFileSync('frontend/lib/audio-manifest.ts', 'utf8');

const tomMatches = (content.match(/voiceName:\s*['"]Tom['"]/g) || []).length;
const rachelMatches = (content.match(/voiceName:\s*['"]Rachel['"]/g) || []).length;
const votekaMatches = (content.match(/voiceName:\s*['"]Voteka['"]/g) || []).length;

console.log('Tom matches:', tomMatches);
console.log('Rachel matches:', rachelMatches);
console.log('Voteka matches:', votekaMatches);
