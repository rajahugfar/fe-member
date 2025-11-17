# Admin Menu Structure - Turnover System (โครงสร้างเมนูแอดมิน - ระบบเทิร์นโอเวอร์)

## Overview
This document describes how the Turnover System integrates into the existing admin menu structure.

## Menu Location
The Turnover Management menu should be added under the **Reports & Analytics** section, alongside other financial tracking features.

## Proposed Menu Structure

```
หน้าหลัก (Dashboard)
├── แดชบอร์ด (Dashboard)
├── จัดการสมาชิก (Members)
├── ฝาก-ถอน (Deposits & Withdrawals)
│   ├── รายการฝาก (Deposits)
│   ├── รายการถอน (Withdrawals)
│   ├── จับคู่รายการฝาก (Pending Deposits)
│
├── โปรโมชั่น (Promotions)
│   ├── จัดการโปรโมชั่น (Manage Promotions)
│   ├── สรุปโปรโมชั่น (Promotion Summary)
│
├── เกมส์และหวย (Games & Lottery)
│   ├── จัดการเกมส์ (Game Management)
│   ├── จัดการหวย (Lottery Management)
│   ├── รายการแทงหวย (Betting List)
│
├── รายงานและสถิติ (Reports & Analytics)  ⬅️ ADD HERE
│   ├── รายงานกำไร (Profit Report)
│   ├── รายงานธนาคาร (Bank Reports)
│   ├── ระบบแนะนำเพื่อน (Referral System)
│   ├── 🆕 ระบบเทิร์นโอเวอร์ (Turnover System)  ⬅️ NEW MENU
│   │   ├── ภาพรวม (Overview)
│   │   ├── สมาชิกและเทิร์น (Members & Turnover)
│   │   ├── ประวัติการแลก (Redemption History)
│   │   ├── ตั้งค่าระบบ (System Settings)
│   │
│   ├── กงล้อเสี่ยงโชค (Lucky Wheel)
│
├── ตั้งค่า (Settings)
│   ├── ตั้งค่าเว็บไซต์ (Site Settings)
│   ├── จัดการพนักงาน (Staff Management)
│   ├── บันทึกการใช้งาน (Activity Logs)
```

---

## Detailed Turnover Menu Structure

### 1. ระบบเทิร์นโอเวอร์ (Turnover System)

#### 1.1 ภาพรวม (Overview)
**Route:** `/api/v1/admin/turnover/statistics`
**Method:** `GET`

**Features:**
- 📊 สถิติรวมของระบบ (System-wide statistics)
  - จำนวนสมาชิกที่มีเทิร์น (Members with turnover)
  - ยอดเทิร์นโอเวอร์รวม (Total turnover generated)
  - ยอดแลกรวม (Total redemptions)
  - จำนวนครั้งการแลก (Redemption count)

- 📈 กราฟแสดงแนวโน้ม
  - เทิร์นโอเวอร์แยกตามแหล่งที่มา (หวย vs เกมส์)
  - ยอดแลกรายวัน/รายสัปดาห์/รายเดือน
  - Top 10 สมาชิกที่มีเทิร์นสูงสุด

**UI Components:**
```jsx
<DashboardStats>
  <StatCard title="สมาชิกที่มีเทิร์น" value={memberCount} />
  <StatCard title="เทิร์นรวม (หวย)" value={lotteryTotal} />
  <StatCard title="เทิร์นรวม (เกมส์)" value={gameTotal} />
  <StatCard title="ยอดแลกรวม" value={redeemTotal} />
</DashboardStats>

<ChartSection>
  <LineChart data={trendData} />
  <PieChart data={sourceDistribution} />
</ChartSection>
```

---

#### 1.2 สมาชิกและเทิร์น (Members & Turnover)
**Route:** `/api/v1/admin/turnover/members`
**Method:** `GET`

**Features:**
- 📋 ตารางรายการสมาชิก (Members table)
  - รหัสสมาชิก (Member ID)
  - ชื่อ-นามสกุล (Full name)
  - เบอร์โทร (Phone)
  - ยอดเทิร์นคงเหลือ (Turnover balance)
  - ยอดเทิร์นสะสม (Lifetime turnover)
  - ยอดแลกสะสม (Total redeemed)
  - วันที่แลกล่าสุด (Last redeem date)

