#!/usr/bin/env python3
"""
Auto translate Thai text in React files to use i18n
"""
import re
import os
import glob

# Comprehensive mapping of Thai text to i18n keys
TRANSLATIONS = {
    # Dashboard & Common
    "แดชบอร์ด": "member:dashboard.title",
    "ยินดีต้อนรับ": "member:dashboard.welcome",
    "ยอดเงินคงเหลือ": "member:credit.balance",
    "ฝากวันนี้": "member:dashboard.todayDeposit",
    "ถอนวันนี้": "member:dashboard.todayWithdrawal",
    "แทงวันนี้": "member:dashboard.todayBet",
    "ถูกรางวัล": "member:dashboard.todayWin",
    "กำไรวันนี้": "member:dashboard.todayProfit",
    "กำไร/ขาดทุน": "member:dashboard.todayProfit",
    "สถิติวันนี้": "member:dashboard.title",

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

    # Status
    "รอดำเนินการ": "common:status.pending",
    "กำลังดำเนินการ": "common:status.processing",
    "สำเร็จ": "common:status.success",
    "ล้มเหลว": "common:status.failed",
    "ไม่สำเร็จ": "common:status.failed",
    "ถูกปฏิเสธ": "common:status.rejected",
    "อนุมัติ": "common:status.approved",
    "เสร็จสิ้น": "common:status.completed",

    # Messages
    "กำลังโหลด...": "common:messages.loading",
    "กำลังโหลดข้อมูล...": "common:messages.loading",
    "ไม่มีข้อมูล": "common:messages.noData",
    "ยังไม่มีรายการ": "common:messages.noData",
    "เกิดข้อผิดพลาด": "common:messages.error",
    "โหลดข้อมูลไม่สำเร็จ": "common:messages.error",

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

    # Profile
    "โปรไฟล์": "member:profile.title",
    "ข้อมูลส่วนตัว": "member:profile.personalInfo",
    "บัญชีธนาคาร": "member:profile.bankAccount",
    "เปลี่ยนรหัสผ่าน": "member:profile.changePassword",
    "ชื่อ-นามสกุล": "member:profile.fullName",
    "เบอร์โทรศัพท์": "member:profile.phone",
    "ไลน์ไอดี": "member:profile.lineId",
    "ธนาคาร": "member:profile.bankName",
    "เลขที่บัญชี": "member:profile.accountNumber",
    "ชื่อบัญชี": "member:profile.accountName",
    "รหัสผ่านปัจจุบัน": "member:profile.currentPassword",
    "รหัสผ่านใหม่": "member:profile.newPassword",
    "ยืนยันรหัสผ่านใหม่": "member:profile.confirmPassword",

    # Deposit
    "เลือกวิธีการฝาก": "member:deposit.selectMethod",
    "ระบุจำนวนเงิน": "member:deposit.enterAmount",
    "อัปโหลดสลิป": "member:deposit.uploadSlip",
    "โค้ดโปรโมชั่น": "member:deposit.promoCode",
    "ฝากขั้นต่ำ": "member:deposit.minimumDeposit",

    # Withdrawal
    "ถอนขั้นต่ำ": "member:withdrawal.minimumWithdrawal",
    "เครดิตที่ถอนได้": "member:withdrawal.availableBalance",
    "บัญชีที่รับเงิน": "member:withdrawal.bankAccount",

    # Transaction
    "ประวัติธุรกรรม": "transaction:history",
    "ประวัติฝาก": "transaction:depositHistory",
    "ประวัติถอน": "transaction:withdrawalHistory",
    "ประวัติโบนัส": "transaction:bonusHistory",
    "ไม่มีรายการธุรกรรม": "transaction:noTransactions",

    # Lottery
    "แทงหวย": "lottery:betting",
    "ผลหวย": "lottery:results",
    "ประวัติแทง": "lottery:history",
    "ประวัติแทงหวย": "lottery:history",
    "หวยที่เปิดรับ": "member:dashboard.activeLotteries",
    "ไม่มีหวยที่เปิดรับ": "common:messages.noData",
    "3 ตัวบน": "lottery:betTypes.teng_bon_3",
    "3 ตัวโต๊ด": "lottery:betTypes.tode_3",
    "3 ตัวล่าง": "lottery:betTypes.teng_lang_3",
    "2 ตัวบน": "lottery:betTypes.teng_bon_2",
    "2 ตัวล่าง": "lottery:betTypes.teng_lang_2",
    "วิ่งบน": "lottery:betTypes.teng_bon_1",
    "วิ่งล่าง": "lottery:betTypes.teng_lang_1",
    "ยืนยันการแทง": "lottery:confirmBet",
    "แทงหวยสำเร็จ": "lottery:betSuccess",
    "ยกเลิกโพย": "lottery:cancelBet",
    "ปิดรับ": "lottery:closed",
    "เปิดรับแทง": "lottery:opened",
    "งวดวันที่": "lottery:periods",

    # Promotion
    "โปรโมชั่นพิเศษ": "promotion:title",
    "รับโปรโมชั่น": "promotion:claim",
    "รับแล้ว": "promotion:claimed_status",
    "รับโปรโมชั่นสำเร็จ": "promotion:claimSuccess",

    # Auth
    "เข้าสู่ระบบ": "auth:login.title",
    "สมัครสมาชิก": "auth:register.title",
    "ลืมรหัสผ่าน": "auth:login.forgotPassword",
    "รหัสผ่าน": "auth:login.password",
    "จำฉันไว้": "auth:login.rememberMe",

    # Game
    "เล่นเลย": "game:playNow",
    "ทดลองเล่น": "game:demo",
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
    if "import React" in content and "import { useTranslation }" not in content:
        content = re.sub(
            r"(import React[^\n]*\n)",
            r"\1import { useTranslation } from 'react-i18next'\n",
            content,
            count=1
        )

    # Add hook in functional component
    component_pattern = r'(const\s+\w+:\s*React\.FC[^=]*=\s*(?:\([^)]*\))?\s*=>\s*\{)'
    match = re.search(component_pattern, content)
    if match:
        insert_pos = match.end()
        # Check if not already added
        next_lines = content[insert_pos:insert_pos+200]
        if 'const { t }' not in next_lines:
            content = content[:insert_pos] + "\n  const { t } = useTranslation()" + content[insert_pos:]

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

        # Also match with single quotes
        pattern2 = f"'{re.escape(thai_text)}'"
        if pattern2 in content:
            content = content.replace(pattern2, replacement)
            changed = True

        # Match in JSX text nodes (without quotes)
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

        # Add useTranslation
        content = add_use_translation(content, filepath)

        # Translate text
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
    # Process member pages
    member_files = glob.glob("src/pages/member/*.tsx")

    print(f"Found {len(member_files)} member pages")
    print("Processing files...\n")

    updated = 0
    for filepath in member_files:
        filename = os.path.basename(filepath)
        print(f"Processing {filename}...", end=" ")
        if process_file(filepath):
            print("✓ Updated")
            updated += 1
        else:
            print("- No changes")

    print(f"\nCompleted! {updated}/{len(member_files)} files updated")

if __name__ == "__main__":
    main()
