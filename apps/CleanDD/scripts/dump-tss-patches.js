const fs = require('fs');
const path = require('path');

const transcript =
  'C:/Users/REHMAN/.cursor/projects/e-thirthdarshi-main-thirthdarshi-main/agent-transcripts/0b13a66a-3388-4e47-8609-041adffcf514/0b13a66a-3388-4e47-8609-041adffcf514.jsonl';
const targetFile = path.join(__dirname, '../screens/TempleSearchScreen.js');
const outDir = path.join(__dirname, 'tss-patches-out');
fs.mkdirSync(outDir, { recursive: true });

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
        patches.push({ old: b.input.old_string, new: b.input.new_string });
      }
    }
  } catch (_) {}
}

const content = fs.readFileSync(targetFile, 'utf8');
patches.forEach((p, i) => {
  const found = content.includes(p.old);
  fs.writeFileSync(path.join(outDir, `patch-${i + 1}-${found ? 'FOUND' : 'MISS'}.md`), 
    `# Patch ${i + 1} (${found ? 'FOUND' : 'MISSING'})\n\n## OLD\n\`\`\`\n${p.old}\n\`\`\`\n\n## NEW\n\`\`\`\n${p.new}\n\`\`\`\n`);
});
console.log(`Wrote ${patches.length} patch files to ${outDir}`);
