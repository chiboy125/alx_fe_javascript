// Array to store quotes
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> ${quote.text}</p>
    <p><em>Category:</em> ${quote.category}</p>
  `;
}

// Function to add a new quote and update the DOM
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);

    // Optionally show the newly added quote immediately
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${newQuote.text}</p>
      <p><em>Category:</em> ${newQuote.category}</p>
    `;

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both the quote and category.");
  }
}

// Attach event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
});
