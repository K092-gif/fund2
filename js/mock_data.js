/* ==========================================================================
   MOCK FINANCIAL & CONTENT DATABASE FOR IDEA FUND PORTAL
   Contains:
   1. FUNDS (400 synthesized & base funds)
   2. THEME_FLOWS & THEMES (Insights)
   3. UPTREND_FUNDS & VALUATION_FUNDS (Insights)
   4. STOCKS_DB
   5. ARTICLES_LIST & FEATURED_ARTICLE (Migrat Articles tab)
   6. FAQ_LIST (31 full Q&As from Migrat Faq seed database)
   ========================================================================== */

const FUNDS = [
  { id: 'SCBNDQ', type: 'feeder', sector: 'Technology', name: 'ไทยพาณิชย์ หุ้นสหรัฐเทคโนโลยี (NASDAQ100)', amc: 'SCB', amcFull: 'ไทยพาณิชย์', nav: 18.42, chg1d: 0.84, ret1m: 3.8, perf: 28.5, ret3y: 19.4, risk: 6, div: 0.0, aum: 24500, master: 'Invesco NASDAQ-100 ETF (QQQM)', holdings: [['NVIDIA', 9.1], ['Apple', 8.8], ['Microsoft', 8.0], ['Broadcom', 4.8], ['Amazon', 4.6]], starred: true },
  { id: 'TNDQ', type: 'feeder', sector: 'Technology', name: 'ธนชาต หุ้นสหรัฐ NASDAQ100', amc: 'ES', amcFull: 'อีสท์สปริง', nav: 15.68, chg1d: 0.82, ret1m: 3.7, perf: 28.2, ret3y: 19.1, risk: 6, div: 0.0, aum: 18400, master: 'Invesco NASDAQ-100 ETF (QQQM)', holdings: [['NVIDIA', 9.1], ['Apple', 8.8], ['Microsoft', 8.0], ['Broadcom', 4.8], ['Amazon', 4.6]], starred: false },
  { id: 'KF-GTECH', type: 'feeder', sector: 'Technology', name: 'กรุงศรี โกลบอลเทคโนโลยีอิควิตี้', amc: 'KSAM', amcFull: 'กรุงศรี', nav: 24.15, chg1d: 1.12, ret1m: 4.2, perf: 26.8, ret3y: 18.2, risk: 6, div: 0.0, aum: 14200, master: 'T. Rowe Price Global Tech', holdings: [['Microsoft', 8.4], ['NVIDIA', 7.9], ['Apple', 6.5], ['TSMC', 5.2], ['Amazon', 4.8]], starred: true },
  { id: 'ONE-UGG-RA', type: 'feeder', sector: 'Technology', name: 'วรรณ อัลติเมท โกลบอล โกรท', amc: 'ONE', amcFull: 'วรรณ', nav: 16.92, chg1d: 0.65, ret1m: 3.1, perf: 24.3, ret3y: 15.6, risk: 6, div: 0.0, aum: 9800, master: 'Baillie Gifford Long Term Global', holdings: [['NVIDIA', 7.5], ['Amazon', 6.2], ['ASML', 5.4], ['Tesla', 4.8], ['Moderna', 3.9]], starred: false },
  { id: 'K-CHANGE', type: 'feeder', sector: 'Index', name: 'กสิกร หุ้นโลกเปลี่ยนโลก (Positive Change)', amc: 'KA', amcFull: 'กสิกรไทย', nav: 14.85, chg1d: 0.45, ret1m: 1.8, perf: 18.4, ret3y: 11.2, risk: 6, div: 0.0, aum: 15400, master: 'Baillie Gifford Positive Change', holdings: [['NVIDIA', 5.4], ['ASML', 4.9], ['MercadoLibre', 4.2], ['TSMC', 3.8], ['Moderna', 3.1]], starred: false },
  { id: 'SCBGOLDH', type: 'feeder', sector: 'Gold', name: 'ไทยพาณิชย์ ทองคำ ป้องกันความเสี่ยง', amc: 'SCB', amcFull: 'ไทยพาณิชย์', nav: 21.45, chg1d: 0.75, ret1m: 4.5, perf: 21.0, ret3y: 16.8, risk: 8, div: 0.0, aum: 39800, master: 'SPDR Gold Shares (GLD)', holdings: [['Physical Gold Bullion', 99.5]], starred: true },
  { id: 'K-USXNDQ-A(A)', type: 'feeder', sector: 'Technology', name: 'กสิกร หุ้นดัชนีสหรัฐ (USXNDQ)', amc: 'KA', amcFull: 'กสิกรไทย', nav: 17.82, chg1d: 0.81, ret1m: 3.6, perf: 27.8, ret3y: 18.7, risk: 6, div: 0.0, aum: 22100, master: 'Invesco QQQ Trust', holdings: [['Apple', 9.0], ['Microsoft', 8.5], ['NVIDIA', 8.2], ['Amazon', 4.5]], starred: false },
  { id: 'B-INNOTECH', type: 'feeder', sector: 'Technology', name: 'บัวหลวงหุ้นอินโนเวชั่นและเทคโนโลยี', amc: 'BBL', amcFull: 'บัวหลวง', nav: 19.30, chg1d: 0.95, ret1m: 3.9, perf: 21.4, ret3y: 14.8, risk: 6, div: 0.0, aum: 11500, master: 'Fidelity Global Tech Fund', holdings: [['Microsoft', 8.1], ['Apple', 7.4], ['TSMC', 6.2], ['Alphabet', 5.1]], starred: false },
  
  // Offshore Direct Funds
  { id: 'KGHEALTH', type: 'offshore', sector: 'Health Care', name: 'กสิกร สุขภาพโลก (Global Healthcare)', amc: 'KA', amcFull: 'กสิกรไทย', nav: 16.40, chg1d: 0.32, ret1m: 2.1, perf: 14.2, ret3y: 9.8, risk: 6, div: 0.5, aum: 12800, master: 'MSCI World Health Care', holdings: [['Eli Lilly', 6.2], ['UnitedHealth', 5.1], ['Novo Nordisk', 4.7], ['J&J', 4.0]], starred: false },
  { id: 'SCBCHA', type: 'offshore', sector: 'Index', name: 'ไทยพาณิชย์ หุ้นจีน A-Shares', amc: 'SCB', amcFull: 'ไทยพาณิชย์', nav: 9.85, chg1d: -0.42, ret1m: -1.2, perf: 3.2, ret3y: -8.4, risk: 6, div: 0.0, aum: 28400, master: 'CSI 300 Direct', holdings: [['Kweichow Moutai', 5.8], ['CATL', 4.9], ['Ping An', 3.6], ['BYD', 2.9]], starred: false },
  { id: 'KKPGNP', type: 'offshore', sector: 'Index', name: 'เกียรตินาคินภัทร หุ้นโลก (Global Equity)', amc: 'KKP', amcFull: 'เกียรตินาคินภัทร', nav: 15.20, chg1d: 0.54, ret1m: 2.4, perf: 13.2, ret3y: 10.1, risk: 6, div: 0.3, aum: 14200, master: 'MSCI ACWI Direct', holdings: [['Microsoft', 3.4], ['Novo Nordisk', 2.8], ['Meta', 2.5], ['TSMC', 2.3]], starred: false },
  { id: 'TUSFIN', type: 'offshore', sector: 'Fixed Income', name: 'ธนชาต ตราสารหนี้โลก (Global Bond)', amc: 'ES', amcFull: 'อีสท์สปริง', nav: 11.45, chg1d: 0.15, ret1m: 0.8, perf: 6.4, ret3y: 4.0, risk: 4, div: 1.8, aum: 7400, master: 'Bloomberg Global Agg', holdings: [['US Treasury 10Y', 6.0], ['German Bund', 4.2], ['US Treasury 5Y', 3.8]], starred: false },

  // Thai Funds
  { id: 'BEQUITY', type: 'thai', sector: 'Index', name: 'บัวหลวงหุ้นระยะยาว (B-EQUITY)', amc: 'BBL', amcFull: 'บัวหลวง', nav: 38.65, chg1d: 0.28, ret1m: 1.4, perf: 4.8, ret3y: 2.4, risk: 6, div: 1.2, aum: 18600, master: 'SET Direct Active', holdings: [['DELTA', 8.4], ['GULF', 6.1], ['PTT', 5.2], ['ADVANC', 4.8], ['KBANK', 4.2]], starred: false },
  { id: 'SCBSET50', type: 'thai', sector: 'Index', name: 'ไทยพาณิชย์ ดัชนี SET50', amc: 'SCB', amcFull: 'ไทยพาณิชย์', nav: 16.24, chg1d: 0.46, ret1m: 1.8, perf: 5.6, ret3y: 1.9, risk: 6, div: 2.1, aum: 16100, master: 'SET50 Passive', holdings: [['DELTA', 10.1], ['AOT', 6.4], ['PTT', 5.9], ['ADVANC', 5.2], ['CPALL', 4.7]], starred: false },
  { id: 'BDIVSET', type: 'thai', sector: 'Finance', name: 'บีแคป หุ้นไทยปันผลสูง', amc: 'BCAP', amcFull: 'บีแคป', nav: 13.80, chg1d: 0.35, ret1m: 1.2, perf: 8.9, ret3y: 6.2, risk: 6, div: 4.8, aum: 11900, master: 'SETHD Direct', holdings: [['PTT', 6.8], ['ADVANC', 6.0], ['KTB', 5.1], ['INTUCH', 4.4], ['TISCO', 3.9]], starred: false },
  { id: 'ABSM', type: 'thai', sector: 'Energy', name: 'abrdn หุ้นไทยเล็ก-กลาง (Small/Mid Cap)', amc: 'ab', amcFull: 'abrdn', nav: 22.10, chg1d: -0.15, ret1m: 0.6, perf: 7.1, ret3y: 5.8, risk: 6, div: 0.8, aum: 8900, master: 'sSET Active', holdings: [['BJC', 4.2], ['COM7', 3.8], ['BCH', 3.3], ['AMATA', 3.0]], starred: false },

  // Mixed Funds
  { id: 'BMIXED75', type: 'mixed', sector: 'Multi-Asset', name: 'บัวหลวงผสม 75/25', amc: 'BBL', amcFull: 'บัวหลวง', nav: 28.40, chg1d: 0.32, ret1m: 2.1, perf: 12.4, ret3y: 8.0, risk: 5, div: 0.9, aum: 9800, master: 'Multi-Asset Blend', holdings: [['DELTA', 10.1], ['พันธบัตร ธปท.', 6.3], ['GULF', 5.4], ['พันธบัตรรัฐบาล', 5.1]], starred: false },
  { id: 'KFAMSALL', type: 'mixed', sector: 'Multi-Asset', name: 'กรุงศรี ผสมหลากสินทรัพย์โลก', amc: 'KSAM', amcFull: 'กรุงศรี', nav: 14.20, chg1d: 0.40, ret1m: 1.9, perf: 9.4, ret3y: 6.8, risk: 5, div: 1.1, aum: 6200, master: 'Global Multi-Asset', holdings: [['iShares MSCI ACWI', 12.0], ['พันธบัตรรัฐบาลไทย', 10.0], ['SPDR Gold', 8.0]], starred: false },
  { id: 'ONEMIX', type: 'mixed', sector: 'Multi-Asset', name: 'วรรณ ผสมหุ้น + ทองคำ', amc: 'ONE', amcFull: 'วรรณ', nav: 17.65, chg1d: 0.58, ret1m: 2.8, perf: 15.2, ret3y: 10.4, risk: 5, div: 0.7, aum: 4300, master: 'Equity & Gold Allocation', holdings: [['SPDR Gold', 25.0], ['DELTA', 5.2], ['NVIDIA', 4.0], ['PTT', 3.4]], starred: false },
  { id: 'SCBCONSER', type: 'mixed', sector: 'Fixed Income', name: 'ไทยพาณิชย์ ผสมระมัดระวัง (Conservative)', amc: 'SCB', amcFull: 'ไทยพาณิชย์', nav: 12.90, chg1d: 0.12, ret1m: 0.5, perf: 5.2, ret3y: 3.8, risk: 4, div: 1.6, aum: 5600, master: 'Conservative Allocation', holdings: [['พันธบัตรรัฐบาล 5Y', 9.0], ['หุ้นกู้ PTT', 4.0], ['DELTA', 3.2]], starred: false }
];

