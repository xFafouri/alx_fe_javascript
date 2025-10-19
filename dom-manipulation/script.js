// --- Step 1: Load existing quotes from Local Storage ---
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// --- Step 2: Validate that all quotes have 'text' and 'category' ---
if (!Array.isArray(quotes) || quotes.some(q => !q.text || !q.category)) {
  console.warn("Invalid quotes data found in localStorage. Resetting to defaults.");
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
  ];
  saveQuotes();
}

// --- Save quotes to Local Storage ---
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Display a random quote ---
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" — [${quote.category}]`;

  // Save last viewed quote in Session Storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// --- Add a new quote ---
function addQuote() {
  const text = prompt("Enter a new quote:");
  if (!text) return;

  const category = prompt("Enter a category for this quote:");
  if (!category) return;

  quotes.push({ text, category });
  saveQuotes();
  alert("Quote added successfully!");
}

// --- Export quotes as JSON file ---
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Import quotes from JSON file ---
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format. Each quote must have 'text' and 'category'.");
      }
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --- On page load: show last viewed quote if available ---
window.onload = function() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" — [${quote.category}]`;
  }
};