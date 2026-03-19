const fs = require('fs');
let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(/@apply bg-theme-primary text-theme-foreground selection:bg-gemigram-neon selection:text-black;/, '@apply bg-carbon-black text-white selection:bg-gemigram-neon selection:text-black;');
fs.writeFileSync('app/globals.css', css);
