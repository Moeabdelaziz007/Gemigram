const fs = require('fs');
let code = fs.readFileSync('lib/data-access/gemigramRepository.ts', 'utf8');
code = code.replace(/import { doc, setDoc } from 'firebase\/firestore';/g, 'import { doc, setDoc, Timestamp } from \'firebase/firestore\';');
fs.writeFileSync('lib/data-access/gemigramRepository.ts', code);
