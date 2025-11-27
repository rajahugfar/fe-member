#!/bin/bash
# Fix ALL remaining t() syntax errors

# Fix toast.error({t("key")}) -> toast.error(t("key"))
find src -name "*.tsx" -type f -exec sed -i '' 's/toast\.error({t(/toast.error(t(/g' {} +
find src -name "*.tsx" -type f -exec sed -i '' 's/toast\.success({t(/toast.success(t(/g' {} +
find src -name "*.tsx" -type f -exec sed -i '' 's/toast\.info({t(/toast.info(t(/g' {} +
find src -name "*.tsx" -type f -exec sed -i '' 's/toast\.warning({t(/toast.warning(t(/g' {} +

# Remove extra closing braces after t() calls
find src -name "*.tsx" -type f -exec sed -i '' 's/t("\([^"]*\)")}))/t("\1"))/g' {} +

echo "✓ Fixed all toast and remaining syntax errors"
