import subprocess, json, re
r = subprocess.run(['git','show','2b6570d:src/lib/news.ts'], capture_output=True, text=True, cwd=r'D:\AI\AI-Hermes\li-news-project')
t = r.stdout

# Find deepDive arrays - they look like deepDive: [\n  "...",\n  "...",\n]
items_raw = t.split('    deepDive: [')
result = []

for chunk in items_raw[1:]:  # skip header
    # Extract the array content - ends with \n    },]
    end = chunk.find('\n    }]')
    if end > 0:
        array_content = chunk[:end]
        # Extract all the quoted strings
        strings = re.findall(r'"([^"\\]*(?:\\.[^"\\]*)*)"', array_content)
        # Rejoin with newlines
        deep_dive_text = '\n'.join(strings)
        
        # Try to find the title for this item
        # Look backwards for title field
        title_match = re.search(r'title:\s*"(.*?)"', array_content)
        title = title_match.group(1) if title_match else "?"
        
        result.append({"title": title[:40], "deepDive": deep_dive_text})

print(f"Found {len(result)} original deep dives")
for r2 in result[:2]:
    print(f"\n--- {r2['title']} ---")
    print(r2['deepDive'][:200])

# Save JSON
with open(r'D:\AI\AI-Hermes\li-news-project\scripts\original_deep_dives.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(f"\nSaved to scripts/original_deep_dives.json")