- 🔍 ฟิลเตอร์และค้นหา
  - ค้นหาตามเบอร์โทร/ชื่อ
  - กรองตามช่วงยอดเทิร์น
  - กรองตามช่วงวันที่

- ⚡ การดำเนินการ (Actions)
  - ดูประวัติเทิร์น (View transactions)
  - ดูประวัติการแลก (View redemptions)
  - ปรับยอดเทิร์น (Adjust turnover)

**UI Components:**
```jsx
<MembersTurnoverPage>
  <FilterBar>
    <SearchInput placeholder="ค้นหาเบอร์โทร หรือ ชื่อ..." />
    <RangeFilter label="ยอดเทิร์น" min={0} max={100000} />
    <DateRangeFilter label="วันที่แลกล่าสุด" />
  </FilterBar>

  <DataTable
    columns={['รหัสสมาชิก', 'ชื่อ', 'เบอร์โทร', 'เทิร์นคงเหลือ', 'เทิร์นสะสม', 'แลกสะสม', 'แลกล่าสุด', 'จัดการ']}
    data={members}
    actions={[
      { icon: 'view', label: 'ดูประวัติ', onClick: viewHistory },
      { icon: 'adjust', label: 'ปรับยอด', onClick: adjustTurnover }
    ]}
  />
</MembersTurnoverPage>
```

**Drill-down to Member Details:**

When clicking on a member, show modal/page with:

**Route:** `/api/v1/admin/turnover/members/:id/transactions`
**Method:** `GET`

```jsx
<MemberTurnoverDetail memberId={id}>
  <MemberInfo>
    <InfoCard label="ชื่อ" value={member.fullname} />
    <InfoCard label="เบอร์โทร" value={member.phone} />
    <InfoCard label="เทิร์นคงเหลือ" value={member.turnoverBalance} highlight />
    <InfoCard label="เทิร์นสะสม" value={member.turnoverLifetime} />
  </MemberInfo>

  <TransactionHistory>
    <TabPanel>
      <Tab label="ประวัติเทิร์น" />
      <Tab label="ประวัติการแลก" />
    </TabPanel>

    <DataTable
      columns={['วันที่', 'ประเภท', 'จำนวน', 'ยอดก่อน', 'ยอดหลัง', 'หมายเหตุ']}
      data={transactions}
    />
  </TransactionHistory>

  <AdjustmentPanel>
    <Button onClick={openAdjustModal}>ปรับยอดเทิร์น</Button>
  </AdjustmentPanel>
</MemberTurnoverDetail>
```

---

#### 1.3 ประวัติการแลก (Redemption History)
**Route:** `/api/v1/admin/turnover/transactions?type=REDEEM`
**Method:** `GET`

**Features:**
- 📜 รายการการแลกเทิร์นทั้งหมด (All redemptions)
  - วันที่-เวลา (Date & time)
  - สมาชิก (Member)
  - จำนวนเทิร์นที่แลก (Turnover amount)
  - เงินที่ได้รับ (Cash received)
  - อัตราแลก (Exchange rate)
  - สถานะ (Status)

- 📊 สรุปการแลก
  - ยอดแลกรวมวันนี้
  - ยอดแลกรวมสัปดาห์นี้
  - ยอดแลกรวมเดือนนี้
  - จำนวนครั้งการแลก

**UI Components:**
```jsx
<RedemptionHistoryPage>
  <SummaryCards>
    <StatCard title="วันนี้" value={todayTotal} count={todayCount} />
    <StatCard title="สัปดาห์นี้" value={weekTotal} count={weekCount} />
    <StatCard title="เดือนนี้" value={monthTotal} count={monthCount} />
  </SummaryCards>

  <FilterBar>
    <DateRangeFilter />
    <SearchInput placeholder="ค้นหาสมาชิก..." />
  </FilterBar>

  <DataTable
    columns={['วันที่-เวลา', 'สมาชิก', 'เบอร์โทร', 'เทิร์นที่แลก', 'เงินที่ได้', 'อัตราแลก', 'สถานะ']}
    data={redemptions}
    exportable
  />
</RedemptionHistoryPage>
```

---

#### 1.4 ตั้งค่าระบบ (System Settings)
**Route:** `/api/v1/admin/turnover/config`
**Method:** `GET` / `PUT`

