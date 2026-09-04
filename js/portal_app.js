/* ==========================================================================
   PORTAL INTERACTIVE APPLICATION LOGIC
   Handles:
   1. 5 Main Tabs Navigation (Home, FUNDINFO, IDEAFUND, Articles, FAQ)
   2. Articles filtering & pagination (Migrat Articles tab)
   3. FAQ search & accordion toggle (Migrat FAQ tab)
   4. Redesigned FUNDINFO Screener (400 funds, filters, CSV, drawer)
   5. Redesigned IDEAFUND Suite (Global Flow, Uptrend, Valuation)
   ========================================================================== */

let state = {
  // Main Tab State
  activeMainTab: 'home',

  // Articles Tab State
  articleCategory: 'all',
  articlePage: 1,
  articlesPerPage: 6,

  // FAQ Tab State
  faqCategory: 'all',
  faqSearch: '',
  openFaqIds: new Set([1]), // First question opened by default

  // FUNDINFO Screener State
  screenerCategory: 'all',
  sectorFilter: 'all',
  favoritesOnly: false,
  searchQuery: '',
  amcFilter: 'all',
  riskFilter: 'all',
  divFilter: 'all',
  sortBy: 'perfDesc',
  page: 1,
  pageSize: 10,
  selectedFunds: new Set(['SCBNDQ', 'KF-GTECH']),
  activeDrawerFundId: 'SCBNDQ',
  expandedFundIds: new Set(['SCB72-GLOBAL']),
  flowPeriod: '1M'
};

let drawerChartInstance = null;

