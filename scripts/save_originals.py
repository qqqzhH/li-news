import subprocess, re, json
r = subprocess.run(['git','show','2b6570d:src/lib/news.ts'], capture_output=True, text=True, cwd=r'D:\AI\AI-Hermes\li-news-project')
t = r.stdout
start = t.find('const hardcodedData')
data_section = t[start:]
parts = data_section.split('deepDive: [')
originals = []
for i, part in enumerate(parts[1:], 1):
    end_marker = part.find('      }')
    arr_text = part[:end_marker]
    strings = re.findall(r'"([^"]*?)"', arr_text)
    originals = [s for s in strings if not s.startswith('##') and len(s) > 10]  # Keep content lines
with open(r'D:\AI\AI-Hermes\li-news-project\scripts\original_deep_dives.json', 'w', encoding='utf-8') as f:
    json.dump(originals, f, ensure_ascii=False, indent=2)
print(f"Saved {len(originals)} original deep dives")
for i, dd in enumerate(originals[:2]):
    print(f"\n#{i+1}: {dd[:120]}")
