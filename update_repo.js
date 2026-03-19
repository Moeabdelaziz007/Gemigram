const fs = require('fs');
let content = fs.readFileSync('lib/data-access/gemigramRepository.ts', 'utf8');

// remove all docs and setDoc
content = content.replace(/doc,\s*setDoc,\s*deleteDoc,\s*/g, '');

// insert them into firebase/firestore import
content = content.replace(/import\s*\{\s*collection/g, 'import {\n  doc,\n  setDoc,\n  deleteDoc,\n  collection');

fs.writeFileSync('lib/data-access/gemigramRepository.ts', content);
