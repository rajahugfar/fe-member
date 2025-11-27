#!/usr/bin/env python3
"""
Fix ALL remaining brace issues in i18n implementation
"""
import re
import glob

def fix_file(filepath):
    """Fix a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Fix: toast.error({t("key")}) -> toast.error(t("key"))
        content = re.sub(r'\(([\w.]+)\(\{t\(', r'(\1(t(', content)

        # Fix: label: t("key")} } -> label: t("key") }
        content = re.sub(r't\("([^"]+)"\)\}\s*\}', r't("\1") }', content)

        # Fix: label: t("key")} }, -> label: t("key") },
        content = re.sub(r't\("([^"]+)"\)\}\s*\},', r't("\1") },', content)

        # Fix: ? 'text' : t("key")}} -> ? 'text' : t("key")}
        content = re.sub(r't\("([^"]+)"\)\}\}', r't("\1")}', content)

        # Fix remaining double closing braces after t()
        content = re.sub(r't\("([^"]+)"\)\}([,\s])', r't("\1")\2', content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

# Find all files
patterns = [
    "src/**/*.tsx",
    "src/**/*.ts",
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