/* ================= 1. INITIALIZATION ================= */
document.addEventListener('DOMContentLoaded', () => {
  // Check Dark Mode Preference
  try {
    if (localStorage.getItem('ideafund-theme') === 'dark' || 
       (!localStorage.getItem('ideafund-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      const icon = document.getElementById('themeIcon');
      if (icon) icon.textContent = '☀️';
    }
  } catch (e) {}

  // Parse Initial Route / Hash
  initMainTabFromHash();

  // Initialize Data Views
  renderArticlesView();
  renderFaqView();
  renderFundTable();
  renderThemeFlow();
  renderThemeTags();
  renderUptrendTable();
  renderValuationTable();
  updateWatchlistBadge();
  setupGlobalSearch();

  // Listen to browser back/forward hash changes
  window.addEventListener('hashchange', () => {
    initMainTabFromHash();
  });
});

/* ================= 2. MAIN TABS SWITCHER (5 TABS) ================= */
const VALID_MAIN_TABS = ['home', 'fundinfo', 'ideafund', 'articles', 'faq'];

function initMainTabFromHash() {
  const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
  if (VALID_MAIN_TABS.includes(hash)) {
    switchMainTab(hash, false);
  } else {
    switchMainTab('home', false);
  }
}

function switchMainTab(tabKey, updateHash = true) {
  if (!VALID_MAIN_TABS.includes(tabKey)) tabKey = 'home';
  state.activeMainTab = tabKey;

  // 1. Toggle Active Classes on Top Bar Menu Links
  VALID_MAIN_TABS.forEach(key => {
    const navBtn = document.getElementById(`nav-link-${key}`);
    const viewPane = document.getElementById(`view-${key}`);

    if (navBtn) {
      if (key === tabKey) {
        navBtn.classList.add('active');
      } else {
        navBtn.classList.remove('active');
      }
    }

    if (viewPane) {
      if (key === tabKey) {
        viewPane.classList.remove('hidden');
      } else {
        viewPane.classList.add('hidden');
      }
    }
  });

  // 2. Update Browser URL Hash without reloading
  if (updateHash) {
    window.location.hash = tabKey;
  }

  // 3. Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================= 3. THEME & HEADER CONTROLS ================= */
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  const icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = isDark ? '☀️' : '🌙';
  try {
    localStorage.setItem('ideafund-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
}

function refreshData() {
  const icon = document.getElementById('refreshIcon');
  if (icon) icon.classList.add('animate-spin');
  setTimeout(() => {
    if (icon) icon.classList.remove('animate-spin');
    alert('อัปเดตข้อมูลราคากองทุน (NAV) และกระแสเงินทุนล่าสุดเรียบร้อยแล้ว!');
  }, 700);
}

/* ================= 4. ARTICLES VIEW CONTROLLER ================= */
function changeArticleCategory(catId) {
  state.articleCategory = catId;
  state.articlePage = 1;

  // Update Category Buttons Styling
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-cat') === catId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderArticlesList();
}

function renderArticlesView() {
  // Render Featured Banner
  const banner = document.getElementById('featuredArticleBanner');
  if (banner && typeof FEATURED_ARTICLE !== 'undefined') {
    banner.innerHTML = `
      <div class="featured-image-col">
        <img src="${FEATURED_ARTICLE.thumbnail}" alt="${FEATURED_ARTICLE.title}" onerror="this.src='https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80'" />
      </div>
      <div class="featured-content-col">
        <h2 class="featured-title">${FEATURED_ARTICLE.title}</h2>
        <p class="featured-excerpt">${FEATURED_ARTICLE.excerpt}</p>
        <button onclick="alert('อ่านบทความ: ${FEATURED_ARTICLE.title}')" class="featured-btn">
          อ่านบทความเต็ม <span class="arrow">→</span>
        </button>
      </div>
    `;
  }

  renderArticlesList();
}

function renderArticlesList() {
  const grid = document.getElementById('articlesGrid');
  if (!grid || typeof ARTICLES_LIST === 'undefined') return;

  const filtered = ARTICLES_LIST.filter(a => {
    if (state.articleCategory === 'all') return true;
    return a.category === state.articleCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-3 text-center py-12 text-slate-400">ไม่พบบทความในหมวดหมู่นี้</div>';
    renderArticlePagination(0);
    return;
  }

  const startIdx = (state.articlePage - 1) * state.articlesPerPage;
  const endIdx = Math.min(startIdx + state.articlesPerPage, filtered.length);
  const pageItems = filtered.slice(startIdx, endIdx);

  grid.innerHTML = pageItems.map(item => `
    <article class="article-card cursor-pointer" onclick="alert('อ่านบทความ: ${item.title}')">
      <div class="card-image-wrapper">
        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80'" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-excerpt">${item.excerpt}</p>
        <span class="card-date">${item.date}</span>
      </div>
    </article>
  `).join('');

  renderArticlePagination(Math.ceil(filtered.length / state.articlesPerPage));
}

function renderArticlePagination(totalPages) {
  const c = document.getElementById('articlePaginationControls');
  if (!c) return;
  if (totalPages <= 1) {
    c.innerHTML = '';
    return;
  }

  let html = `
    <button class="nav-page-btn" onclick="goToArticlePage(${state.articlePage - 1})" ${state.articlePage === 1 ? 'disabled' : ''}>← Previous Page</button>
  `;

  for (let p = 1; p <= totalPages; p++) {
    html += `
      <button class="page-num ${p === state.articlePage ? 'active' : ''}" onclick="goToArticlePage(${p})">${p}</button>
    `;
  }

  html += `
    <button class="nav-page-btn" onclick="goToArticlePage(${state.articlePage + 1})" ${state.articlePage === totalPages ? 'disabled' : ''}>Next Page →</button>
  `;

  c.innerHTML = html;
}

function goToArticlePage(p) {
  state.articlePage = p;
  renderArticlesList();
}

/* ================= 5. FAQ VIEW CONTROLLER ================= */
function setFaqCategory(catKey) {
  state.faqCategory = catKey;
  document.querySelectorAll('.faq-chip').forEach(btn => {
    if (btn.getAttribute('data-cat') === catKey) {
      btn.classList.add('on');
    } else {
      btn.classList.remove('on');
    }
  });
  renderFaqList();
}

function handleFaqSearch(keyword) {
  state.faqSearch = keyword.trim().toLowerCase();
  renderFaqList();
}

function toggleFaqAccordion(id) {
  if (state.openFaqIds.has(id)) {
    state.openFaqIds.delete(id);
  } else {
    state.openFaqIds.add(id);
  }
  renderFaqList();
}

function renderFaqView() {
  renderFaqList();
}

function renderFaqList() {
  const container = document.getElementById('faqItemsContainer');
  if (!container || typeof FAQ_LIST === 'undefined') return;

  const filtered = FAQ_LIST.filter(item => {
    const matchCat = state.faqCategory === 'all' || item.category === state.faqCategory;
    const matchSearch = !state.faqSearch || item.question.toLowerCase().includes(state.faqSearch) || item.answer.toLowerCase().includes(state.faqSearch);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-center py-12 text-slate-400">ไม่พบคำถามที่ตรงกับหมวดหมู่หรือคำค้นหานี้</div>';
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isExpanded = state.openFaqIds.has(item.id);
    return `
      <article class="faq-item ${isExpanded ? 'expanded' : ''}">
        <button class="faq-q-row" onclick="toggleFaqAccordion(${item.id})">
          <span class="faq-q-icon">?</span>
          <span class="faq-q-text">${item.question}</span>
          <span class="faq-toggle-icon">${isExpanded ? '−' : '+'}</span>
        </button>
        ${isExpanded ? `
          <div class="faq-a-row">
            <div class="faq-a-text">${item.answer}</div>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');
}

/* ================= 6. CATEGORY SELECTOR & FILTERING (FUNDINFO) ================= */
function selectCategory(cat) {
  if (cat === 'all') {
    setScreenerCategory('all');
    const screenerEl = document.getElementById('fund-screener');
    if (screenerEl) screenerEl.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.location.href = `fundinfo-phase2-v3.2.1.html?tab=${cat}`;
}

function setScreenerCategory(cat) {
  state.screenerCategory = cat;
  state.page = 1;
  
  // Update Tab Styling
  ['all', 'feeder', 'offshore', 'thai', 'mixed'].forEach(c => {
    const btn = document.getElementById(`scTab-${c}`);
    if (btn) {
      if (c === cat) {
        btn.className = 'sc-tab px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-xs transition';
      } else {
        btn.className = 'sc-tab px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 transition';
      }
    }
  });

  // Sync Dropdown Select
  const typeSelect = document.getElementById('typeFilterSelect');
  if (typeSelect && typeSelect.value !== cat) {
    typeSelect.value = cat;
  }

  renderFundTable();
}

function syncTypeFromDropdown(val) {
  setScreenerCategory(val);
}

function switchInsightTab(tab) {
  ['flow', 'trend', 'valuation'].forEach(t => {
    const pane = document.getElementById(`pane-${t}`);
    const btn = document.getElementById(`tabBtn-${t}`);
    if (pane && btn) {
      if (t === tab) {
        pane.classList.remove('hidden');
        btn.className = 'px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm';
      } else {
        pane.classList.add('hidden');
        btn.className = 'px-4 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900';
      }
    }
  });
}

function setFlowPeriod(p) {
  state.flowPeriod = p;
  document.querySelectorAll('.flow-period-btn').forEach(btn => {
    if (btn.textContent === p) {
      btn.className = 'flow-period-btn px-2.5 py-1 rounded bg-white dark:bg-slate-700 font-bold text-brand-600 dark:text-white shadow-xs';
    } else {
      btn.className = 'flow-period-btn px-2.5 py-1 rounded text-slate-600 dark:text-slate-300';
    }
  });
  renderThemeFlow();
}

/* ================= 7. MOCK DATA RENDERERS (INSIGHTS) ================= */
function renderThemeFlow() {
  const c = document.getElementById('themeFlowList');
  if (!c || typeof THEME_FLOWS === 'undefined') return;
  c.innerHTML = THEME_FLOWS.map(item => `
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-300 transition">
      <div class="flex items-center gap-2.5 flex-1 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full ${item.pos ? 'bg-emerald-500' : 'bg-rose-500'} shrink-0"></span>
        <span class="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">${item.theme}</span>
      </div>

      <div class="flex items-center gap-6 shrink-0 text-xs">
        <div class="w-32 hidden md:block">
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div class="${item.pos ? 'bg-emerald-500' : 'bg-rose-500'} h-full rounded-full" style="width: ${item.pct}%"></div>
          </div>
        </div>

        <span class="num font-bold text-xs ${item.pos ? 'text-emerald-600' : 'text-rose-500'} min-w-[70px] text-right">
          ${item.pos ? '+' : ''}$${Math.abs(item.net)}M
        </span>

        <span class="text-[11px] px-2 py-0.5 rounded-full ${item.perf >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'} font-semibold num min-w-[65px] text-center">
          ${item.perf >= 0 ? '+' : ''}${item.perf}%
        </span>

        <button onclick="filterByTheme('${item.theme.split(' ')[0]}')" class="text-slate-400 hover:text-brand-600 font-bold text-[11px] px-1">
          สำรวจ →
        </button>
      </div>
    </div>
  `).join('');
}

function renderThemeTags() {
  const c = document.getElementById('themeTagsContainer');
  if (!c || typeof THEMES === 'undefined') return;
  c.innerHTML = THEMES.map(t => `
    <button onclick="filterByTheme('${t}')" class="px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 border border-slate-200/60 dark:border-slate-700/60 transition">
      ${t}
    </button>
  `).join('');
}

function filterByTheme(theme) {
  switchMainTab('fundinfo');
  const input = document.getElementById('tableSearchInput');
  if (input) input.value = theme;
  handleTableFilter();
  const screener = document.getElementById('fund-screener');
  if (screener) screener.scrollIntoView({ behavior: 'smooth' });
}

function renderUptrendTable() {
  const tbody = document.getElementById('uptrendTableBody');
  if (!tbody || typeof UPTREND_FUNDS === 'undefined') return;
  tbody.innerHTML = UPTREND_FUNDS.map(f => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer" onclick="openQuickDrawer('${f.id}')">
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900 dark:text-white">${f.id}</div>
        <div class="text-[11px] text-slate-400 truncate max-w-xs">${f.name}</div>
      </td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${f.type}</span>
      </td>
      <td class="py-3 px-3 text-right font-extrabold text-emerald-600 num">${f.ret1y}</td>
      <td class="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300 num">${f.ret3y}</td>
      <td class="py-3 px-3 text-center">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${f.risk >= 7 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">ระดับ ${f.risk}</span>
      </td>
      <td class="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">${f.amc}</td>
      <td class="py-3 px-3 text-center">
        <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 font-bold num text-[11px]">
          <span>🔥</span> ${f.momentum}/100
        </div>
      </td>
      <td class="py-3 px-4 text-center">
        <button onclick="event.stopPropagation(); openQuickDrawer('${f.id}')" class="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-[11px] hover:bg-brand-100 transition">
          ดูข้อมูล
        </button>
      </td>
    </tr>
  `).join('');
}

function renderValuationTable() {
  const tbody = document.getElementById('valuationTableBody');
  if (!tbody || typeof VALUATION_FUNDS === 'undefined') return;
  tbody.innerHTML = VALUATION_FUNDS.map(f => {
    let badgeClass = 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    if (f.zoneColor === 'emerald') badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
    if (f.zoneColor === 'amber') badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer" onclick="openQuickDrawer('${f.id}')">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900 dark:text-white">${f.id}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-xs">${f.name}</div>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClass}">${f.zone}</span>
        </td>
        <td class="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-100 num">${f.pe}</td>
        <td class="py-3 px-3 text-right font-extrabold text-emerald-600 num">${f.upside}</td>
        <td class="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300 num">${f.div}</td>
        <td class="py-3 px-3 text-right text-slate-600 dark:text-slate-300 num">${f.aum}</td>
        <td class="py-3 px-3 font-medium text-slate-600 dark:text-slate-300">${f.amc}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="event.stopPropagation(); openQuickDrawer('${f.id}')" class="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-[11px] hover:bg-brand-100 transition">
            ดูข้อมูล
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/* ================= 8. FUND SCREENER LOGIC (FUNDINFO) ================= */
function handleTableFilter() {
  const searchEl = document.getElementById('tableSearchInput');
  state.searchQuery = searchEl ? searchEl.value.trim().toLowerCase() : '';
  
  const typeEl = document.getElementById('typeFilterSelect');
  if (typeEl) state.screenerCategory = typeEl.value;

  const amcEl = document.getElementById('amcFilterSelect');
  if (amcEl) state.amcFilter = amcEl.value;

  const sectorEl = document.getElementById('sectorFilterSelect');
  if (sectorEl) state.sectorFilter = sectorEl.value;

  const riskEl = document.getElementById('riskFilterSelect');
  if (riskEl) state.riskFilter = riskEl.value;

  const divEl = document.getElementById('divFilterSelect');
  if (divEl) state.divFilter = divEl.value;

  const sortEl = document.getElementById('sortFilterSelect');
  if (sortEl) state.sortBy = sortEl.value;

  state.page = 1;
  renderFundTable();
}

function sortTable(key) {
  if (key === 'perf') state.sortBy = state.sortBy === 'perfDesc' ? 'perfAsc' : 'perfDesc';
  if (key === 'nav') state.sortBy = 'navDesc';
  if (key === 'risk') state.sortBy = 'riskDesc';
  renderFundTable();
}

function getFilteredFunds() {
  if (typeof FUNDS === 'undefined') return [];
  return FUNDS.filter(f => {
    // 1. Filter: กองทุนโปรด (Favorites only)
    if (state.favoritesOnly && !f.starred) return false;

    // 2. Filter: ประเภทกองทุน
    if (state.screenerCategory !== 'all' && f.type !== state.screenerCategory) return false;

    // 3. Filter: บลจ.
    if (state.amcFilter !== 'all' && f.amc !== state.amcFilter) return false;

    // 4. Filter: Sector
    if (state.sectorFilter && state.sectorFilter !== 'all' && f.sector !== state.sectorFilter) return false;

    // 5. Filter: Search Query
    if (state.searchQuery) {
      const matchId = f.id.toLowerCase().includes(state.searchQuery);
      const matchName = f.name.toLowerCase().includes(state.searchQuery);
      const matchAmc = (f.amcFull || '').toLowerCase().includes(state.searchQuery);
      const matchMaster = (f.master || '').toLowerCase().includes(state.searchQuery);
      const matchHoldings = (f.holdings || []).some(h => h[0].toLowerCase().includes(state.searchQuery));
      if (!matchId && !matchName && !matchAmc && !matchMaster && !matchHoldings) return false;
    }

    // 6. Filter: Risk
    if (state.riskFilter === 'low' && f.risk > 4) return false;
    if (state.riskFilter === 'med' && f.risk !== 5) return false;
    if (state.riskFilter === 'high' && f.risk < 6) return false;

    // 7. Filter: Dividend
    if (state.divFilter === 'div' && f.div <= 0) return false;
    if (state.divFilter === 'nodiv' && f.div > 0) return false;

    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'perfDesc') return b.perf - a.perf;
    if (state.sortBy === 'perfAsc') return a.perf - b.perf;
    if (state.sortBy === 'aumDesc') return b.aum - a.aum;
    if (state.sortBy === 'navDesc') return b.nav - a.nav;
    if (state.sortBy === 'riskDesc') return b.risk - a.risk;
    if (state.sortBy === 'nameAsc') return a.id.localeCompare(b.id);
    return 0;
  });
}

function renderFundTable() {
  const filtered = getFilteredFunds();
  const fCountEl = document.getElementById('filteredFundCount');
  const tCountEl = document.getElementById('totalFundCount');
  if (fCountEl) fCountEl.textContent = filtered.length;
  if (tCountEl && typeof FUNDS !== 'undefined') tCountEl.textContent = FUNDS.length;

  const startIdx = (state.page - 1) * state.pageSize;
  const endIdx = Math.min(startIdx + state.pageSize, filtered.length);
  const pageItems = filtered.slice(startIdx, endIdx);

  const startEl = document.getElementById('pageRangeStart');
  const endEl = document.getElementById('pageRangeEnd');
  if (startEl) startEl.textContent = filtered.length === 0 ? 0 : startIdx + 1;
  if (endEl) endEl.textContent = endIdx;

  const tbody = document.getElementById('fundTableBody');
  if (!tbody) return;

  if (pageItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="12" class="py-12 text-center text-slate-400">
          <div class="text-3xl mb-2">🔍</div>
          <div class="font-bold text-sm">ไม่พบกองทุนที่ตรงกับเงื่อนไข</div>
          <div class="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือรีเซ็ตตัวกรอง</div>
        </td>
      </tr>
    `;
    renderPagination(0);
    return;
  }

  tbody.innerHTML = pageItems.map(f => {
    const isChecked = state.selectedFunds.has(f.id);
    const isExpanded = state.expandedFundIds && state.expandedFundIds.has(f.id);
    const typeBadgeColors = {
      feeder: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
      offshore: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      thai: 'bg-yellow-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60',
      mixed: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    };
    const typeLabels = { feeder: 'Feeder', offshore: 'Offshore', thai: 'Thai Equity', mixed: 'Mixed' };

    let rowHtml = `
      <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition cursor-pointer ${isChecked ? 'bg-brand-50/20' : ''} ${isExpanded ? 'bg-slate-50/90 dark:bg-slate-800/80 font-semibold' : ''}" onclick="toggleFundExpand('${f.id}')" title="คลิกเพื่อเปิด/ปิด Top 5 Holdings Pie Chart">
        <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
          <button onclick="toggleStar('${f.id}')" class="text-base transition hover:scale-125" title="เพิ่มในรายการโปรด">
            ${f.starred ? '⭐' : '☆'}
          </button>
        </td>
        <td class="py-3 px-3 text-center" onclick="event.stopPropagation()">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleFundSelection('${f.id}', this.checked)" class="rounded text-brand-600 focus:ring-0 cursor-pointer" title="เลือกเปรียบเทียบ">
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>${f.id}</span>
            ${f.div > 0 ? '<span class="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1 py-0.2 rounded font-bold">ปันผล</span>' : ''}
            <span class="text-slate-400 text-xs transition-transform duration-200 inline-block ${isExpanded ? 'rotate-180' : ''}">⌄</span>
          </div>
          <div class="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm">${f.name}</div>
        </td>
        <td class="py-3 px-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${typeBadgeColors[f.type]}">
            ${typeLabels[f.type]}
          </span>
        </td>
        <td class="py-3 px-3 font-semibold text-slate-600 dark:text-slate-300">${f.amcFull}</td>
        <td class="py-3 px-3 text-right font-bold text-slate-800 dark:text-slate-100 num">
          ${f.nav.toFixed(4)}
          <span class="block text-[10px] ${f.chg1d >= 0 ? 'text-emerald-600' : 'text-rose-500'}">${f.chg1d >= 0 ? '+' : ''}${f.chg1d}%</span>
        </td>
        <td class="py-3 px-3 text-right font-semibold ${f.ret1m >= 0 ? 'text-emerald-600' : 'text-rose-500'} num">
          ${f.ret1m >= 0 ? '+' : ''}${f.ret1m}%
        </td>
        <td class="py-3 px-3 text-right font-extrabold ${f.perf >= 0 ? 'text-emerald-600' : 'text-rose-500'} num">
          ${f.perf >= 0 ? '+' : ''}${f.perf}%
        </td>
        <td class="py-3 px-3 text-right font-semibold text-slate-600 dark:text-slate-300 num">
          ${f.ret3y >= 0 ? '+' : ''}${f.ret3y}%
        </td>
        <td class="py-3 px-3 text-center">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${f.risk >= 7 ? 'bg-rose-100 text-rose-800' : f.risk >= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}">
            ${f.risk}
          </span>
        </td>
        <td class="py-3 px-3 text-right num text-slate-600 dark:text-slate-300">
          ${f.div > 0 ? f.div.toFixed(1) + '%' : '—'}
        </td>
        <td class="py-3 px-4 text-center" onclick="event.stopPropagation()">
          <div class="flex items-center justify-center">
            <a href="fund_detail.html?id=${f.id}" class="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white dark:bg-slate-800 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs" title="เปิดหน้ารายละเอียดเต็ม">
              <span>ดูข้อมูล</span> ↗
            </a>
          </div>
        </td>
      </tr>
    `;

    if (isExpanded) {
      rowHtml += `
        <tr class="fi-tr-expand bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200/90 dark:border-slate-800">
          <td colspan="12" class="py-3 px-6 sm:px-8">
            <div class="w-full flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <!-- Pie / Donut Chart -->
              <div class="flex flex-col items-center justify-center shrink-0 w-[110px] text-center">
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Top 5 Holdings</div>
                <div class="w-[96px] h-[96px] relative flex items-center justify-center">
                  <canvas id="fd-pe-${f.id}" width="96" height="96"></canvas>
                </div>
              </div>
              <!-- Holdings list with colored square dots matching media_1788432375273.png -->
              <div class="flex-1 w-full divide-y divide-slate-200/60 dark:divide-slate-750">
                ${renderExpandHoldingsList(f)}
              </div>
            </div>
          </td>
        </tr>
      `;
    }

    return rowHtml;
  }).join('');

  pageItems.forEach(f => {
    if (state.expandedFundIds && state.expandedFundIds.has(f.id)) {
      setTimeout(() => drawExpandPie(f), 10);
    }
  });

  renderPagination(Math.ceil(filtered.length / state.pageSize));
}

const PIE_COLORS = ['#4B543B', '#DCE2AA', '#B57F50', '#8ED081', '#B4D2BA'];
const expandPieInstances = {};

function toggleFundExpand(fundId) {
  if (!state.expandedFundIds) state.expandedFundIds = new Set();
  if (state.expandedFundIds.has(fundId)) {
    state.expandedFundIds.delete(fundId);
    if (expandPieInstances[`fd-pe-${fundId}`]) {
      expandPieInstances[`fd-pe-${fundId}`].destroy();
      delete expandPieInstances[`fd-pe-${fundId}`];
    }
  } else {
    state.expandedFundIds.add(fundId);
  }
  renderFundTable();
}

function drawExpandPie(fund) {
  const canvasId = `fd-pe-${fund.id}`;
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;
  if (expandPieInstances[canvasId]) {
    expandPieInstances[canvasId].destroy();
  }

  const top5 = (fund.holdings || []).slice(0, 5);
  if (!top5.length) return;

  const data = top5.map(h => ({
    name: Array.isArray(h) ? h[0] : (h.symbol || h.name || '-'),
    value: Array.isArray(h) ? Number(h[1] || 0) : Number(h.percent || 0)
  }));
  const visualData = data.map(x => Math.max(Number(x.value || 0), 4));

  const ctx = canvas.getContext('2d');
  expandPieInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(x => x.name),
      datasets: [{
        data: visualData,
        backgroundColor: PIE_COLORS.slice(0, data.length),
        borderWidth: 2,
        borderColor: document.documentElement.classList.contains('dark') ? '#1e293b' : '#ffffff',
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${data[ctx.dataIndex].name}: ${data[ctx.dataIndex].value}%`
          }
        }
      }
    }
  });
}

function renderExpandHoldingsList(fund) {
  const list = (fund.holdings || []).slice(0, 5);
  if (!list.length) {
    return `<div class="py-3 text-xs text-slate-400">ไม่พบข้อมูลสัดส่วนหุ้น</div>`;
  }
  return list.map((h, j) => {
    const symbol = Array.isArray(h) ? h[0] : (h.symbol || h.name || '-');
    const weight = Array.isArray(h) ? Number(h[1] || 0) : Number(h.percent || 0);
    const color = PIE_COLORS[j % PIE_COLORS.length];
    return `
      <div class="flex items-center justify-between py-1.5 text-xs sm:text-sm">
        <div class="flex items-center gap-2.5 min-w-0 pr-3">
          <span class="w-3 h-3 rounded-xs shrink-0 shadow-2xs" style="background: ${color}"></span>
          <strong class="font-extrabold text-slate-800 dark:text-slate-100 truncate text-xs sm:text-sm">${symbol}</strong>
          <span class="text-xs text-slate-400 dark:text-slate-400 truncate">${symbol}</span>
        </div>
        <span class="font-bold text-slate-800 dark:text-slate-200 num shrink-0 text-xs sm:text-sm">${weight.toFixed(1)}%</span>
      </div>
    `;
  }).join('');
}

function renderPagination(totalPages) {
  const c = document.getElementById('paginationControls');
  if (!c) return;
  if (totalPages <= 1) {
    c.innerHTML = '';
    return;
  }

  let html = `
    <button onclick="goToPage(${state.page - 1})" ${state.page === 1 ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 font-medium">ย้อน</button>
  `;

  for (let p = Math.max(1, state.page - 2); p <= Math.min(totalPages, state.page + 2); p++) {
    html += `
      <button onclick="goToPage(${p})" class="px-3 py-1 rounded-lg font-bold ${p === state.page ? 'bg-brand-600 text-white' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}">${p}</button>
    `;
  }

  html += `
    <button onclick="goToPage(${state.page + 1})" ${state.page === totalPages ? 'disabled' : ''} class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 font-medium">ถัดไป</button>
  `;

  c.innerHTML = html;
}

function goToPage(p) {
  state.page = p;
  renderFundTable();
  const screener = document.getElementById('fund-screener');
  if (screener) screener.scrollIntoView({ behavior: 'smooth' });
}

/* ================= 9. DRAWER & QUICK VIEW ================= */
function openQuickDrawer(fundId) {
  if (typeof FUNDS === 'undefined') return;
  const fund = FUNDS.find(f => f.id === fundId) || FUNDS[0];
  state.activeDrawerFundId = fund.id;

  document.getElementById('drawerFundTitle').textContent = fund.name;
  document.getElementById('drawerFundSubtitle').textContent = `${fund.id} • บลจ. ${fund.amcFull}`;
  document.getElementById('drawerBadgeType').textContent = fund.type.toUpperCase();
  document.getElementById('drawerBadgeRisk').textContent = `ความเสี่ยง ${fund.risk}`;
  
  document.getElementById('drawerNav').textContent = fund.nav.toFixed(4);
  document.getElementById('drawerNavChg').textContent = `${fund.chg1d >= 0 ? '+' : ''}${fund.chg1d}% (1D)`;
  document.getElementById('drawerNavChg').className = `text-[10px] block font-semibold ${fund.chg1d >= 0 ? 'text-emerald-600' : 'text-rose-500'}`;
  
  document.getElementById('drawerPerf').textContent = `${fund.perf >= 0 ? '+' : ''}${fund.perf}%`;
  document.getElementById('drawerPerf').className = `text-base font-extrabold num ${fund.perf >= 0 ? 'text-emerald-600' : 'text-rose-500'}`;
  
  document.getElementById('drawerAum').textContent = `฿${fund.aum.toLocaleString()}M`;
  document.getElementById('drawerMasterName').textContent = fund.master;
  document.getElementById('drawerFullDetailLink').href = `fund_detail.html?id=${fund.id}`;

  const isStarred = fund.starred;
  document.getElementById('drawerWatchText').textContent = isStarred ? 'กำลังติดตาม ⭐' : 'ติดตามกองนี้';

  const hContainer = document.getElementById('drawerHoldingsList');
  hContainer.innerHTML = fund.holdings.map(([stock, weight]) => `
    <div>
      <div class="flex justify-between text-xs mb-1">
        <span class="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-brand-600" onclick="showStockDetail('${stock}')">${stock}</span>
        <span class="font-bold text-slate-900 dark:text-white num">${weight}%</span>
      </div>
      <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
        <div class="bg-brand-500 h-full rounded-full" style="width: ${weight * 7}%"></div>
      </div>
    </div>
  `).join('');

  document.getElementById('quickDrawer').classList.remove('translate-x-full');
  document.getElementById('quickDrawerBackdrop').classList.remove('opacity-0', 'pointer-events-none');

  renderDrawerChart(fund);
}

function closeQuickDrawer() {
  const drawer = document.getElementById('quickDrawer');
  const backdrop = document.getElementById('quickDrawerBackdrop');
  if (drawer) drawer.classList.add('translate-x-full');
  if (backdrop) backdrop.classList.add('opacity-0', 'pointer-events-none');
}

function renderDrawerChart(fund) {
  const canvas = document.getElementById('drawerChartCanvas');
  if (!canvas || typeof Chart === 'undefined') return;
  const ctx = canvas.getContext('2d');
  if (drawerChartInstance) {
    drawerChartInstance.destroy();
  }

  const labels = ['ม.ค.', 'มี.ค.', 'พ.ค.', 'ก.ค.', 'ก.ย.', 'พ.ย.', 'ปัจจุบัน'];
  const factor = fund.perf / 25;
  const dataFund = [0, 4.2 * factor, 8.1 * factor, 12.5 * factor, 16.2 * factor, 21.0 * factor, fund.perf];
  const dataBench = [0, 2.8, 5.4, 7.8, 10.2, 13.5, 15.8];

  drawerChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: fund.id,
          data: dataFund,
          borderColor: '#1c52d8',
          backgroundColor: 'rgba(28, 82, 216, 0.08)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 2
        },
        {
          label: 'Benchmark',
          data: dataBench,
          borderColor: '#94a3b8',
          borderDash: [4, 4],
          fill: false,
          tension: 0.35,
          borderWidth: 1.5,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top', labels: { boxWidth: 10, font: { size: 10 } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 } } },
        y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 9 }, callback: v => v + '%' } }
      }
    }
  });
}

/* ================= 10. WATCHLIST & COMPARE ================= */
function toggleStar(fundId) {
  if (typeof FUNDS === 'undefined') return;
  const fund = FUNDS.find(f => f.id === fundId);
  if (fund) {
    fund.starred = !fund.starred;
    renderFundTable();
    updateWatchlistBadge();
  }
}

function toggleWatchlistFromDrawer() {
  if (state.activeDrawerFundId) {
    toggleStar(state.activeDrawerFundId);
    const fund = FUNDS.find(f => f.id === state.activeDrawerFundId);
    const textEl = document.getElementById('drawerWatchText');
    if (textEl && fund) textEl.textContent = fund.starred ? 'กำลังติดตาม ⭐' : 'ติดตามกองนี้';
  }
}

function updateWatchlistBadge() {
  if (typeof FUNDS === 'undefined') return;
  const starredCount = FUNDS.filter(f => f.starred).length;
  const badge = document.getElementById('watchlistCountBadge');
  if (badge) badge.textContent = starredCount;
  const favBadge = document.getElementById('favCount');
  if (favBadge) favBadge.textContent = starredCount;
}

function toggleFavoritesOnly() {
  state.favoritesOnly = !state.favoritesOnly;
  const btn = document.getElementById('favFilterBtn');
  if (btn) {
    if (state.favoritesOnly) {
      btn.classList.add('bg-amber-500', 'text-white', 'border-amber-500', 'hover:bg-amber-600');
      btn.classList.remove('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-200');
    } else {
      btn.classList.remove('bg-amber-500', 'text-white', 'border-amber-500', 'hover:bg-amber-600');
      btn.classList.add('bg-white', 'text-slate-700', 'dark:bg-slate-800', 'dark:text-slate-200');
    }
  }
  state.page = 1;
  renderFundTable();
}

function toggleWatchlistModal() {
  const modal = document.getElementById('watchlistModal');
  if (!modal) return;
  const isHidden = modal.classList.toggle('hidden');
  if (!isHidden && typeof FUNDS !== 'undefined') {
    const starred = FUNDS.filter(f => f.starred);
    const body = document.getElementById('watchlistModalBody');
    if (body) {
      if (starred.length === 0) {
        body.innerHTML = '<div class="text-center py-6 text-slate-400 text-xs">ยังไม่มีกองทุนในรายการโปรด</div>';
      } else {
        body.innerHTML = starred.map(f => `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs hover:border-brand-500 cursor-pointer transition" onclick="window.location.href='fund_detail.html?id=${f.id}'">
            <div>
              <span class="font-bold text-slate-900 dark:text-white">${f.id}</span>
              <span class="block text-[11px] text-slate-400 truncate max-w-[200px]">${f.name}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-extrabold ${f.perf >= 0 ? 'text-emerald-600' : 'text-rose-500'} num">${f.perf >= 0 ? '+' : ''}${f.perf}%</span>
              <a href="fund_detail.html?id=${f.id}" class="px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white font-bold transition">ดู ↗</a>
            </div>
          </div>
        `).join('');
      }
    }
  }
}

function toggleFundSelection(id, checked) {
  if (id) {
    if (checked) state.selectedFunds.add(id);
    else state.selectedFunds.delete(id);
  }

  const badge = document.getElementById('compareCount');
  if (badge) badge.textContent = state.selectedFunds.size;

  // Auto-refresh comparison table if it is currently open
  const container = document.getElementById('inlineCompareContainer');
  if (container && !container.classList.contains('hidden')) {
    if (state.selectedFunds.size > 0) {
      renderInlineCompare();
    } else {
      closeInlineCompare();
    }
  }
}

function toggleSelectAllFunds(checked) {
  const filtered = getFilteredFunds();
  filtered.forEach(f => {
    if (checked) state.selectedFunds.add(f.id);
    else state.selectedFunds.delete(f.id);
  });
  renderFundTable();
  toggleFundSelection('', false);
}

function openCompareModal() {
  let fundsToCompare = Array.from(state.selectedFunds);
  
  // If no funds selected yet, select 2 default funds to immediately demonstrate the feature
  if (fundsToCompare.length === 0) {
    const filtered = getFilteredFunds();
    if (filtered.length >= 2) {
      fundsToCompare = [filtered[0].id, filtered[1].id];
      state.selectedFunds.add(filtered[0].id);
      state.selectedFunds.add(filtered[1].id);
      const badge = document.getElementById('compareCount');
      if (badge) badge.textContent = state.selectedFunds.size;
      renderFundTable();
    }
  }

  renderInlineCompare(fundsToCompare);
}

function renderInlineCompare(fundIds) {
  const container = document.getElementById('inlineCompareContainer');
  const content = document.getElementById('inlineCompareContent');
  if (!container || !content) return;

  const targetIds = fundIds || Array.from(state.selectedFunds);
  if (targetIds.length === 0) {
    container.classList.add('hidden');
    return;
  }

  // Find fund objects from FUNDS
  const funds = targetIds.map(id => (typeof FUNDS !== 'undefined' ? FUNDS.find(f => f.id === id) : null)).filter(Boolean);
  if (funds.length === 0) return;

  // Build Side-by-Side Comparison Table matching media_1788422961459.png
  let html = `
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden">
        <thead>
          <tr class="border-b border-slate-200/90 dark:border-slate-800">
            <th class="p-4 sm:p-5 w-48 sm:w-60 bg-slate-50/90 dark:bg-slate-850/80 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              หัวข้อเปรียบเทียบ
            </th>
            ${funds.map(f => `
              <th class="p-4 sm:p-5 bg-blue-50/40 dark:bg-blue-950/20 border-l border-slate-200/80 dark:border-slate-800 min-w-[240px] relative group/col">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0 pr-1">
                    <div class="font-black text-blue-600 dark:text-blue-400 text-base sm:text-lg mb-0.5">${f.id}</div>
                    <div class="text-xs font-normal text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">${f.name}</div>
                    <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">${f.amcFull || f.amc}</div>
                  </div>
                  <!-- ปุ่มลบกองทุนออกจากเปรียบเทียบ -->
                  <button 
                    type="button" 
                    onclick="removeFundFromCompare('${f.id}')" 
                    class="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-100/80 dark:hover:bg-rose-950/60 transition border border-transparent hover:border-rose-200/80 dark:hover:border-rose-800" 
                    title="ลบ ${f.id} ออกจากการเปรียบเทียบ"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
          <!-- Row 1: Market / Type -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              ประเภท / ตลาด
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800">
                ${f.type === 'thai' ? `
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                    <span class="text-[10px] bg-emerald-200 dark:bg-emerald-800 px-1 rounded font-bold">TH</span> ไทย
                  </span>
                ` : `
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                    <span>🌐</span> ต่างประเทศ
                  </span>
                `}
              </td>
            `).join('')}
          </tr>

          <!-- Row 2: Risk Level -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              ระดับความเสี่ยง (Risk)
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                  <span class="text-[10px] opacity-80">Risk</span> ${f.risk}
                </span>
              </td>
            `).join('')}
          </tr>

          <!-- Row 3: 1Y Performance -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              ผลตอบแทน 1 ปี (1Y)
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 font-black text-base ${f.perf >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'} num">
                ${f.perf >= 0 ? '+' : ''}${f.perf}%
              </td>
            `).join('')}
          </tr>

          <!-- Row 4: NAV -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              มูลค่า NAV ต่อหน่วย
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 font-extrabold text-slate-900 dark:text-white num">
                ฿${f.nav.toFixed(4)}
              </td>
            `).join('')}
          </tr>

          <!-- Row 5: AUM -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              ขนาดกองทุน (AUM)
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 num">
                ฿${f.aum ? (f.aum >= 1000 ? (f.aum/1000).toFixed(1) + 'K ล้าน' : f.aum + 'M') : '฿44K'}
              </td>
            `).join('')}
          </tr>

          <!-- Row 6: AMC -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              บลจ. (AMC)
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                ${f.amcFull || f.amc}
              </td>
            `).join('')}
          </tr>

          <!-- Row 7: Sector / หมวดหมู่ -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              Sector / หมวดหมู่
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                ${f.type === 'feeder' ? 'Global Equity' : f.type === 'thai' ? 'Thai Equity' : f.type === 'mixed' ? 'Multi-Asset' : 'Fixed Income / Offshore'}
              </td>
            `).join('')}
          </tr>

          <!-- Row 8: Method / Strategy -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              กลยุทธ์ (Method)
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ${f.master || 'Active Management'}
              </td>
            `).join('')}
          </tr>

          <!-- Row 9: Actions -->
          <tr>
            <td class="p-3.5 sm:p-4 font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-850/40">
              การดำเนินการ
            </td>
            ${funds.map(f => `
              <td class="p-3.5 sm:p-4 border-l border-slate-100 dark:border-slate-800">
                <a href="fund_detail.html?id=${f.id}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition">
                  <span>เปิดหน้ารายละเอียด</span> ↗
                </a>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  content.innerHTML = html;
  container.classList.remove('hidden');
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeInlineCompare() {
  const container = document.getElementById('inlineCompareContainer');
  if (container) container.classList.add('hidden');
  const menu = document.getElementById('compareDropdownMenu');
  if (menu) menu.classList.add('hidden');
}

function removeFundFromCompare(fundId) {
  state.selectedFunds.delete(fundId);
  
  // Refresh checkboxes in the screener table
  renderFundTable();

  const badge = document.getElementById('compareCount');
  if (badge) badge.textContent = state.selectedFunds.size;

  if (state.selectedFunds.size === 0) {
    const content = document.getElementById('inlineCompareContent');
    if (content) {
      content.innerHTML = `
        <div class="text-center py-10 text-slate-400">
          <div class="text-3xl mb-2">⚖️</div>
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200">ไม่มีกองทุนที่เลือกเปรียบเทียบ</p>
          <p class="text-xs text-slate-400 mt-1">กรุณาติ๊กเลือกช่องหน้ารายชื่อกองทุนในตารางด้านบนเพื่อเปรียบเทียบ</p>
        </div>
      `;
    }
  } else {
    renderInlineCompare();
  }
}

function toggleCompareDropdown() {
  const menu = document.getElementById('compareDropdownMenu');
  const chevron = document.getElementById('compareDropdownChevron');
  if (!menu) return;
  const isHidden = menu.classList.contains('hidden');
  if (isHidden) {
    menu.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
  } else {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function toggleInlineCompareCollapse() {
  const content = document.getElementById('inlineCompareContent');
  const text = document.getElementById('compareCollapseText');
  const icon = document.getElementById('compareCollapseIcon');
  const menu = document.getElementById('compareDropdownMenu');
  if (menu) menu.classList.add('hidden');
  const chevron = document.getElementById('compareDropdownChevron');
  if (chevron) chevron.classList.remove('rotate-180');

  if (!content) return;
  const isHidden = content.classList.contains('hidden');
  if (isHidden) {
    content.classList.remove('hidden');
    if (text) text.textContent = 'ย่อตาราง';
    if (icon) icon.textContent = '🔼';
  } else {
    content.classList.add('hidden');
    if (text) text.textContent = 'ขยายตาราง';
    if (icon) icon.textContent = '🔽';
  }
}

function clearAllCompareFunds() {
  state.selectedFunds.clear();
  renderFundTable();
  const badge = document.getElementById('compareCount');
  if (badge) badge.textContent = '0';
  
  const menu = document.getElementById('compareDropdownMenu');
  if (menu) menu.classList.add('hidden');
  const chevron = document.getElementById('compareDropdownChevron');
  if (chevron) chevron.classList.remove('rotate-180');

  const content = document.getElementById('inlineCompareContent');
  if (content) {
    content.innerHTML = `
      <div class="text-center py-10 text-slate-400">
        <div class="text-3xl mb-2">⚖️</div>
        <p class="text-sm font-bold text-slate-700 dark:text-slate-200">ไม่มีกองทุนที่เลือกเปรียบเทียบ</p>
        <p class="text-xs text-slate-400 mt-1">กรุณาติ๊กเลือกช่องหน้ารายชื่อกองทุนในตารางด้านบนเพื่อเปรียบเทียบ</p>
      </div>
    `;
  }
}

// Close compare dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdownContainer = document.getElementById('compareDropdownContainer');
  const menu = document.getElementById('compareDropdownMenu');
  const chevron = document.getElementById('compareDropdownChevron');
  if (dropdownContainer && menu && !dropdownContainer.contains(e.target)) {
    menu.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
});

/* ================= 11. STOCK DETAIL POPUP ================= */
function showStockDetail(stockName) {
  const data = (typeof STOCKS_DB !== 'undefined' && STOCKS_DB[stockName]) ? STOCKS_DB[stockName] : { ticker: stockName, sector: 'Global Equity Holding', ret: '+15.4%', pe: '22.0x', funds: ['SCBNDQ', 'K-CHANGE'] };
  
  document.getElementById('stockModalTitle').textContent = `${stockName} (${data.ticker})`;
  document.getElementById('stockModalSector').textContent = data.sector;
  document.getElementById('stockModalRet').textContent = data.ret;
  document.getElementById('stockModalPe').textContent = data.pe;

  const fContainer = document.getElementById('stockModalFunds');
  fContainer.innerHTML = data.funds.map(fId => `
    <div onclick="closeStockModal(); openQuickDrawer('${fId}')" class="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between items-center cursor-pointer hover:bg-brand-50 transition">
      <span class="font-bold text-slate-800 dark:text-slate-200">${fId}</span>
      <span class="text-[10px] text-brand-600 font-semibold">คลิกดูพอร์ต →</span>
    </div>
  `).join('');

  document.getElementById('stockModal').classList.remove('hidden');
}

function closeStockModal() {
  const modal = document.getElementById('stockModal');
  if (modal) modal.classList.add('hidden');
}

/* ================= 12. GLOBAL AUTOCOMPLETE SEARCH ================= */
function setupGlobalSearch() {
  document.addEventListener('click', (e) => {
    const searchBox = document.getElementById('globalSearchInput');
    const dropdown = document.getElementById('searchDropdown');
    if (searchBox && dropdown && !searchBox.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('globalSearchInput');
      if (input) input.focus();
    }
  });
}

function handleGlobalSearch(query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown || typeof FUNDS === 'undefined') return;

  if (!query.trim()) {
    dropdown.classList.add('hidden');
    return;
  }

  const q = query.toLowerCase();
  const matches = FUNDS.filter(f => f.id.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || f.master.toLowerCase().includes(q)).slice(0, 6);

  if (matches.length === 0) {
    dropdown.innerHTML = '<div class="p-3 text-center text-xs text-slate-400">ไม่พบกองทุนที่ตรงกับคำค้น</div>';
  } else {
    dropdown.innerHTML = matches.map(f => `
      <div onclick="selectGlobalSearchResult('${f.id}')" class="p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between text-xs transition">
        <div>
          <div class="font-bold text-slate-900 dark:text-white">${f.id}</div>
          <div class="text-[10px] text-slate-400 truncate max-w-[180px]">${f.name}</div>
        </div>
        <span class="font-extrabold ${f.perf >= 0 ? 'text-emerald-600' : 'text-rose-500'} num">${f.perf >= 0 ? '+' : ''}${f.perf}%</span>
      </div>
    `).join('');
  }

  dropdown.classList.remove('hidden');
}

function selectGlobalSearchResult(fundId) {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  switchMainTab('fundinfo');
  openQuickDrawer(fundId);
}

/* ================= 13. CSV EXPORT ================= */
function exportCSV() {
  const filtered = getFilteredFunds();
  let csv = 'Fund Code,Fund Name,Type,AMC,NAV,1Y Return %,Risk Level,Dividend Yield %\n';
  filtered.forEach(f => {
    csv += `"${f.id}","${f.name}","${f.type}","${f.amcFull}",${f.nav},${f.perf},${f.risk},${f.div}\n`;
  });

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ideafund_screener_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ================= 14. SYMBOL & SECTOR SEARCH QUICK LINK ================= */
function searchBySymbol(sym) {
  if (!sym) return;
  const input = document.getElementById('tableSearchInput');
  if (input) {
    input.value = sym;
    handleTableFilter();
    const screener = document.getElementById('fund-screener');
    if (screener) screener.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ================= 15. EXPOSURE TOPIC & SCOPE SWITCHER ================= */
let currentExpTopic = 'holdings';
let currentExpScope = 'all';

function setExposureTopic(topic) {
  currentExpTopic = topic;
  document.querySelectorAll('[data-exp-topic]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-exp-topic') === topic);
  });
  document.querySelectorAll('[data-exp-pane]').forEach(pane => {
    pane.classList.toggle('hidden', pane.getAttribute('data-exp-pane') !== topic);
  });
}

function setExposureScope(scope) {
  currentExpScope = scope;
  document.querySelectorAll('[data-exp-scope]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-exp-scope') === scope);
  });

  const foreignCol = document.getElementById('exp-col-foreign');
  const thaiCol = document.getElementById('exp-col-thai');
  const grid = document.getElementById('exp-compare-grid');

  if (scope === 'foreign') {
    if (foreignCol) foreignCol.classList.remove('hidden');
    if (thaiCol) thaiCol.classList.add('hidden');
    if (grid) grid.className = 'grid grid-cols-1 gap-6';
  } else if (scope === 'thai') {
    if (foreignCol) foreignCol.classList.add('hidden');
    if (thaiCol) thaiCol.classList.remove('hidden');
    if (grid) grid.className = 'grid grid-cols-1 gap-6';
  } else {
    if (foreignCol) foreignCol.classList.remove('hidden');
    if (thaiCol) thaiCol.classList.remove('hidden');
    if (grid) grid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative';
  }
}
