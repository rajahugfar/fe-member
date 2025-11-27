#!/usr/bin/env python3
import re
import os
import sys

# Text replacements for all files
REPLACEMENTS = [
    # Common buttons and actions
    (r'"ยืนยัน"', r't("common:buttons.submit")'),
    (r'"ยกเลิก"', r't("common:buttons.cancel")'),
    (r'"บันทึก"', r't("common:buttons.save")'),
    (r'"แก้ไข"', r't("common:buttons.edit")'),
    (r'"ลบ"', r't("common:buttons.delete")'),
    (r'"ปิด"', r't("common:buttons.close")'),
    (r'"ค้นหา"', r't("common:buttons.search")'),
    (r'"รีเฟรช"', r't("common:buttons.refresh")'),
    (r'"คัดลอก"', r't("common:buttons.copy")'),

    # Status
    (r'"รอดำเนินการ"', r't("common:status.pending")'),
    (r'"สำเร็จ"', r't("common:status.success")'),
    (r'"ล้มเหลว"', r't("common:status.failed")'),
    (r'"ยกเลิก"', r't("common:status.cancelled")'),

    # Member/Dashboard
    (r'"แดชบอร์ด"', r't("member:dashboard.title")'),
    (r'"ยินดีต้อนรับ"', r't("member:dashboard.welcome")'),
    (r'"ยอดเงินคงเหลือ"', r't("member:credit.balance")'),
    (r'"เครดิต"', r't("member:credit.credit")'),

    # Navigation
    (r'"หน้าแรก"', r't("navigation:menu.home")'),
    (r'"ฝากเงิน"', r't("navigation:menu.deposit")'),
    (r'"ถอนเงิน"', r't("navigation:menu.withdraw")'),
    (r'"โปรโมชั่น"', r't("navigation:menu.promotions")'),
    (r'"โปรไฟล์"', r't("navigation:menu.profile")'),
    (r'"ธุรกรรม"', r't("navigation:menu.transactions")'),
    (r'"ประวัติ"', r't("navigation:menu.history")'),
    (r'"หวย"', r't("navigation:menu.lottery")'),
    (r'"เกมส์"', r't("navigation:menu.games")'),

    # Auth
    (r'"เข้าสู่ระบบ"', r't("auth:login.title")'),
    (r'"สมัครสมาชิก"', r't("auth:register.title")'),
    (r'"ออกจากระบบ"', r't("navigation:menu.logout")'),
    (r'"เบอร์โทรศัพท์"', r't("auth:login.username")'),
    (r'"รหัสผ่าน"', r't("auth:login.password")'),
    (r'"ลืมรหัสผ่าน"', r't("auth:login.forgotPassword")'),

    # Transaction
    (r'"ประวัติธุรกรรม"', r't("transaction:history")'),
    (r'"ประวัติฝาก"', r't("transaction:depositHistory")'),
    (r'"ประวัติถอน"', r't("transaction:withdrawalHistory")'),
    (r'"ไม่มีรายการ"', r't("transaction:noTransactions")'),

    # Lottery
    (r'"แทงหวย"', r't("lottery:betting")'),
    (r'"ผลหวย"', r't("lottery:results")'),
    (r'"ประวัติแทง"', r't("lottery:history")'),

    # Messages
    (r'"กำลังโหลด..."', r't("common:messages.loading")'),
    (r'"ไม่มีข้อมูล"', r't("common:messages.noData")'),
    (r'"เกิดข้อผิดพลาด"', r't("common:messages.error")'),
]

def translate_file(filepath):
    """Apply translations to a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if file already imports useTranslation
        if 'useTranslation' not in content and filepath.endswith('.tsx'):
            # Add import if it's a React component
            if 'import React' in content:
                content = content.replace(
                    "import React",
                    "import React\nimport { useTranslation } from 'react-i18next'"
                )
                # Add hook after component declaration
                component_match = re.search(r'const\s+\w+:\s*React\.FC.*?=\s*\(\)\s*=>\s*{', content)
                if component_match:
                    insert_pos = component_match.end()
                    content = content[:insert_pos] + "\n  const { t } = useTranslation()" + content[insert_pos:]

        # Apply all text replacements
        original_content = content
        for pattern, replacement in REPLACEMENTS:
            content = re.sub(pattern, replacement, content)

        # Only write if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    base_dir = "src/pages/member"
    if not os.path.exists(base_dir):
        print(f"Directory {base_dir} not found")
        return

    files_changed = 0
    for filename in os.listdir(base_dir):
        if filename.endswith('.tsx'):
            filepath = os.path.join(base_dir, filename)
            print(f"Processing {filename}...")
            if translate_file(filepath):
                files_changed += 1
                print(f"  ✓ Updated")
            else:
                print(f"  - No changes")

    print(f"\nCompleted! {files_changed} files updated")

if __name__ == "__main__":
    main()
