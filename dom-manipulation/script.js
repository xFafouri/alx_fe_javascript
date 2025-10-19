/* script.js - Extended with server sync & conflict resolution */

/* ---------- Config ---------- */
const LS_KEY = 'quotes';
const LS_SELECTED_CATEGORY = 'selectedCategory';
const SESSION_LAST = 'lastQuote';
const SYNC_INTERVAL_MS = 30_000; // 30 seconds (adjust for testing)
const MOCK_SERVER_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts?_limit=10'; 
// NOTE: JSONPlaceholder posts are used to simulate server quotes

/* ---------- Utilities ---------- */
function generateId(prefix = 'loc') {
  // deterministic-ish unique ID for client-created quotes
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function isValidQuote(obj) {
  return obj && typeof obj === 'object'
    && typeof obj.id === 'string'
    && typeof obj.text === 'string' && obj.text.trim().length > 0
    && typeof obj.category === 'string' && obj.category.trim().length > 0;
}

function loadLocalQuotes() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return null;
    const valid = arr.filter(isValidQuote).map(q => ({ id: q.id, text: q.text.trim(), category: q.category.trim() }));
    return valid.length ? valid : null;
  } catch (e) {
    console.warn('Failed to load local quotes', e);
    return null;
  }
}

function saveLocalQuotes(qs) {
  localStorage.setItem(LS_KEY, JSON.stringify(qs));
}

/* ---------- Initial Data & State ---------- */
let quotes = loadLocalQuotes() || [
  { id: generateId(), text: "The best way to predict the future is to create it.", category: "Motivation" },
  { id: generateId(), text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { id: generateId(), text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];
saveLocalQuotes(quotes);

let selectedCategory = localStorage.getItem(LS_SELECTED_CATEGORY) || 'all';

/* ---------- DOM helpers ---------- */
const el = id => document.getElementById(id);

function populateCategories() {
  const sel = el('categoryFilter') || el('categorySelect'); // support either id used earlier
  if (!sel) return;
  const cats = ['all', ...new Set(quotes.map(q => q.category))];
  sel.innerHTML = '';
  cats.forEach(c => {
    const o = document.createElement('option');
    o.value = c;
    o.textContent = c;
    sel.appendChild(o);
  });
  sel.value = selectedCategory;
}

/* ---------- Display helpers ---------- */
function displayQuote(q) {
  const disp = el('quoteDisplay');
  if (!disp) return;
  if (!q) {
    disp.textContent = 'No quote to display.';
    return;
  }
  disp.textContent = `"${q.text}" — [${q.category}]`;
}

/* ---------- Filter logic (explicit use of selectedCategory) ---------- */
function getFilteredQuotes() {
  if (selectedCategory === 'all') return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

/* ---------- Show random quote ---------- */
function showRandomQuote() {
  const pool = getFilteredQuotes();
  const disp = el('quoteDisplay');
  if (!pool.length) {
    if (disp) disp.textContent = 'No quotes for this category.';
    return;
  }
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  displayQuote(chosen);
  sessionStorage.setItem(SESSION_LAST, JSON.stringify(chosen));
}

/* ---------- Add quote ---------- */
function addQuoteFromInputs() {
  const textEl = el('newQuoteText');
  const catEl = el('newQuoteCategory');
  if (!textEl || !catEl) return;
  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) {
    alert('Enter text and category.');
    return;
  }
  const newQ = { id: generateId('loc'), text, category };
  quotes.push(newQ);
  saveLocalQuotes(quotes);
  populateCategories();
  textEl.value = '';
  catEl.value = '';
  alert('Quote added.');
}

/* ---------- Import/Export (unchanged) ---------- */
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a')
}