// Synthesize 400 realistic mock funds
(function generate400Funds() {
  const types = ['feeder', 'offshore', 'thai', 'mixed'];
  const amcs = ['SCB', 'KA', 'BBL', 'ES', 'KSAM', 'ab', 'BCAP', 'ONE', 'KKP'];
  const amcMap = { SCB: 'ไทยพาณิชย์', KA: 'กสิกรไทย', BBL: 'บัวหลวง', ES: 'อีสท์สปริง', KSAM: 'กรุงศรี', ab: 'abrdn', BCAP: 'บีแคป', ONE: 'วรรณ', KKP: 'เกียรตินาคินภัทร' };
  const sectors = ['Technology', 'Health Care', 'Energy', 'Finance', 'Fixed Income', 'Gold', 'Index', 'Multi-Asset'];
  const baseLen = FUNDS.length;
  
  for (let i = baseLen + 1; i <= 400; i++) {
    const type = types[i % types.length];
    const amc = amcs[i % amcs.length];
    const sector = sectors[i % sectors.length];
    const seed = i * 17;
    const perf = +( (seed % 35) - 4 + (type === 'feeder' ? 8 : 0) ).toFixed(1);
    const nav = +( 10 + (seed % 25) + (i % 7) * 0.35 ).toFixed(4);
    const ret1m = +( (perf * 0.12) + (i % 3) * 0.2 ).toFixed(1);
    const ret3y = +( (perf * 0.72) + 2.1 ).toFixed(1);
    const chg1d = +( ((seed % 19) - 8) * 0.1 ).toFixed(2);
    const risk = type === 'mixed' ? (seed % 2 === 0 ? 4 : 5) : type === 'feeder' ? 6 : 6;
    const div = seed % 3 === 0 ? +(1.0 + (seed % 4) * 0.8).toFixed(1) : 0.0;
    const aum = 1200 + (seed % 80) * 250;

    const codeSuffix = type === 'feeder' ? '-GLOBAL' : type === 'thai' ? '-EQ' : type === 'mixed' ? '-MIX' : '-OFF';
    const fundCode = `${amc}${i}${codeSuffix}`;
    const fundName = `${amcMap[amc]} กองทุน${type === 'feeder' ? 'โอกาสโลก' : type === 'thai' ? 'หุ้นไทยศักยภาพ' : type === 'mixed' ? 'ผสมสมดุล' : 'ต่างประเทศเฉพาะทาง'} ซีรีส์ ${i}`;

    FUNDS.push({
      id: fundCode,
      type: type,
      sector: sector,
      name: fundName,
      amc: amc,
      amcFull: amcMap[amc],
      nav: nav,
      chg1d: chg1d,
      ret1m: ret1m,
      perf: perf,
      ret3y: ret3y,
      risk: risk,
      div: div,
      aum: aum,
      master: type === 'feeder' ? 'Global Core Index Master ETF' : 'Direct Securities Basket',
      holdings: [['Top Asset 1', 12.0], ['Top Asset 2', 9.5], ['Top Asset 3', 7.2], ['Top Asset 4', 5.0], ['Top Asset 5', 4.5]],
      starred: i % 15 === 0
    });
  }
})();

