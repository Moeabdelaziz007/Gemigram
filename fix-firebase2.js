const fs = require('fs');

let file = fs.readFileSync('firebase.ts', 'utf8');
file = file.replace(/if \(typeof window !== 'undefined'\) \{\n  const testConnection = async \(\) => \{/, `if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  const testConnection = async () => {`);

fs.writeFileSync('firebase.ts', file);
