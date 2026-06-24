const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'screens', 'TempleSearchScreen.js');
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

// Remove debug log line
lines = lines.filter((l) => !l.includes("console.log('Dropdown"));

// Remove UI_TRANSLATIONS + TOKENS block (lines containing markers)
const start = lines.findIndex((l) => l.includes('UI Translations'));
let end = start;
if (start >= 0) {
  let seenTokens = false;
  for (let i = start; i < lines.length; i++) {
    if (lines[i].includes('const TOKENS')) seenTokens = true;
    if (seenTokens && lines[i].trim() === '};') {
      end = i;
      break;
    }
  }
  lines.splice(start, end - start + 1);
}

// Add imports after walkthrough-tooltip import
const tooltipIdx = lines.findIndex((l) => l.includes('react-native-walkthrough-tooltip'));
if (tooltipIdx >= 0 && !lines.some((l) => l.includes('templeSearchConstants'))) {
  lines.splice(
    tooltipIdx + 1,
    0,
    "import { UI_TRANSLATIONS, TOKENS } from './templeSearchConstants';",
    "import { devLog } from '../utils/devLog';",
  );
}

let content = lines.join('\n').replace(/console\.log/g, 'devLog');
fs.writeFileSync(file, content, 'utf8');

// Fix exports in constants file
const constantsFile = path.join(__dirname, '..', 'screens', 'templeSearchConstants.js');
let constants = fs.readFileSync(constantsFile, 'utf8');
constants = constants.replace('const UI_TRANSLATIONS', 'export const UI_TRANSLATIONS');
constants = constants.replace('const TOKENS', 'export const TOKENS');
fs.writeFileSync(constantsFile, constants, 'utf8');

console.log('TempleSearchScreen updated');
