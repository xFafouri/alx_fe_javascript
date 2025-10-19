// === Initialization ===
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
];

let selectedCategory = localStorage.getItem("selectedCategory") || "all";
const notificationArea = document.createElement("div");
notificationArea.id = "notificationArea";
notificationArea.style.color = "green";
notificationArea.style.marginTop = "10px";
document.body.appendChild(notificationArea);

// === Utility Functions ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = selectedCategory;
}

// === Quote Display ===
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const display = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    display.textContent = "No quotes found for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  display.textContent = `"${quote.text}" — [${quote.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function getFilteredQuotes() {
  if (selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// === Add Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }
  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  postQuoteToServer({ text, category });
  alert("Quote added successfully!");
}

// === Filtering ===
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// === JSON Import / Export ===
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
        alert("Invalid JSON format. Each quote must have 'text' and 'category'.");
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Error reading the JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === 🛰️ Server Sync Section ===

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await response.json();
    // Simulate server quotes
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: "Server"
    }));
    return serverQuotes;
  } catch (error) {
    console.error("Failed to fetch from server:", error);
    return [];
  }
}

// Post a new quote to the mock server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

// Sync quotes periodically
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  let conflictsResolved = 0;
  serverQuotes.forEach(serverQuote => {
    const existing = quotes.find(q => q.text === serverQuote.text);
    if (existing) {
      // Conflict resolution: server wins
      existing.category = serverQuote.category;
      conflictsResolved++;
    } else {
      quotes.push(serverQuote);
    }
  });

  if (serverQuotes.length > 0) {
    saveQuotes();
    populateCategories();
    if (conflictsResolved > 0) {
      showNotification(`✅ Synced with server. ${conflictsResolved} conflicts resolved.`);
    } else {
      showNotification("✅ Synced with server. No conflicts found.");
    }
  }
}

function showNotification(message) {
  notificationArea.textContent = message;
  setTimeout(() => (notificationArea.textContent = ""), 4000);
}

// Periodic server sync (every 30s)
setInterval(syncQuotes, 30000);

// === Initialization ===
window.onload = () => {
  populateCategories();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").textContent = `"${quote.text}" — [${quote.category}]`;
  } else {
    showRandomQuote();
  }
  document.getElementById("newQuote").onclick = showRandomQuote;
  document.getElementById("addQuoteBtn").onclick = addQuote;
  document.getElementById("exportBtn").onclick = exportToJsonFile;

  // Initial sync on load
  syncQuotes();
};
