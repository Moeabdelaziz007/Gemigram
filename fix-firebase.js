const fs = require('fs');

let file = fs.readFileSync('firebase.ts', 'utf8');
file = file.replace(/if \(typeof window !== 'undefined'\) \{([\s\S]*?)\} else \{/, `if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (e) {
    console.error("Firebase init failed", e);
    app = {} as any;
    db = {} as any;
    auth = { currentUser: null } as any;
    storage = {} as any;
  }
} else {`);

fs.writeFileSync('firebase.ts', file);
