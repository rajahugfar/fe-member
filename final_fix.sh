#!/bin/bash
# Fix all remaining t() syntax errors

# Fix alt={t("key") className -> alt={t("key")} className
find src -name "*.tsx" -type f -exec sed -i '' 's/alt={t(\("[^"]*"\)) className/alt={t(\1)} className/g' {} +

# Fix placeholder={t("key") NEWLINE -> placeholder={t("key")} NEWLINE
find src -name "*.tsx" -type f -exec sed -i '' 's/placeholder={t(\("[^"]*"\))$/placeholder={t(\1)}/g' {} +

# Fix title={t("key") NEWLINE -> title={t("key")} NEWLINE
find src -name "*.tsx" -type f -exec sed -i '' 's/title={t(\("[^"]*"\))$/title={t(\1)}/g' {} +

echo "✓ Fixed all remaining syntax errors"
