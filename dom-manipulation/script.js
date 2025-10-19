/* script.js
   Dynamic Quote Generator with LocalStorage, SessionStorage, Import/Export (JSON)
*/

// ---------- Utilities ----------
const LS_KEY = 'quotes';
const SESSION_LAST = 'lastViewedQuote';
const SESSION_PREF = 'preferredCategory';

// Validate that an item is a proper quote object
function isValidQuote(obj) {
  return obj
    && typeof obj === 'object'
    && typeof obj.text === 'string'
    && obj.text.trim().length > 0
    && typeof obj.category === 'string'
    && obj.category.trim().length > 0;
}

// Load quotes from localStorage, return array (validated)
function loadQuotesFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Filter and normalize (trim)
    const valid = parsed
      .filter(isValidQuote)
      .map(q => ({ text: q.text.trim(), category: q.category.trim() }));
    return valid.length ? valid : null;
  } catch (e) {
    console.warn('Failed to parse quotes from localStorage:', e);
    return null;
  }
}

// Save quotes array to localStorage
function saveQuotesToLocalStorage(quotes) {
  localStorage.setItem(LS_KEY, JSON.stringify(quotes));
}

// Merge newQuotes into quotes array, avoid exact duplicates
function mergeQuotes(baseQuotes, newQuotes) {
  const set = new Set(baseQuotes.map(q => `${q.text}||${q.category}`));
  newQuotes.forEach(q => {
    if (isValidQuote(q)) {
      const key = `${q.text.trim()}||${q.category.trim()}`;
      if (!set.has(key)) {
        baseQuotes.push({ text: q.text.trim(), category: q.category.trim() });
        set.add(key);
      }
    }
  });
  return baseQuotes;
}

// ---------- Default quotes (used if nothing valid in storage) ----------
const DEFAULT_QUOTES = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ---------- Application State ----------
let quotes = []; // will be filled on init

// ---------- DOM helpers ----------
function el(id) { return document.getElementById(id); }

function updateCategorySelect() {
  const select = el('categorySelect');
  const categories = Array.from(new Set(quotes.map(q => q.category))).sort();
  // Keep the currently selected category if possible
  const current = select.value || 'all';
  select.innerHTML = '';
  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = 'All Categories';
  select.appendChild(allOpt);
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  // Restore selection if still available, otherwise 'all'
  if ([...select.options].some(o => o.value === current)) {
    select.value = current;
  } else {
    select.value = 'all';
  }
}

// Display a quote object in the #quoteDisplay
function displayQuote(quote) {
  const disp = el('quoteDisplay');
  if (!quote) {
    disp.textContent = 'No quote to display.';
    return;
  }
  disp.textContent = `"${quote.text}" — [${quote.category}]`;
}

// ---------- Feature: Show Random Quote ----------
function showRandomQuote() {
  const cat = el('categorySelect').value;
  let pool = quotes;
  if (cat && cat !== 'all') pool = quotes.filter(q => q.category === cat);
  if (!pool.length) {
    displayQuote({ text: 'No quotes available for this category.', category: '' });
    return;
  }
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  displayQuote(chosen);
  // Save last viewed quote to session storage
  sessionStorage.setItem(SESSION_LAST, JSON.stringify(chosen));
}

// ---------- Feature: Add Quote (from form inputs) ----------
function addQuoteFromInputs() {
  const textInput = el('newQuoteText');
  const catInput = el('newQuoteCategory');
  const text = textInput.value ? textInput.value.trim() : '';
  const category = catInput.value ? catInput.value.trim() : '';

  if (!text || !category) {
    alert('Please enter both the quote text and a category.');
    return;
  }

  const newQuote = { text, category };
  if (!isValidQuote(newQuote)) {
    alert('Invalid quote — text and category must be non-empty strings.');
    return;
  }

  // avoid exact duplicate
  const exists = quotes.some(q => q.text === newQuote.text && q.category === newQuote.category);
  if (exists) {
    alert('This exact quote already exists.');
    textInput.value = '';
    catInput.value = '';
    return;
  }

  quotes.push(newQuote);
  saveQuotesToLocalStorage(quotes);
  updateCategorySelect();
  textInput.value = '';
  catInput.value = '';
  alert('Quote added successfully!');
}

// ---------- Feature: Export to JSON ----------
function exportToJsonFile() {
  try {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Failed to export quotes.');
    console.error(e);
  }
}

// ---------- Feature: Import from JSON ----------
function importFromJsonFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (!Array.isArray(parsed)) {
        alert('Invalid JSON: expected an array of quote objects.');
        return;
      }
      const validIncoming = parsed.filter(isValidQuote).map(q => ({ text: q.text.trim(), category: q.category.trim() }));
      if (!validIncoming.length) {
        alert('No valid quote objects found in the file. Each quote must have "text" and "category" strings.');
        return;
      }
      // Merge and save
      quotes = mergeQuotes(quotes, validIncoming);
      saveQuotesToLocalStorage(quotes);
      updateCategorySelect();
      alert(`Imported ${validIncoming.length} valid quotes (duplicates skipped).`);
    } catch (e) {
      alert('Failed to read or parse the file. Make sure it is valid JSON.');
      console.error(e);
    }
  };
  reader.onerror = function () {
    alert('Error reading the file.');
  };
  reader.readAsText(file);
}

// ---------- Session: Preferred category example ----------
function setPreferredCategoryIfAny() {
  // Example: store selected category for the session
  const select = el('categorySelect');
  select.addEventListener('change', () => {
    const val = select.value || 'all';
    sessionStorage.setItem(SESSION_PREF, val);
  });

  // restore if exists
  const pref = sessionStorage.getItem(SESSION_PREF);
  if (pref) select.value = pref;
}

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', () => {
  // Load from local storage, validate; fallback to default if needed
  const loaded = loadQuotesFromLocalStorage();
  quotes = loaded && loaded.length ? loaded : DEFAULT_QUOTES.slice();
  // Save defaults back to storage if none existed
  saveQuotesToLocalStorage(quotes);

  // Wire up UI
  updateCategorySelect();
  setPreferredCategoryIfAny();

  // Load last viewed quote from session if present
  const last = sessionStorage.getItem(SESSION_LAST);
  if (last) {
    try {
      const q = JSON.parse(last);
      if (isValidQuote(q)) displayQuote(q);
    } catch (e) {
      // ignore
    }
  }

  // Buttons and inputs
  el('newQuote').addEventListener('click', showRandomQuote);
  el('addQuote').addEventListener('click', addQuoteFromInputs);
  el('exportJson').addEventListener('click', exportToJsonFile);
  el('importFile').addEventListener('change', (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (f) importFromJsonFile(f);
    // reset input so same file can be selected again later if needed
    ev.target.value = '';
  });
});
