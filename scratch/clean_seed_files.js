const fs = require('fs');
const path = require('path');

const filesToClean = [
  'prisma/seed-thailand.ts',
  'prisma/seed-singapore.ts',
  'prisma/seed-malaysia.ts'
];

const placeholder = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000';

for (const relPath of filesToClean) {
  const filePath = path.join(__dirname, '..', relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace any occurrence of https://ceysaid.lk/... with the placeholder
    const regex = /https:\/\/ceysaid\.lk[^\s'"]+/gi;
    const newContent = content.replace(regex, placeholder);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Cleaned ${relPath}`);
    }
  }
}
