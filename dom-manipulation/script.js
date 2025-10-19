// Quotes array with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" }
];

// Function to display a random quote
function displayRandomQuote() {
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
    displayRandomQuote(); // Update the display
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote text and category!");
  }
}

// Event listeners
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Display one quote when the page loads
window.onload = displayRandomQuote;