**Features:**
- ⚙️ การตั้งค่าพื้นฐาน (Basic settings)
  - เปิด/ปิดระบบ (Enable/Disable system)
  - อัตราแลก (Exchange rate %)
  - ยอดเทิร์นขั้นต่ำในการแลก (Min turnover to redeem)
  - ยอดแลกสูงสุดต่อวัน (Max redeem per day)

- 🎮 ตั้งค่าแหล่งที่มา (Source settings)
  - เปิด/ปิดเทิร์นจากหวย (Allow lottery turnover)
  - เปิด/ปิดเทิร์นจากเกมส์ (Allow game turnover)
  - ตัวคูณเทิร์นหวย (Lottery multiplier)
  - ตัวคูณเทิร์นเกมส์ (Game multiplier)

- 📝 คำอธิบาย (Description)
  - คำอธิบายระบบสำหรับแสดงให้สมาชิกเห็น

**UI Components:**
```jsx
<TurnoverSettingsPage>
  <SettingsForm>
    <SectionCard title="การตั้งค่าพื้นฐาน">
      <SwitchField label="เปิดใช้งานระบบเทิร์นโอเวอร์" field="isEnabled" />
      <NumberField label="อัตราแลก (%)" field="exchangeRate" suffix="%" step={0.01} />
      <NumberField label="ยอดเทิร์นขั้นต่ำในการแลก" field="minTurnoverToRedeem" suffix="บาท" />
      <NumberField label="ยอดแลกสูงสุดต่อวัน" field="maxRedeemPerDay" suffix="บาท" />
    </SectionCard>

    <SectionCard title="ตั้งค่าแหล่งที่มาเทิร์น">
      <SwitchField label="เปิดใช้งานเทิร์นจากหวย" field="allowLotteryTurnover" />
      <NumberField label="ตัวคูณเทิร์นหวย" field="lotteryTurnoverMultiplier" suffix="x" step={0.1} />

      <SwitchField label="เปิดใช้งานเทิร์นจากเกมส์" field="allowGameTurnover" />
      <NumberField label="ตัวคูณเทิร์นเกมส์" field="gameTurnoverMultiplier" suffix="x" step={0.1} />
    </SectionCard>

    <SectionCard title="คำอธิบายระบบ">
      <TextAreaField
        label="คำอธิบาย"
        field="description"
        rows={4}
        placeholder="คำอธิบายระบบเทิร์นโอเวอร์สำหรับแสดงให้สมาชิกเห็น..."
      />
    </SectionCard>

    <ActionBar>
      <Button type="submit" color="primary">บันทึกการตั้งค่า</Button>
      <Button type="reset" color="secondary">ยกเลิก</Button>
    </ActionBar>
  </SettingsForm>

  <PreviewCard>
    <h4>ตัวอย่างการแลก</h4>
    <p>เทิร์น 10,000 บาท × {config.exchangeRate}% = {10000 * config.exchangeRate / 100} บาท</p>
  </PreviewCard>
</TurnoverSettingsPage>
```

---

## Quick Actions in Other Menus

### สมาชิก (Members Page)
Add a "Turnover" column and quick action:

```jsx
<MemberListTable>
  <Column label="เทิร์นคงเหลือ" render={member => (
    <TurnoverBadge value={member.turnoverBalance} />
  )} />

  <ActionMenu>
    <ActionItem icon="turnover" label="ดูเทิร์น" onClick={() => viewTurnover(member.id)} />
    <ActionItem icon="adjust" label="ปรับเทิร์น" onClick={() => adjustTurnover(member.id)} />
  </ActionMenu>
</MemberListTable>
```

### แดชบอร์ด (Dashboard)
Add a widget showing turnover summary:

```jsx
<DashboardWidget title="เทิร์นโอเวอร์" icon="chart">
  <MiniStats>
    <Stat label="สมาชิกมีเทิร์น" value={memberCount} />
    <Stat label="เทิร์นรวมวันนี้" value={todayTotal} />
    <Stat label="แลกวันนี้" value={redeemToday} />
  </MiniStats>
  <Link to="/admin/turnover">ดูรายละเอียด →</Link>
</DashboardWidget>
```

---

## Modal: ปรับยอดเทิร์น (Adjust Turnover)

**Route:** `POST /api/v1/admin/turnover/members/:id/adjust`

