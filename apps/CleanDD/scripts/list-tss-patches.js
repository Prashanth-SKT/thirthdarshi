const fs = require('fs');
const p =
  'C:/Users/REHMAN/.cursor/projects/e-thirthdarshi-main-thirthdarshi-main/agent-transcripts/0b13a66a-3388-4e47-8609-041adffcf514/0b13a66a-3388-4e47-8609-041adffcf514.jsonl';
const out = [];
for (const line of fs.readFileSync(p, 'utf8').split(/\n/)) {
  if (!line.includes('TempleSearchScreen.js')) continue;
  try {
    const o = JSON.parse(line);
    for (const b of o.message?.content || []) {
      if (b.input?.path?.includes('TempleSearchScreen') && b.input.old_string) {
        out.push({
          old: b.input.old_string.slice(0, 80),
          new: (b.input.new_string || '').slice(0, 80),
        });
      }
    }
  } catch (_) {}
}
console.log(JSON.stringify(out, null, 2));
