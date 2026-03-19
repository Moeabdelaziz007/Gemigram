const fs = require('fs');
let code = fs.readFileSync('lib/data-access/gemigramRepository.ts', 'utf8');
code = code.replace(/import { db } from '\@\/firebase';/g, 'import { db } from \'@/firebase\';\nimport { doc, setDoc } from \'firebase/firestore\';');
fs.writeFileSync('lib/data-access/gemigramRepository.ts', code);
