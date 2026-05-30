import subprocess
r = subprocess.run(['git','show','2b6570d:src/lib/news.ts'], capture_output=True, text=True, cwd=r'D:\AI\AI-Hermes\li-news-project')
t = r.stdout

# Just print raw lines around deepDive to see format
lines = t.split('\n')
for i, line in enumerate(lines):
    if 'deepDive' in line:
        print(f"Line {i}: {line[:100]}")
        # Print the next 5 lines
        for j in range(1, 6):
            if i+j < len(lines):
                print(f"  +{j}: {lines[i+j][:100]}")
        print("---")
