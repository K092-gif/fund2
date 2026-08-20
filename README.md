# Fundinfo v3.2.1

Investment Discovery and Comparison Workspace สำหรับนักลงทุนไทย ใช้สำรวจ Theme, Master Fund, หุ้น และกองทุนไทยที่เกี่ยวข้อง

## ภาพรวม

Fundinfo แบ่งการสำรวจกองทุนออกเป็น 4 มุมมองหลัก:

- **Feeder Fund** — Theme → Master Fund → กองทุนไทย
- **Offshore Fund** — ภูมิภาคหรือ Theme → หุ้นต่างประเทศ → กองทุนไทยที่ถือ
- **Thai Fund** — SET Industry Group → หุ้นไทย → กองทุนไทยที่ถือ
- **Mixed Fund** — ส่วนผสมสินทรัพย์ → กองทุน → นโยบายและความเสี่ยง

## ฟีเจอร์หลัก

- เปรียบเทียบหลาย Theme, Master Fund หรือหุ้นบนกราฟเดียว
- เรียงสีและ Legend ตามลำดับที่ผู้ใช้เลือก
- แสดงจุดอ้างอิง เช่น MSCI ACWI และ SET TRI
- Theme trend แบบ 1YTD
  - สีเขียวเมื่อผลตอบแทนเป็นบวก
  - สีแดงเมื่อผลตอบแทนเป็นลบ
- Ranking 3 มุม
  - เงินไหลเข้าสูงสุด
  - ผลตอบแทนสูงสุด
  - จ่ายปันผลสูงสุด
- แสดง Return, Max Drawdown และผลต่างเทียบ Benchmark
- Fund Screener พร้อมตัวกรองผลตอบแทน ความเสี่ยง Sharpe Ratio และค่าธรรมเนียม
- ตารางกองทุนพร้อมรายละเอียดแบบหลายลิ้นชัก
- รองรับการเปิดรายละเอียดหลายกองทุนพร้อมกัน
- Watchlist และ Dark Mode

## วิธีเปิดใช้งาน

### วิธีที่ 1: เปิดไฟล์โดยตรง

ดาวน์โหลดและเปิดไฟล์ `fundinfo-phrase2-v3.2.1.html` ด้วยเว็บเบราว์เซอร์

### วิธีที่ 2: รันผ่าน Local Server

เปิด Terminal ภายในโฟลเดอร์ Repository แล้วใช้คำสั่ง:

```bash
python3 -m http.server 8000
```

จากนั้นเปิด:

```text
http://localhost:8000
```

หน้าเว็บเรียกใช้ Google Fonts, Tailwind CSS และ Chart.js ผ่าน CDN จึงต้องเชื่อมต่ออินเทอร์เน็ต

## โครงสร้าง Repository

```text
fundinfo-v3.2.1/
├── fundinfo-phrase2-v3.2.1.html   # เว็บไซต์ทั้งหมด: HTML, CSS, JavaScript และข้อมูลตัวอย่าง
├── README.md    # ภาพรวมและวิธีใช้งาน
└── .gitignore
```

## Business Rules สำคัญ

- กองทุนหนึ่งกองต้องมี Primary Fund Type เดียว
- ลำดับการจัดประเภทคือ Feeder → Offshore → Thai → Mixed → Unclassified
- Search, Ranking, Comparison และ Fund Table ต้องใช้ Fund Universe เดียวกัน
- กราฟเปรียบเทียบต้องใช้ช่วงเวลา สกุลเงิน และฐานคำนวณเดียวกัน
- Official Benchmark และ Common Reference ต้องมีป้ายกำกับแยกกันชัดเจน
- หากข้อมูลไม่มีหรือไม่เหมาะสม ให้แสดง `N/A`
- ห้ามใช้ `0` แทนข้อมูลที่ไม่มี

## ขอบเขตข้อมูลใน Prototype

ข้อมูลต่อไปนี้เป็นข้อมูลตัวอย่างสำหรับทดสอบ UX/UI:

- NAV
- Performance
- Holdings
- Fund Flow
- Valuation
- Fund Risk
- Benchmark
- คำอธิบายกองทุน

ระบบปัจจุบันยังไม่ได้เชื่อมต่อฐานข้อมูลหรือ API จริง

## สิ่งที่ต้องทำก่อนใช้งานจริง

1. เชื่อม Fund Master, NAV, Holdings และ Benchmark API
2. พัฒนา Fund Classification Service
3. ยืนยันกฎ Fund Universe และเกณฑ์สัดส่วน 80%
4. กำหนดแหล่งข้อมูลและเจ้าของข้อมูล
5. ระบุรอบอัปเดตและ `as_of_date`
6. ตรวจสอบสิทธิ์การใช้ Benchmark และข้อมูลตลาด
7. ทำ Data Reconciliation และ Freshness Monitoring
8. พัฒนา Error State และ Data Unavailable State
9. ทดสอบ Responsive Design และ Accessibility
10. ทดสอบ Browser Compatibility และ Performance
11. แยก HTML, CSS, JavaScript และ Data Layer ก่อนพัฒนา Production

## แนวทางสำหรับทีมพัฒนา

- ใช้ `fundinfo-phrase2-v3.2.1.html` เป็น UX Reference และ Interaction Baseline
- หลีกเลี่ยงการคำนวณ Fund Classification ซ้ำที่ Frontend
- รักษาลำดับ Selection และสีของกราฟให้สอดคล้องกัน
- ใช้ Controlled Taxonomy สำหรับ Theme, Region และ Industry
- ทุก Metric ต้องมีนิยาม หน่วย สกุลเงิน แหล่งข้อมูล และวันที่ข้อมูล
- Search, Ranking และ Comparison ต้องใช้ Universe จาก Backend เดียวกัน
