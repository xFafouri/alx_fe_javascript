    // --- Step 1: Load existing quotes from Local Storage ---
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
      "The best way to get started is to quit talking and begin doing.",
      "Don’t let yesterday take up too much of today.",
      "It’s not whether you get knocked down, it’s whether you get up."
    ];

    // --- Save quotes to Local Storage ---
    function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // --- Display a random quote ---
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      document.getElementById('quoteDisplay').textContent = quote;

      // Save last viewed quote in Session Storage
      sessionStorage.setItem('lastViewedQuote', quote);
    }

    // --- Add a new quote ---
    function addQuote() {
      const newQuote = prompt("Enter a new quote:");
      if (newQuote) {
        quotes.push(newQuote);
        saveQuotes();
        alert("Quote added successfully!");
      }
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
          if (Array.isArray(importedQuotes)) {
            quotes.push(...importedQuotes);
            saveQuotes();
            alert("Quotes imported successfully!");
          } else {
            alert("Invalid JSON format. Expected an array of quotes.");
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
        document.getElementById('quoteDisplay').textContent = lastQuote;
      }
    };