const fs = require('fs');
const path = require('path');

const screensDir = path.join(__dirname, '..', 'screens');

// TempleSearchScreen: remove constants block and wire imports
{
  const file = path.join(screensDir, 'TempleSearchScreen.js');
  let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const dropdownIdx = lines.findIndex((l) => l.includes("console.log('Dropdown"));
  if (dropdownIdx >= 0) {
    lines.splice(dropdownIdx, 1);
  }
  const startIdx = lines.findIndex((l) => l.includes('UI Translations'));
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '};' && lines[i + 1]?.includes('Deity detection') === false && lines[i + 2]?.trim() === '');
  // find TOKENS closing }; after UI_TRANSLATIONS
  let tokensEnd = -1;
  let depth = 0;
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes('const TOKENS')) {
      for (let j = i; j < lines.length; j++) {
        if (lines[j].trim() === '};') {
          tokensEnd = j;
          break;
        }
      }
      break;
    }
  }
  if (startIdx >= 0 && tokensEnd >= 0) {
    lines.splice(startIdx, tokensEnd - startIdx + 1);
  }
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
}

// Replace console.log in other screens
const screenFiles = [
  'LoginScreen.js',
  'SignUpScreen.js',
  'NavigationScreen.js',
  'TempleDetailsScreen.js',
  'LanguageSelectionScreen.js',
  'templeAudioUtils.js',
  'GoogleSignInButton.js',
];

for (const name of screenFiles) {
  const file = path.join(screensDir, name);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('devLog')) {
    const firstImport = content.indexOf('import ');
    const endFirstImport = content.indexOf('\n', firstImport);
    content =
      content.slice(0, endFirstImport + 1) +
      "import { devLog } from '../utils/devLog';\n" +
      content.slice(endFirstImport + 1);
  }
  content = content.replace(/console\.log/g, 'devLog');
  fs.writeFileSync(file, content, 'utf8');
}

console.log('Screen fixes applied');
