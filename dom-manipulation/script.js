// Quotes array with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${randomQuote.text}</p>
    <p><em>Category:</em> ${randomQuote.category}</p>
  `;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("quoteText");
  const categoryInput = document.getElementById("quoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    showRandomQuote(); // Update display
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote text and category!");
  }
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
  const container = document.getElementById("addQuoteContainer");

  const textInput = document.createElement("input");
  textInput.id = "quoteText";
  textInput.placeholder = "Enter quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "quoteCategory";
  categoryInput.placeholder = "Enter category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(textInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);
}

// Event listener for “Show New Quote”
document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);

// Initialize
window.onload = () => {
  showRandomQuote();
  createAddQuoteForm(); // dynamically create the form
};
