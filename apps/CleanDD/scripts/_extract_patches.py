import json

path = r'C:\Users\REHMAN\.cursor\projects\e-thirthdarshi-main-thirthdarshi-main\agent-transcripts\0b13a66a-3388-4e47-8609-041adffcf514\0b13a66a-3388-4e47-8609-041adffcf514.jsonl'
out = r'e:\thirthdarshi-main\thirthdarshi-main\apps\CleanDD\screens\_patch_0b13.txt'
chunks = []
with open(path, encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        obj = json.loads(line)
        for part in obj.get('message', {}).get('content', []):
            if part.get('type') == 'tool_use' and part.get('name') == 'StrReplace':
                inp = part.get('input', {})
                if 'OnboardingScreen' in inp.get('path', ''):
                    chunks.append(
                        f'=== LINE {i} ===\nOLD:\n{inp.get("old_string", "")}\n\nNEW:\n{inp.get("new_string", "")}\n'
                    )
with open(out, 'w', encoding='utf-8') as fo:
    fo.write('\n\n'.join(chunks))
print(len(chunks), 'patches')
