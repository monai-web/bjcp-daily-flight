# BJCP Daily Flight

เกมฝึกสไตล์เบียร์ BJCP วันละ ~30 นาที — Appearance / Aroma / Flavor / Mouthfeel / Overall + Off-flavor Clinic

**เล่น:** https://monai-web.github.io/bjcp-daily-flight/

## โหมด
- นักสืบสไตล์ — เปิดคำบรรยายทีละหมวดแล้วทาย
- ประกอบ Scoresheet — เลือกประโยคให้ถูกช่อง
- คู่แฝด — แยกสองสไตล์ที่ใกล้กัน
- ไม่เข้าพวก + กะค่า SRM / IBU / ABV
- Off-flavor Clinic — ระบุ → ตัดสินตามสไตล์ → สาเหตุ → คำแนะนำ
- Spaced repetition (1 → 2 → 4 → 8 → 16 → 32 วัน), XP, เลเวล, เหรียญ

## การซิงก์ความคืบหน้า
เกมเป็นไฟล์ `index.html` ไฟล์เดียว (static) แล้วซิงก์ความคืบหน้ากับ Google Sheet ผ่าน Google Apps Script Web App

- เปิดครั้งแรกบนเครื่องใหม่ด้วยลิงก์ที่มี `?k=<รหัสซิงก์>` (หรือใส่รหัสในแท็บโปรไฟล์) — รหัสไม่อยู่ใน repo นี้
- ถ้าออฟไลน์ เกมเก็บในเบราว์เซอร์ไว้ก่อน แล้วซิงก์เมื่อออนไลน์
- โค้ดฝั่ง Apps Script: [`apps-script/Code.gs`](apps-script/Code.gs) (แม่แบบ — ค่า SHEET_ID / SECRET / FOLDER_ID จริงอยู่ในโปรเจกต์ Apps Script ของเจ้าของเท่านั้น)

## ที่มาข้อมูล
- คำบรรยายสไตล์ + Vital Statistics: BJCP 2021 Beer Style Guidelines (EN) และฉบับแปลไทย
- Off-flavor: BJCP Beer Fault List + หนังสือ Beer Faults (TH) โดย SPACEMAN
- ระดับความถี่ A/B/C, การจัดกลุ่ม "ไม่ควรมี / ยอมรับระดับต่ำ / ควรมี", ตัวหลอก และสีจำลอง SRM เป็นการจัดของผู้สร้างแอป (อนุมาน)