```jsx
<AdjustTurnoverModal memberId={id}>
  <MemberSummary>
    <InfoRow label="สมาชิก" value={member.fullname} />
    <InfoRow label="เทิร์นปัจจุบัน" value={member.turnoverBalance} highlight />
  </MemberSummary>

  <AdjustmentForm>
    <RadioGroup label="ประเภทการปรับ" field="type">
      <Radio value="ADD" label="เพิ่มเทิร์น" />
      <Radio value="DEDUCT" label="ลดเทิร์น" />
    </RadioGroup>

    <NumberField
      label="จำนวน"
      field="amount"
      placeholder="0.00"
      required
    />

    <TextAreaField
      label="หมายเหตุ"
      field="remark"
      placeholder="ระบุเหตุผลในการปรับยอด..."
      required
    />

    <ResultPreview>
      <p>ยอดหลังปรับ: {calculateNewBalance()} บาท</p>
    </ResultPreview>

    <ActionBar>
      <Button type="submit" color="primary">ยืนยันการปรับยอด</Button>
      <Button type="button" color="secondary" onClick={close}>ยกเลิก</Button>
    </ActionBar>
  </AdjustmentForm>
</AdjustTurnoverModal>
```

---

## Permissions

### Required Permissions for Turnover Menu

| Feature | Permission Level | Description |
|---------|-----------------|-------------|
| View Overview | `ADMIN`, `SUPER_ADMIN` | View statistics and charts |
| View Members & Turnover | `ADMIN`, `SUPER_ADMIN` | View member turnover list |
| View Redemption History | `ADMIN`, `SUPER_ADMIN` | View redemption logs |
| Adjust Turnover | `SUPER_ADMIN` | Manually adjust member turnover |
| Update Settings | `SUPER_ADMIN` | Change system configuration |

---

## Notifications

### Admin Notifications for Turnover Events

1. **Large Redemption Alert**
   - Trigger: When redemption > 5000 THB
   - Notification: "⚠️ สมาชิก {phone} แลกเทิร์น {amount} บาท"

2. **High Turnover Member**
   - Trigger: When member reaches 100,000+ turnover balance
   - Notification: "💰 สมาชิก {phone} มีเทิร์นคงเหลือ {balance} บาท"

3. **System Settings Changed**
   - Trigger: When admin updates config
   - Notification: "⚙️ มีการเปลี่ยนแปลงการตั้งค่าเทิร์นโอเวอร์โดย {admin}"

---

## Summary

### API Endpoints Used in Admin Menu

| Endpoint | Method | Menu Item |
|----------|--------|-----------|
| `/api/v1/admin/turnover/config` | GET | Settings - View |
| `/api/v1/admin/turnover/config` | PUT | Settings - Update |
| `/api/v1/admin/turnover/members` | GET | Members & Turnover |
| `/api/v1/admin/turnover/statistics` | GET | Overview |
| `/api/v1/admin/turnover/members/:id/transactions` | GET | Member Details |
| `/api/v1/admin/turnover/members/:id/redemptions` | GET | Member Redemptions |
| `/api/v1/admin/turnover/members/:id/adjust` | POST | Adjust Turnover |
| `/api/v1/admin/turnover/transactions` | GET | Redemption History |

### Recommended Colors & Icons

| Item | Color | Icon |
|------|-------|------|
| Turnover Menu | 🟠 Orange (#FF8C00) | 📊 chart-line |
| Add Turnover | 🟢 Green (#10B981) | ➕ plus-circle |
| Deduct Turnover | 🔴 Red (#EF4444) | ➖ minus-circle |
| Redeem | 🔵 Blue (#3B82F6) | 💰 coins |
| Settings | ⚫ Gray (#6B7280) | ⚙️ settings |

---

## Implementation Priority

1. ✅ **Phase 1: Basic Viewing** (Completed)
   - Overview statistics
   - Members list with turnover
   - Basic filtering

2. 🔄 **Phase 2: Management** (In Progress)
   - Adjust turnover functionality
   - Redemption history with export
   - Member transaction details

3. ⏳ **Phase 3: Advanced Features** (Planned)
   - Real-time notifications
   - Advanced analytics & charts
   - Automated reports (daily/weekly email)
   - Turnover forecast & predictions

---

## Notes

- All amounts are displayed in Thai Baht (THB)
- Dates are shown in Asia/Bangkok timezone
- Implement pagination for large datasets (100 records per page)
- Add loading states for all API calls
- Implement error handling with user-friendly messages
- Add confirmation dialogs for critical actions (adjust, settings update)
- Implement audit logging for all admin actions
