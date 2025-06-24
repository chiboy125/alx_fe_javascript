let quotes = [];

// Load quotes from localStorage or use default
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The purpose of our lives is to be happy.", category: "Happiness" }
    ];
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  filteredQuotes.forEach((quote) => {
    const quoteText = document.createElement("p");
    quoteText.innerHTML = `<strong>Quote:</strong> ${quote.text}`;
    const quoteCategory = document.createElement("p");
    quoteCategory.innerHTML = `<em>Category:</em> ${quote.category}`;
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
    quoteDisplay.appendChild(document.createElement("hr"));
  });
}

// Show a random quote
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) return;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.innerHTML = `<strong>Quote:</strong> ${quote.text}`;
  const quoteCategory = document.createElement("p");
  quoteCategory.innerHTML = `<em>Category:</em> ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  sessionStorage.setItem("lastViewedQuote", randomIndex);
}

// Filter logic
function getFilteredQuotes() {
  const filter = document.getElementById("categoryFilter").value;
  if (filter === "all") return quotes;
  return quotes.filter(q => q.category === filter);
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  displayQuotes(getFilteredQuotes());
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const select = document.getElementById("categoryFilter");
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) select.value = savedFilter;
}

// Add new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");
  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    filterQuotes();
    postQuoteToServer(newQuote);
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Export to JSON
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

// Import from JSON
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON structure.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// ✅ POST a quote to mock server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    console.log("Quote posted to server (simulated)");
  } catch (error) {
    console.error("Failed to post quote to server.");
  }
}

// ✅ Required: fetchQuotesFromServer — used inside sync
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (err) {
    console.warn("Fetch from server failed.");
    return [];
  }
}

// ✅ Sync logic — called on load & periodically
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const existingTexts = new Set(quotes.map(q => q.text));
  let newAdded = 0;

  serverQuotes.forEach(q => {
    if (!existingTexts.has(q.text)) {
      quotes.push(q);
      newAdded++;
    }
  });

  if (newAdded > 0) {
    saveQuotes();
    populateCategories();
    filterQuotes();
    notifyUser(`${newAdded} new quotes synced from server.`);
  }
}

// ✅ Simple UI notice
function notifyUser(message) {
  const notice = document.createElement("div");
  notice.textContent = message;
  notice.style.backgroundColor = "#e0ffe0";
  notice.style.border = "1px solid #080";
  notice.style.padding = "8px";
  notice.style.marginTop = "10px";
  document.body.insertBefore(notice, document.getElementById("quoteDisplay"));
  setTimeout(() => notice.remove(), 4000);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
  document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  // ✅ Start syncing
  syncQuotes(); // On load
  setInterval(syncQuotes, 30000); // Every 30s
});
