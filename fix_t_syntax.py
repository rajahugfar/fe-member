#!/usr/bin/env python3
"""
Fix incorrect {t()} syntax in JSX
Changes {t("key")} to t("key") where appropriate
"""
import re
import glob

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Fix patterns like: { name: {t("key")} }
        # Should be: { name: t("key") }
        content = re.sub(r':\s*\{t\(', ': t(', content)

        # Fix patterns like: {isLoading ? 'text' : {t("key")}}
        # Should be: {isLoading ? 'text' : t("key")}
        content = re.sub(r'\?\s*([^:]+)\s*:\s*\{t\(', r'? \1 : t(', content)

        # Fix patterns like: {copied ? 'text' : {t("key")}}
        content = re.sub(r'(\w+)\s*\?\s*([^:]+)\s*:\s*\{t\(', r'\1 ? \2 : t(', content)

        # Fix patterns in data structures: text: {t("key")}
        content = re.sub(r'(text|label|name):\s*\{t\(', r'\1: t(', content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

# Find all TypeScript/TSX files
patterns = [
    "src/pages/*.tsx",
    "src/pages/**/*.tsx",
    "src/components/**/*.tsx",
]

all_files = []
for pattern in patterns:
    all_files.extend(glob.glob(pattern, recursive=True))

print(f"Found {len(all_files)} files")
print("Fixing files...\n")

fixed = 0
for filepath in all_files:
    if fix_file(filepath):
        print(f"✓ Fixed {filepath}")
        fixed += 1

print(f"\nCompleted! {fixed}/{len(all_files)} files fixed")