// Global Fund Flow Theme Breakdown Mock Data
const THEME_FLOWS = [
  { theme: 'ปัญญาประดิษฐ์และเซมิคอนดักเตอร์ (AI & Semiconductor)', net: 342, perf: 31.5, pos: true, pct: 85 },
  { theme: 'หุ้นเทคโนโลยีขนาดใหญ่สหรัฐฯ (US Mega-Cap Tech)', net: 195, perf: 28.4, pos: true, pct: 68 },
  { theme: 'ทองคำและโลหะมีค่า (Gold & Precious Metals)', net: 120, perf: 21.0, pos: true, pct: 54 },
  { theme: 'นวัตกรรมสุขภาพและยาลดน้ำหนัก (Healthcare & Biotech)', net: 84, perf: 14.2, pos: true, pct: 42 },
  { theme: 'หุ้นญี่ปุ่นและธรรมาภิบาล (Japan Corporate Reforms)', net: 45, perf: 12.3, pos: true, pct: 30 },
  { theme: 'หุ้นอินเดียและการบริโภคในประเทศ (India Infrastructure)', net: 38, perf: 16.7, pos: true, pct: 28 },
  { theme: 'หุ้นกลุ่มประเทศอาเซียน (ASEAN Small/Mid Cap)', net: -42, perf: 2.4, pos: false, pct: 25 },
  { theme: 'หุ้นพลังงานสะอาดและ ESG (Clean Energy & Solar)', net: -65, perf: -5.4, pos: false, pct: 35 },
  { theme: 'หุ้นจีนแผ่นดินใหญ่ A-Shares (China Recovery)', net: -110, perf: 3.2, pos: false, pct: 48 }
];

