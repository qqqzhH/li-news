import subprocess, re, json

r = subprocess.run(['git','show','2b6570d:src/lib/news.ts'], capture_output=True, text=True, cwd=r'D:\AI\AI-Hermes\li-news-project')
t = r.stdout

# Extract all deepDive backtick strings
matches = list(re.finditer(r'deepDive:\s*`([^`]+)`', t))
print(f"Found {len(matches)} deep dive entries")

# Also extract titles for matching
titles = list(re.finditer(r'title:\s*`([^`]+)`|title:\s*\"([^\"]+)\"', t))
print(f"Found {len(titles)} titles")

# Save deep dives to a JSON file for reference
deep_dives = []
for i, m in enumerate(matches):
    dd = m.group(1)
    title = ""
    if i < len(titles):
        title = titles[i].group(1) or titles[i].group(2) or ""
    deep_dives.append({"idx": i, "title": title[:40], "deepDive": dd[:200]})

for dd in deep_dives[:3]:
    print(f"\n--- #{dd['idx']} {dd['title']} ---")
    print(dd['deepDive'])

# Save full data
with open(r'D:\AI\AI-Hermes\li-news-project\original_deep_dives.json', 'w') as f:
    json.dump([{"idx": i, "title": (titles[i].group(1) or titles[i].group(2) or "")[:40] if i < len(titles) else "", "deepDive": m.group(1)} for i, m in enumerate(matches)], f, ensure_ascii=False, indent=2)
print(f"\nSaved {len(matches)} original deep dives")
