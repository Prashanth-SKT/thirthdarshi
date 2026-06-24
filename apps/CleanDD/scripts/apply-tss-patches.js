const fs = require('fs');
const path = require('path');

const transcript =
  'C:/Users/REHMAN/.cursor/projects/e-thirthdarshi-main-thirthdarshi-main/agent-transcripts/0b13a66a-3388-4e47-8609-041adffcf514/0b13a66a-3388-4e47-8609-041adffcf514.jsonl';
const targetFile = path.join(__dirname, '../screens/TempleSearchScreen.js');

const patches = [];
for (const line of fs.readFileSync(transcript, 'utf8').split(/\n/)) {
  if (!line.includes('TempleSearchScreen.js')) continue;
  try {
    const o = JSON.parse(line);
    for (const b of o.message?.content || []) {
      if (
        b.name === 'StrReplace' &&
        b.input?.path?.includes('TempleSearchScreen') &&
        b.input.old_string &&
        b.input.new_string
      ) {
        patches.push({
          old: b.input.old_string,
          new: b.input.new_string,
        });
      }
    }
  } catch (_) {}
}

let content = fs.readFileSync(targetFile, 'utf8');
let applied = 0;
let skipped = 0;

for (let i = 0; i < patches.length; i++) {
  const { old, new: neu } = patches[i];
  if (content.includes(old)) {
    content = content.replace(old, neu);
    applied++;
    console.log(`Applied patch ${i + 1}/${patches.length}`);
  } else {
    skipped++;
    console.log(`SKIP patch ${i + 1}/${patches.length}: old_string not found`);
    console.log('  old preview:', old.slice(0, 100).replace(/\n/g, '\\n'));
  }
}

fs.writeFileSync(targetFile, content);
console.log(`\nDone: ${applied} applied, ${skipped} skipped, ${patches.length} total`);