const THEMES = ['Miscellaneous', 'Global Equity', 'US Equity', 'Technology Equity', 'Global Bond', 'Commodities Precious Metals', 'China Equity - A Shares', 'Health Care', 'Asia Pacific Ex Japan', 'Vietnam Equity', 'Clean Energy', 'Japanese Equity', 'Dividend Aristocrats'];

// Uptrend Funds Table Mock Data
const UPTREND_FUNDS = [
  { id: 'SCBNDQ', name: 'ไทยพาณิชย์ หุ้นสหรัฐเทคโนโลยี (NASDAQ100)', type: 'Feeder', ret1y: '+28.5%', ret3y: '+19.4%', risk: 6, amc: 'SCBAM', momentum: 96 },
  { id: 'KF-GTECH', name: 'กรุงศรี โกลบอลเทคโนโลยีอิควิตี้', type: 'Feeder', ret1y: '+26.8%', ret3y: '+18.2%', risk: 6, amc: 'KSAM', momentum: 94 },
  { id: 'ONE-UGG-RA', name: 'วรรณ อัลติเมท โกลบอล โกรท', type: 'Feeder', ret1y: '+24.3%', ret3y: '+15.6%', risk: 6, amc: 'ONEAM', momentum: 91 },
  { id: 'SCBGOLDH', name: 'ไทยพาณิชย์ ทองคำ ป้องกันความเสี่ยง', type: 'Commodity', ret1y: '+21.0%', ret3y: '+16.8%', risk: 8, amc: 'SCBAM', momentum: 89 },
  { id: 'B-INNOTECH', name: 'บัวหลวงหุ้นอินโนเวชั่นและเทคโนโลยี', type: 'Feeder', ret1y: '+21.4%', ret3y: '+14.8%', risk: 6, amc: 'BBLAM', momentum: 88 },
  { id: 'K-USXNDQ-A(A)', name: 'กสิกร หุ้นดัชนีสหรัฐ (USXNDQ)', type: 'Feeder', ret1y: '+20.2%', ret3y: '+17.4%', risk: 6, amc: 'KAsset', momentum: 86 },
  { id: 'TDEX', name: 'กองทุนเปิดไทยเด็กซ์ SET50 ETF', type: 'Thai ETF', ret1y: '+38.1%', ret3y: '+14.2%', risk: 6, amc: 'ONEAM', momentum: 85 },
  { id: '1DIV', name: 'กองทุนเปิดไทยเด็กซ์ SET High Dividend', type: 'Thai ETF', ret1y: '+48.9%', ret3y: '+22.5%', risk: 6, amc: 'ONEAM', momentum: 84 }
];

// Valuation Table Mock Data
const VALUATION_FUNDS = [
  { id: 'SCBCHA', name: 'ไทยพาณิชย์ หุ้นจีน A-Shares', zone: 'Undervalued (ถูกมาก)', zoneColor: 'emerald', pe: '11.2x', upside: '+28.4%', div: '0.0%', aum: '฿4,820M', amc: 'SCBAM' },
  { id: 'BDIVSET', name: 'บีแคป หุ้นไทยปันผลสูง (High Dividend)', zone: 'Undervalued (ปันผลสูง)', zoneColor: 'emerald', pe: '9.8x', upside: '+18.5%', div: '4.8%', aum: '฿3,240M', amc: 'BCAP' },
  { id: 'KGHEALTH', name: 'กสิกร สุขภาพโลก (Global Healthcare)', zone: 'Fair Value (ปานกลาง)', zoneColor: 'blue', pe: '18.5x', upside: '+14.2%', div: '0.5%', aum: '฿12,800M', amc: 'KAsset' },
  { id: 'BEQUITY', name: 'บัวหลวงหุ้นระยะยาว (B-EQUITY)', zone: 'Fair Value (สมเหตุสมผล)', zoneColor: 'blue', pe: '14.6x', upside: '+9.8%', div: '1.2%', aum: '฿18,600M', amc: 'BBLAM' },
  { id: 'TUSFIN', name: 'ธนชาต ตราสารหนี้โลก (Global Bond)', zone: 'Fair Value (Yield 5.4%)', zoneColor: 'blue', pe: '—', upside: '+12.0%', div: '1.8%', aum: '฿7,400M', amc: 'Eastspring' },
  { id: 'SCBNDQ', name: 'ไทยพาณิชย์ หุ้นสหรัฐเทคโนโลยี (NASDAQ100)', zone: 'Premium (ราคาตึงตัว)', zoneColor: 'amber', pe: '31.2x', upside: '+6.5%', div: '0.0%', aum: '฿24,500M', amc: 'SCBAM' },
  { id: 'K-CHANGE', name: 'กสิกร หุ้นโลกเปลี่ยนโลก (Positive Change)', zone: 'Fair Value (Growth)', zoneColor: 'blue', pe: '24.8x', upside: '+15.4%', div: '0.0%', aum: '฿15,400M', amc: 'KAsset' }
];

