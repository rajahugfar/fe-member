#!/usr/bin/env python3
"""
Auto translate Thai text in public pages to use i18n
"""
import re
import os
import glob

# Same translations as member pages
TRANSLATIONS = {
    # Dashboard & Common
    "แดชบอร์ด": "member:dashboard.title",
    "ยินดีต้อนรับ": "member:dashboard.welcome",
    "ยอดเงินคงเหลือ": "member:credit.balance",
    "ฝากวันนี้": "member:dashboard.todayDeposit",
    "ถอนวันนี้": "member:dashboard.todayWithdrawal",

    # Actions
    "ยืนยัน": "common:buttons.submit",
    "ยกเลิก": "common:buttons.cancel",
    "บันทึก": "common:buttons.save",
    "แก้ไข": "common:buttons.edit",
    "ลบ": "common:buttons.delete",
    "ปิด": "common:buttons.close",
    "ย้อนกลับ": "common:buttons.back",
    "ถัดไป": "common:buttons.next",
    "ค้นหา": "common:buttons.search",
    "รีเฟรช": "common:buttons.refresh",
    "คัดลอก": "common:buttons.copy",
    "ดูทั้งหมด": "common:buttons.view",
    "ดูรายละเอียด": "common:buttons.view",
    "อัปโหลด": "common:buttons.upload",
    "เพิ่ม": "common:buttons.add",
    "เล่นเลย": "game:playNow",

    # Status
    "รอดำเนินการ": "common:status.pending",
    "กำลังดำเนินการ": "common:status.processing",
    "สำเร็จ": "common:status.success",
    "ล้มเหลว": "common:status.failed",
    "ไม่สำเร็จ": "common:status.failed",

    # Messages
    "กำลังโหลด...": "common:messages.loading",
    "กำลังโหลดข้อมูล...": "common:messages.loading",
    "ไม่มีข้อมูล": "common:messages.noData",
    "ยังไม่มีรายการ": "common:messages.noData",
    "เกิดข้อผิดพลาด": "common:messages.error",

    # Navigation
    "หน้าแรก": "navigation:menu.home",
    "ฝากเงิน": "navigation:menu.deposit",
    "ถอนเงิน": "navigation:menu.withdraw",
    "โปรโมชั่น": "navigation:menu.promotions",
    "โปรไฟล์": "navigation:menu.profile",
    "ธุรกรรม": "navigation:menu.transactions",
    "ประวัติ": "navigation:menu.history",
    "หวย": "navigation:menu.lottery",
    "เกมส์": "navigation:menu.games",
    "เกม": "navigation:menu.games",
    "แนะนำเพื่อน": "navigation:menu.affiliate",
    "ออกจากระบบ": "navigation:menu.logout",

    # Auth
    "เข้าสู่ระบบ": "auth:login.title",
    "สมัครสมาชิก": "auth:register.title",
    "ลืมรหัสผ่าน": "auth:login.forgotPassword",
    "รหัสผ่าน": "auth:login.password",
    "จำฉันไว้": "auth:login.rememberMe",
    "เบอร์โทรศัพท์": "auth:login.username",
    "ยังไม่มีบัญชี": "auth:login.noAccount",
    "มีบัญชีอยู่แล้ว": "auth:register.haveAccount",

    # Transaction
    "ประวัติธุรกรรม": "transaction:history",
    "ประวัติฝาก": "transaction:depositHistory",
    "ประวัติถอน": "transaction:withdrawalHistory",

    # Lottery
    "แทงหวย": "lottery:betting",
    "ผลหวย": "lottery:results",

    # Promotion
    "โปรโมชั่นพิเศษ": "promotion:title",

    # Game
    "คาสิโน": "game:categories.casino",
    "สล็อต": "game:categories.slot",
}

def add_use_translation(content, filepath):
    """Add useTranslation import and hook if not present"""
    if 'useTranslation' in content:
        return content

    if not filepath.endswith('.tsx'):
        return content

    # Add import
    if "import React" in content or "import {" in content:
        if "import { useTranslation }" not in content:
            # Find last import statement
            imports = re.findall(r'^import .*$', content, re.MULTILINE)
            if imports:
                last_import = imports[-1]
                insert_pos = content.find(last_import) + len(last_import)
                content = content[:insert_pos] + "\nimport { useTranslation } from 'react-i18next'" + content[insert_pos:]

    # Add hook in functional component
    patterns = [
        r'(const\s+\w+:\s*React\.FC[^=]*=\s*(?:\([^)]*\))?\s*=>\s*\{)',
        r'(const\s+\w+\s*=\s*\([^)]*\)\s*:\s*JSX\.Element\s*=>\s*\{)',
        r'(const\s+\w+\s*=\s*\(\)\s*=>\s*\{)',
    ]

    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            insert_pos = match.end()
            next_lines = content[insert_pos:insert_pos+200]
            if 'const { t }' not in next_lines:
                content = content[:insert_pos] + "\n  const { t } = useTranslation()" + content[insert_pos:]
            break

    return content

def translate_text(content):
    """Replace Thai text with t() calls"""
    changed = False

    for thai_text, i18n_key in TRANSLATIONS.items():
        # Match quoted strings
        pattern = f'"{re.escape(thai_text)}"'
        replacement = f'{{t("{i18n_key}")}}'

        if pattern in content:
            content = content.replace(pattern, replacement)
            changed = True

        pattern2 = f"'{re.escape(thai_text)}'"
        if pattern2 in content:
            content = content.replace(pattern2, replacement)
            changed = True

        pattern3 = f'>{thai_text}<'
        replacement3 = f'>{{t("{i18n_key}")}}<'
        if pattern3 in content:
            content = content.replace(pattern3, replacement3)
            changed = True

    return content, changed

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content
        content = add_use_translation(content, filepath)
        content, text_changed = translate_text(content)

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    # Process all non-admin, non-member pages
    patterns = [
        "src/pages/*.tsx",
        "src/pages/auth/*.tsx",
        "src/pages/transactions/*.tsx",
        "src/pages/promotions/*.tsx",
        "src/pages/profile/*.tsx",
        "src/pages/games/*.tsx",
        "src/pages/lottery/*.tsx",
    ]

    all_files = []
    for pattern in patterns:
        all_files.extend(glob.glob(pattern))

    print(f"Found {len(all_files)} public pages")
    print("Processing files...\n")

    updated = 0
    for filepath in all_files:
        filename = os.path.basename(filepath)
        print(f"Processing {filename}...", end=" ")
        if process_file(filepath):
            print("✓ Updated")
            updated += 1
        else:
            print("- No changes")

    print(f"\nCompleted! {updated}/{len(all_files)} files updated")

if __name__ == "__main__":
    main()
