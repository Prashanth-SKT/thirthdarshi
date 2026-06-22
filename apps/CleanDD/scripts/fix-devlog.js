const fs = require('fs');
const path = require('path');
const screensDir = path.join(__dirname, '..', 'screens');
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
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('devLog')) {
    const endFirstImport = content.indexOf('\n', content.indexOf('import '));
    content =
      content.slice(0, endFirstImport + 1) +
      "import { devLog } from '../utils/devLog';\n" +
      content.slice(endFirstImport + 1);
  }
  content = content.replace(/console\.log/g, 'devLog');
  fs.writeFileSync(file, content, 'utf8');
}
console.log('devLog applied');