// Stocks Database
const STOCKS_DB = {
  'NVIDIA': { ticker: 'NVDA', sector: 'Semiconductor • US', ret: '+62.4%', pe: '38.2x', funds: ['SCBNDQ', 'KF-GTECH', 'K-CHANGE', 'ONE-UGG-RA'] },
  'Apple': { ticker: 'AAPL', sector: 'Consumer Tech • US', ret: '+12.1%', pe: '31.4x', funds: ['SCBNDQ', 'TNDQ', 'B-INNOTECH'] },
  'Microsoft': { ticker: 'MSFT', sector: 'Cloud & AI Software • US', ret: '+18.9%', pe: '33.5x', funds: ['SCBNDQ', 'KF-GTECH', 'KKPGNP'] },
  'DELTA': { ticker: 'DELTA.BK', sector: 'Electronic Components • TH', ret: '-12.0%', pe: '52.3x', funds: ['SCBSET50', 'BEQUITY', 'BMIXED75'] },
  'AOT': { ticker: 'AOT.BK', sector: 'Transportation & Tourism • TH', ret: '-6.4%', pe: '36.8x', funds: ['SCBSET50', 'BEQUITY'] },
  'PTT': { ticker: 'PTT.BK', sector: 'Energy & Utilities • TH', ret: '-3.1%', pe: '9.4x', funds: ['BDIVSET', 'SCBSET50', 'BEQUITY'] }
};

/* ==========================================================================
   ARTICLES MOCK DATA (MATCHING MIGRAT ARTICLESVIEW)
   ========================================================================== */
const FEATURED_ARTICLE = {
  id: 1,
  title: 'เจาะลึกทิศทางเศรษฐกิจโลกและกลยุทธ์จัดพอร์ตกองทุนครึ่งหลังปี 2026',
  excerpt: 'วิเคราะห์แนวโน้มอัตราดอกเบี้ยนโยบายเฟด ทิศทางหุ้นเทคโนโลยี AI และกลยุทธ์การกระจายความเสี่ยงสู่ตลาดเกิดใหม่และสินทรัพย์ปลอดภัย',
  thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  date: 'August 28, 2026',
  category: 'foreign'
};

const ARTICLES_LIST = [
  {
    id: 101,
    title: 'คู่มือเลือกกองทุนรวมฉบับมือใหม่: NAV, ค่าธรรมเนียม และความเสี่ยงดูอย่างไร',
    excerpt: 'ทำความเข้าใจคำศัพท์พื้นฐานสำคัญก่อนตัดสินใจซื้อกองทุนรวมแรก เพื่อสร้างผลตอบแทนที่ยั่งยืนและลดความเสี่ยง',
    thumbnail: 'https://images.unsplash.com/photo-1579524419137-33a7e5f15d22?w=800&q=80',
    date: 'August 25, 2026',
    category: 'start'
  },
  {
    id: 102,
    title: 'สรุป 5 กองทุนหุ้นไทยปันผลสูง (SETHD) กระแสเงินสดสม่ำเสมอยามตลาดผันผวน',
    excerpt: 'คัดกรองกองทุนหุ้นไทยที่มีประวัติจ่ายเงินปันผลต่อเนื่อง P/E ไม่แพง และมีสถานะทางการเงินแข็งแกร่งในตลาด SET',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    date: 'August 22, 2026',
    category: 'thai'
  },
  {
    id: 103,
    title: 'ทำไมหุ้นเทคสหรัฐฯ ยังคงเป็นพอร์ตหลักระยะยาวของนักลงทุนทั่วโลก',
    excerpt: 'วิเคราะห์การเติบโตของกำไรบริษัทในดัชนี NASDAQ-100 จากกระแส AI Data Center และคลาวด์คอมพิวติ้ง',
    thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    date: 'August 18, 2026',
    category: 'foreign'
  },
  {
    id: 104,
    title: 'อัปเดต Fund Flow ล่าสุด: เม็ดเงินไหลเข้ากองทุนทองคำและเซมิคอนดักเตอร์สูงสุด',
    excerpt: 'รายงานกระแสเงินทุนสากลประจำสัปดาห์ สะท้อนพฤติกรรมนักลงทุนสถาบันที่หมุนเวียนกลุ่มอุตสาหกรรม',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    date: 'August 15, 2026',
    category: 'news'
  },
  {
    id: 105,
    title: 'เปรียบเทียบ DCA กองทุนดัชนี vs ซื้อหุ้นรายตัว: แบบไหนเหมาะกับคุณ',
    excerpt: 'เจาะลึกข้อดีข้อเสียของกลยุทธ์ Dollar-Cost Averaging ในกองทุนดัชนีเทียบกับการเลือกหุ้นรายตัว',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
    date: 'August 10, 2026',
    category: 'start'
  },
  {
    id: 106,
    title: 'แนวโน้มกองทุนหุ้นจีน A-Shares: จังหวะสะสมในระดับ Valuation ที่น่าสนใจ?',
    excerpt: 'ประเมินดัชนี CSI 300 หลังมาตรการกระตุ้นเศรษฐกิจและการบริโภค พร้อมความเสี่ยงที่ยังต้องติดตาม',
    thumbnail: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&q=80',
    date: 'August 5, 2026',
    category: 'foreign'
  }
];

/* ==========================================================================
   FULL FAQ SEED DATABASE (31 ITEMS DIRECT FROM MIGRAT WORDPRESS SEED)
   ========================================================================== */
