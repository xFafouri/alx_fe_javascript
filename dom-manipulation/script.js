// Default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Don’t watch the clock; do what it does. Keep going.", category: "Productivity" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" },
];

// Get elements
const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");

// 🧩 Populate dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// 🧩 Display quotes (filtered or all)
function displayQuotes(filteredQuotes = quotes) {
  quoteContainer.innerHTML = "";
  filteredQuotes.forEach(q => {
    const quoteDiv = document.createElement("div");
    quoteDiv.style.margin = "10px 0";
    quoteDiv.style.padding = "10px";
    quoteDiv.style.border = "1px solid #ddd";
    quoteDiv.innerHTML = `<p>"${q.text}"</p><small><b>Category:</b> ${q.category}</small>`;
    quoteContainer.appendChild(quoteDiv);
  });
}

// 🧩 Filter quotes by selected category
function filterQuote(category) {
  const filtered = quotes.filter(q => q.category === category);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = filtered[randomIndex].text;
}

// 🧩 Add new quote and update categories
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category.");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Re-populate categories and update display
  populateCategories();
  filterQuotes();

  // Clear inputs
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// Initialize on load
window.onload = () => {
  populateCategories();
  filterQuotes();
};

window.addEventListener('DOMContentLoaded', () => {
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuote(savedCategory);
  }
});
