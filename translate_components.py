#!/usr/bin/env python3
import re, os, glob

TRANSLATIONS = {
    # Same as before - copy all translations
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
    "รอดำเนินการ": "common:status.pending",
    "สำเร็จ": "common:status.success",
    "ล้มเหลว": "common:status.failed",
    "กำลังโหลด...": "common:messages.loading",
    "ไม่มีข้อมูล": "common:messages.noData",
    "เกิดข้อผิดพลาด": "common:messages.error",
    "หน้าแรก": "navigation:menu.home",
    "ฝากเงิน": "navigation:menu.deposit",
    "ถอนเงิน": "navigation:menu.withdraw",
    "โปรโมชั่น": "navigation:menu.promotions",
    "โปรไฟล์": "navigation:menu.profile",
    "ธุรกรรม": "navigation:menu.transactions",
    "หวย": "navigation:menu.lottery",
    "เกมส์": "navigation:menu.games",
    "ออกจากระบบ": "navigation:menu.logout",
    "เข้าสู่ระบบ": "auth:login.title",
    "สมัครสมาชิก": "auth:register.title",
    "ยอดเงินคงเหลือ": "member:credit.balance",
}

def process(content, filepath):
    if 'useTranslation' not in content and filepath.endswith('.tsx'):
        if "import React" in content or "import {" in content:
            imports = re.findall(r'^import .*$', content, re.MULTILINE)
            if imports:
                last_import = imports[-1]
                pos = content.find(last_import) + len(last_import)
                content = content[:pos] + "\nimport { useTranslation } from 'react-i18next'" + content[pos:]
        
        patterns = [r'(const\s+\w+:\s*React\.FC[^=]*=\s*(?:\([^)]*\))?\s*=>\s*\{)', r'(const\s+\w+\s*=\s*\(\)\s*=>\s*\{)']
        for p in patterns:
            m = re.search(p, content)
            if m:
                pos = m.end()
                if 'const { t }' not in content[pos:pos+200]:
                    content = content[:pos] + "\n  const { t } = useTranslation()" + content[pos:]
                break
    
    changed = False
    for thai, key in TRANSLATIONS.items():
        for q in ['"', "'"]:
            pattern = f'{q}{re.escape(thai)}{q}'
            if pattern in content:
                content = content.replace(pattern, f'{{t("{key}")}}')
                changed = True
        pattern = f'>{thai}<'
        if pattern in content:
            content = content.replace(pattern, f'>{{t("{key}")}}<')
            changed = True
    return content, changed

files = glob.glob("src/components/**/*.tsx", recursive=True)
print(f"Found {len(files)} components")
updated = 0
for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            orig = fp.read()
        new, ch = process(orig, f)
        if new != orig:
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(new)
            print(f"✓ {os.path.basename(f)}")
            updated += 1
    except: pass
print(f"\n{updated}/{len(files)} updated")