const FAQ_LIST = [
  // ── เริ่มต้นลงทุน (start) ──
  {
    id: 1,
    category: 'start',
    question: 'การลงทุน คืออะไร',
    answer: 'การลงทุน คือ การนำเงินหรือทรัพยากรที่มีอยู่ไปจัดสรรในสินทรัพย์ประเภทต่าง ๆ โดยคาดหวังให้เกิดผลตอบแทนในอนาคต ซึ่งอาจอยู่ในรูปของกำไร เงินปันผล หรือมูลค่าที่เพิ่มขึ้น ทั้งนี้การลงทุนมีความเสี่ยง ผู้ลงทุนจึงควรศึกษาข้อมูลก่อนตัดสินใจเสมอ'
  },
  {
    id: 2,
    category: 'start',
    question: 'การลงทุนต่างจากการออม อย่างไร',
    answer: 'การออมมุ่งเน้นการรักษาเงินต้นและสภาพคล่อง มีความเสี่ยงต่ำ แต่ผลตอบแทนต่ำ ในขณะที่การลงทุนยอมรับความเสี่ยงที่สูงขึ้นเพื่อแลกกับโอกาสได้รับผลตอบแทนที่มากกว่าในระยะยาว'
  },
  {
    id: 3,
    category: 'start',
    question: 'ดอกเบี้ยทบต้น คืออะไร',
    answer: 'ดอกเบี้ยทบต้นคือการนำผลตอบแทนที่ได้รับกลับไปลงทุนต่อ ทำให้เงินเติบโตแบบทวีคูณเมื่อเวลาผ่านไป ยิ่งเริ่มต้นลงทุนเร็ว ผลของพลังดอกเบี้ยทบต้นจะยิ่งเด่นชัดมากขึ้น'
  },
  {
    id: 4,
    category: 'start',
    question: 'การลงทุนมี กี่ประเภท',
    answer: 'การลงทุนมีหลายประเภท เช่น เงินฝาก กองทุนรวม หุ้น ตราสารหนี้ และอสังหาริมทรัพย์ แต่ละประเภทมีลักษณะและความเสี่ยงแตกต่างกัน ควรจัดสรรให้เหมาะกับเป้าหมายทางการเงิน'
  },
  {
    id: 5,
    category: 'start',
    question: 'กองทุนรวม คืออะไร',
    answer: 'กองทุนรวม คือ การรวบรวมเงินจากผู้ลงทุนหลายราย และให้ผู้จัดการกองทุนมืออาชีพ (บลจ.) บริหารจัดการลงทุนตามนโยบายที่กำหนดไว้ในหนังสือชี้ชวน ช่วยให้ผู้ลงทุนรายย่อยกระจายความเสี่ยงได้โดยใช้เงินเริ่มต้นไม่มาก'
  },
  {
    id: 6,
    category: 'start',
    question: 'กองทุนรวมมี กี่ประเภท',
    answer: 'แบ่งตามสินทรัพย์หลักได้แก่ กองทุนตลาดเงิน, กองทุนตราสารหนี้, กองทุนผสม, กองทุนหุ้น (ตราสารทุน) และกองทุนสินทรัพย์ทางเลือก เช่น ทองคำ อสังหาริมทรัพย์ หรือสินค้าโภคภัณฑ์'
  },
  {
    id: 7,
    category: 'start',
    question: 'เงินปันผล คืออะไร',
    answer: 'เงินปันผล คือ ผลตอบแทนส่วนหนึ่งที่บริษัทหรือกองทุนรวมจ่ายคืนให้แก่ผู้ถือหุ้นหรือผู้ถือหน่วยลงทุนจากกำไรสะสมหรือกำไรสุทธิของการดำเนินงาน'
  },
  {
    id: 8,
    category: 'start',
    question: 'DCA คืออะไร',
    answer: 'DCA (Dollar-Cost Averaging) คือ การลงทุนแบบถัวเฉลี่ยต้นทุน โดยลงทุนเป็นงวด ๆ ด้วยจำนวนเงินเท่ากันอย่างสม่ำเสมอ เช่น ทุกเดือน ช่วยลดอารมณ์ในการจับจังหวะตลาดและสร้างวินัยการออม'
  },
  {
    id: 9,
    category: 'start',
    question: 'NAV คืออะไร',
    answer: 'NAV (Net Asset Value) คือ มูลค่าทรัพย์สินสุทธิต่อหน่วยลงทุน ใช้เป็นราคาซื้อและขายคืนกองทุนรวม การเปลี่ยนแปลงของ NAV สะท้อนผลการดำเนินงานของกองทุน หาก NAV เพิ่มขึ้น แสดงว่ามูลค่าการลงทุนเพิ่มขึ้นตามไปด้วย'
  },
  {
    id: 10,
    category: 'start',
    question: 'NAV เปลี่ยนแปลงจากอะไร',
    answer: 'ขึ้นกับมูลค่าของหลักทรัพย์หรือสินทรัพย์ที่กองทุนถือครองอยู่ รวมถึงผลกำไร ขาดทุน ดอกเบี้ย เงินปันผลรับ และหักด้วยค่าใช้จ่ายและค่าธรรมเนียมในการบริหารจัดการกองทุน'
  },
  {
    id: 11,
    category: 'start',
    question: 'เงินปันผลต้องเสียภาษี หรือไม่',
    answer: 'โดยทั่วไปเงินปันผลจากกองทุนรวมในประเทศไทยจะถูกหักภาษี ณ ที่จ่าย 10% ซึ่งผู้ลงทุนสามารถเลือกให้หัก ณ ที่จ่ายแล้วจบ (Final Tax) โดยไม่ต้องนำมารวมคำนวณภาษีปลายปีได้'
  },
  {
    id: 12,
    category: 'start',
    question: 'ขายกองทุนได้กำไรต้องเสียภาษี หรือไม่',
    answer: 'กำไรส่วนต่างจากการขายคืนหน่วยลงทุน (Capital Gain) ของกองทุนรวมที่จดทะเบียนในประเทศไทย สำหรับบุคคลธรรมดา ได้รับการยกเว้นภาษีเงินได้'
  },
  {
    id: 13,
    category: 'start',
    question: 'หนังสือชี้ชวน คืออะไร',
    answer: 'เป็นเอกสารทางกฎหมายที่แสดงรายละเอียดสำคัญ เช่น นโยบายการลงทุน กลยุทธ์ สัดส่วนสินทรัพย์ ระดับความเสี่ยง และค่าธรรมเนียมต่าง ๆ ของกองทุน ผู้ลงทุนควรอ่าน Fund Fact Sheet ก่อนลงทุนทุกครั้ง'
  },
  {
    id: 14,
    category: 'start',
    question: 'ควรอ่านข้อมูลใดก่อนลงทุน',
    answer: 'ควรตรวจสอบนโยบายการลงทุน, ดัชนีชี้วัด (Benchmark), ผลการดำเนินงานย้อนหลัง, ระดับความเสี่ยง (1-8), ค่าธรรมเนียมซื้อ/ขาย/การจัดการ และสภาพคล่องในการไถ่ถอน'
  },

  // ── กองทุนไทย (thai) ──
  {
    id: 15,
    category: 'thai',
    question: 'บลจ. คืออะไร และมีบทบาทอย่างไร',
    answer: 'บริษัทหลักทรัพย์จัดการกองทุน (บลจ.) ทำหน้าที่บริหารเงินลงทุนของผู้ถือหน่วยลงทุนให้เป็นไปตามนโยบายกองทุน ภายใต้กรอบกฎหมายและการกำกับดูแลของสำนักงาน ก.ล.ต.'
  },
  {
    id: 16,
    category: 'thai',
    question: 'กองทุนรวมไทยคืออะไร และแตกต่างจากการลงทุนแบบอื่นอย่างไร',
    answer: 'กองทุนรวมไทย คือ การลงทุนที่อยู่ภายใต้การกำกับดูแลของสำนักงาน ก.ล.ต. โดยเป็นการรวบรวมเงินจากผู้ลงทุนหลายราย แล้วให้ บลจ. นำเงินไปลงทุนตามนโยบาย ความแตกต่างจากหุ้นรายตัวคือผู้ลงทุนไม่ต้องเฝ้าหน้าจอหรือตัดสินใจซื้อขายเองทั้งหมด แต่มีผู้จัดการกองทุนช่วยบริหารและกระจายความเสี่ยง'
  },
  {
    id: 17,
    category: 'thai',
    question: 'กองทุนรวมไทยมีความปลอดภัยแค่ไหน',
    answer: 'กองทุนรวมไม่ใช่การลงทุนที่ไม่มีความเสี่ยง แต่มีความโปร่งใสสูง เนื่องจากทรัพย์สินของกองทุนถูกแยกออกจากทรัพย์สินของ บลจ. และมีผู้ดูแลผลประโยชน์ (Trustee) คอยตรวจสอบการทำงานเพื่อคุ้มครองสิทธิของผู้ลงทุน'
  },
  {
    id: 18,
    category: 'thai',
    question: 'กองทุนรวมไทยเกี่ยวข้องกับภาษีอย่างไรบ้าง',
    answer: 'กำไรจากการขายกองทุนรวมไทยได้รับการยกเว้นภาษี ส่วนเงินปันผลหัก ณ ที่จ่าย 10% นอกจากนี้ยังมีกองทุนสิทธิประโยชน์ภาษี เช่น SSF, RMF และ Thai ESG ที่ช่วยลดหย่อนภาษีเงินได้บุคคลธรรมดาตามเงื่อนไขที่กฎหมายกำหนด'
  },
  {
    id: 19,
    category: 'thai',
    question: 'สิ่งใดคือปัจจัยสำคัญที่สุดในการลงทุนกองทุนรวมไทยให้ประสบความสำเร็จ',
    answer: 'ปัจจัยสำคัญที่สุด คือ การเลือกกองทุนให้เหมาะกับเป้าหมาย ระยะเวลา และระดับความเสี่ยงของตนเอง ควบคู่กับการมีวินัยในการลงทุนและมองการลงทุนในระยะยาวมากกว่าการคาดหวังผลตอบแทนระยะสั้น'
  },

  // ── กองทุนต่างประเทศ (foreign) ──
  {
    id: 20,
    category: 'foreign',
    question: 'กองทุนรวมต่างประเทศคืออะไร และต่างจากกองทุนไทยอย่างไร',
    answer: 'กองทุนรวมต่างประเทศ คือ กองทุนที่นำเงินของผู้ลงทุนไปลงทุนในสินทรัพย์ที่อยู่นอกประเทศไทย เช่น หุ้นต่างประเทศ พันธบัตรต่างประเทศ หรือกองทุนระดับโลก (Master Fund) เปิดโอกาสให้เข้าถึงบริษัทชั้นนำระดับโลก เช่น Apple, Microsoft, NVIDIA ลดการพึ่งพาเศรษฐกิจไทยเพียงแห่งเดียว'
  },
  {
    id: 21,
    category: 'foreign',
    question: 'ทำไมควรกระจายการลงทุนไปยังกองทุนต่างประเทศ',
    answer: 'การลงทุนเฉพาะในประเทศใดประเทศหนึ่ง อาจทำให้พอร์ตการลงทุนผันผวนตามเศรษฐกิจของประเทศนั้น การกระจายการลงทุนไปยังกองทุนต่างประเทศช่วยลดความเสี่ยงโดยรวม และเพิ่มโอกาสรับผลตอบแทนจากเมกะเทรนด์ระดับโลก เช่น AI, เซมิคอนดักเตอร์, และนวัตกรรมการแพทย์'
  },
  {
    id: 22,
    category: 'foreign',
    question: 'กองทุนต่างประเทศมีความเสี่ยงอะไรบ้าง',
    answer: 'ความเสี่ยงสำคัญ ได้แก่ ความเสี่ยงจากราคาตลาดต่างประเทศ ความเสี่ยงจากเศรษฐกิจและการเมืองของประเทศที่ลงทุน และความเสี่ยงจากอัตราแลกเปลี่ยน (FX Risk)'
  },
  {
    id: 23,
    category: 'foreign',
    question: 'ความเสี่ยงค่าเงินคืออะไร และควรกังวลแค่ไหน',
    answer: 'ความเสี่ยงค่าเงิน เกิดจากการเปลี่ยนแปลงของอัตราแลกเปลี่ยนระหว่างเงินบาทกับสกุลเงินต่างประเทศ บางกองทุนมีนโยบายป้องกันความเสี่ยงค่าเงิน (Hedging) ผู้ลงทุนควรพิจารณานโยบายนี้ให้สอดคล้องกับมุมมองของตนเอง'
  },
  {
    id: 24,
    category: 'foreign',
    question: 'กองทุนต่างประเทศเหมาะกับการลงทุนระยะสั้น หรือระยะยาว',
    answer: 'โดยทั่วไปกองทุนต่างประเทศเหมาะกับการลงทุนระยะกลางถึงระยะยาว (3-5 ปีขึ้นไป) เนื่องจากตลาดต่างประเทศอาจผันผวนในระยะสั้น แต่ในระยะยาวมีโอกาสเติบโตตามศักยภาพของเศรษฐกิจและนวัตกรรม'
  },
  {
    id: 25,
    category: 'foreign',
    question: 'ควรเลือกกองทุนต่างประเทศจากประเทศหรือภูมิภาคใด',
    answer: 'ขึ้นอยู่กับเป้าหมาย เช่น สหรัฐฯ โดดเด่นด้านเทคโนโลยีและนวัตกรรม ยุโรปเน้นสินค้าคุณภาพและสุขภาพ ขณะที่ตลาดเกิดใหม่อย่างอินเดียหรือเวียดนามให้การเติบโตสูง การกระจายหลายภูมิภาคช่วยลดความเสี่ยงได้ดีที่สุด'
  },
  {
    id: 26,
    category: 'foreign',
    question: 'กองทุนต่างประเทศแบบ Active และ Passive ต่างกันอย่างไร',
    answer: 'กองทุน Active มีผู้จัดการกองทุนคัดเลือกหุ้นเพื่อมุ่งเอาชนะดัชนีอ้างอิง ขณะที่กองทุน Passive (เช่น ETF Feeder) จะเน้นลงทุนล้อตามดัชนี ค่าธรรมเนียมต่ำ โปร่งใส และสร้างผลตอบแทนสม่ำเสมอตามตลาด'
  },
  {
    id: 27,
    category: 'foreign',
    question: 'ค่าธรรมเนียมของกองทุนต่างประเทศมีอะไรบ้าง',
    answer: 'ได้แก่ ค่าธรรมเนียมการจัดการของ บลจ. ไทย, ค่าธรรมเนียมของ Master Fund ในต่างประเทศ (รวมใน Expense Ratio), ค่าธรรมเนียมซื้อ/ขายหน่วยลงทุน และค่าธรรมเนียมการสับเปลี่ยนกองทุน'
  },

  // ── การใช้งานเว็บไซต์ (website) ──
  {
    id: 28,
    category: 'website',
    question: 'เว็บไซต์แนะนำการลงทุนกองทุนคืออะไร และมีบทบาทอย่างไรต่อผู้ลงทุน',
    answer: 'เป็นแพลตฟอร์มที่รวบรวมข้อมูลกองทุนรวมจากหลาย บลจ. พร้อมเครื่องมือช่วยวิเคราะห์ สัดส่วนการถือครองหุ้น Master Fund และกระแสเงินทุน ช่วยลดความซับซ้อนในการค้นหาข้อมูลและทำให้ตัดสินใจลงทุนได้อย่างมีประสิทธิภาพ'
  },
  {
    id: 29,
    category: 'website',
    question: 'ข้อมูลกองทุนบนเว็บไซต์มีความน่าเชื่อถือเพียงใด',
    answer: 'เว็บไซต์อ้างอิงข้อมูลจากแหล่งทางการ เช่น บริษัทหลักทรัพย์จัดการกองทุน (บลจ.), ตลาดหลักทรัพย์แห่งประเทศไทย (SET), สำนักงาน ก.ล.ต. และผู้ให้บริการข้อมูลการเงินระดับโลก โดยมีการอัปเดตข้อมูล NAV และ Fund Flow อย่างสม่ำเสมอ'
  },
  {
    id: 30,
    category: 'website',
    question: 'เว็บไซต์แนะนำการลงทุนแตกต่างจากการรับคำแนะนำจากผู้แนะนำการลงทุนอย่างไร',
    answer: 'เว็บไซต์ให้ข้อมูลเชิงลึก เครื่องมือวิเคราะห์ และสถิติที่เป็นกลางเพื่อการศึกษาด้วยตนเอง ส่วนผู้แนะนำการลงทุน (IC) จะช่วยวางแผนเฉพาะบุคคลตามเป้าหมายและข้อจำกัดทางการเงิน'
  },
  {
    id: 31,
    category: 'website',
    question: 'ผลการจัดอันดับหรือกองทุนแนะนำบนเว็บไซต์เชื่อถือได้แค่ไหน',
    answer: 'การจัดอันดับอ้างอิงจากข้อมูลผลการดำเนินงานย้อนหลัง ความผันผวน และระดับความเสี่ยงตามโมเดลทางสถิติ มิใช่การรับประกันผลตอบแทนในอนาคต ผู้ลงทุนควรใช้วิจารณญาณร่วมกับเป้าหมายส่วนบุคคลก่อนตัดสินใจ'
  }
];
