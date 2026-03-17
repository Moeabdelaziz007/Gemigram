const fs = require('fs');

let file = fs.readFileSync('components/Providers.tsx', 'utf8');
file = file.replace(/const unsubscribe = onAuthStateChanged\(auth, \(u\) => \{/, `if (!auth || !auth.currentUser && !auth.app) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, (u) => {`);

fs.writeFileSync('components/Providers.tsx', file);
