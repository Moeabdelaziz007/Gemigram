const fs = require('fs');
let code = fs.readFileSync('components/AetherLogo.tsx', 'utf8');
code = code.replace(/import GemigramLogoIcon from '\.\/GemigramLogo';/g, 'import { GemigramLogo as GemigramLogoIcon } from \'./GemigramLogo\';');
fs.writeFileSync('components/AetherLogo.tsx', code);
