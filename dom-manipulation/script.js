// ===========================
// Dynamic Quote Generator
// ===========================

// Load quotes from local storage or default ones
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// --- Save to Local Storage ---
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Populate category dropdown ---
function updateCategoryList() {
  const categorySelect = document.getElementById('categorySelect');
  const categories = [...new Set(quotes.map(q => q.category))];
  
  // Clear old options
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  
  // Add new categories dynamically
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// --- Display a random quote ---
function showRandomQuote() {
  const category = document.getElementById('categorySelect').value;
  let filteredQuotes = quotes;

  if (category !== 'all') {
    filteredQuotes = quotes.filter(q => q.category === category);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available in this category.";
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById('quoteDisplay').textContent = `"${randomQuote.text}" — [${randomQuote.category}]`;

  // Save last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// --- Add a new quote ---
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  updateCategoryList();

  textInput.value = '';
  categoryInput.value = '';

  alert("Quote added successfully!");
}

// --- Load last viewed quote on page load ---
function loadLastViewedQuote() {
  const last = sessionStorage.getItem('lastViewedQuote');
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" — [${quote.category}]`;
  }
}

// --- Event listeners ---
document.addEventListener('DOMContentLoaded', () => {
  updateCategoryList();
  loadLastViewedQuote();

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuote').addEventListener('click', addQuote);
});

// --- Export to JSON ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// --- Import from JSON ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = e => {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryList();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Add listeners
document.getElementById('exportJson').addEventListener('click', exportToJsonFile);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);
