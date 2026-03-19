const fs = require('fs');
let content = fs.readFileSync('lib/data-access/gemigramRepository.ts', 'utf8');

// Insert Timestamp into imports
content = content.replace(/import\s*\{\s*doc,/g, 'import {\n  doc,\n  Timestamp,');

fs.writeFileSync('lib/data-access/gemigramRepository.ts', content);
