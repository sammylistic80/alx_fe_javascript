// Global array to hold quotes
let quotes = [];

// Local Storage Keys
const STORAGE_KEY = "dynamicQuoteGenerator_quotes";
const FILTER_KEY = "lastSelectedFilter";

// -----------------------------
// Local Storage Functions
// -----------------------------

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if none exist in storage
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "motivational" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "inspirational" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "motivational" },
      { text: "The journey of a thousand miles begins with one step.", category: "philosophical" }
    ];
    saveQuotes();
  }
}

function saveLastSelectedFilter(filter) {
  localStorage.setItem(FILTER_KEY, filter);
}

function loadLastSelectedFilter() {
  return localStorage.getItem(FILTER_KEY) || "all";
}

// -----------------------------
// Quote Display Functions
// -----------------------------

/**
 * Shows a random quote that matches the currently selected category filter.
 */
function showRandomQuote() {
  const filter = document.getElementById("categoryFilter").value;
  let filteredQuotes = quotes;

  if (filter !== "all") {
    filteredQuotes = quotes.filter(q => q.category.toLowerCase() === filter.toLowerCase());
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available for the selected category.";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
}

/**
 * Called when the user changes the category filter.
 */
function filterQuotes() {
  const selectedFilter = document.getElementById("categoryFilter").value;
  // Save the last selected filter in local storage.
  saveLastSelectedFilter(selectedFilter);
  // Show a random quote that matches the filter.
  showRandomQuote();
}

// -----------------------------
// Category Population
// -----------------------------

/**
 * Populates the category filter dropdown with unique categories from the quotes array.
 */
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  // Start with an array that always includes "all".
  const categories = new Set();

  quotes.forEach(quote => {
    if (quote.category) {
      // Use lower case for consistency.
      categories.add(quote.category.toLowerCase());
    }
  });
  
  // Clear existing options except "All Categories"
  select.innerHTML = `<option value="all">All Categories</option>`;
  
  // Append new options from the set of unique categories.
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    // Capitalize the first letter for display purposes.
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });
  
  // Restore the last selected filter, if available.
  const lastFilter = loadLastSelectedFilter();
  select.value = lastFilter;
}

// -----------------------------
// Dynamic Form for Adding Quotes
// -----------------------------

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = ""; // Clear existing content

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  // Input for quote text
  const textDiv = document.createElement("div");
  textDiv.className = "form-group";
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  textInput.required = true;
  textDiv.appendChild(textInput);

  // Input for quote category
  const categoryDiv = document.createElement("div");
  categoryDiv.className = "form-group";
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.required = true;
  categoryDiv.appendChild(categoryInput);

  // Submit button
  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.innerText = "Add Quote";

  form.appendChild(textDiv);
  form.appendChild(categoryDiv);
  form.appendChild(addButton);
  formContainer.appendChild(form);

  form.addEventListener("submit", function(event) {
    event.preventDefault();
    addQuote();
  });
}

/**
 * Adds a new quote to the quotes array, updates storage and the categories.
 */
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and its category.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  
  // Re-populate the category dropdown if new category added.
  populateCategories();

  document.getElementById("addQuoteForm").reset();
  // Display a random quote that respects the current filter.
  showRandomQuote();
}

// -----------------------------
// JSON Import and Export Functions (if needed)
// -----------------------------

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

function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        // Update the category filter after importing new quotes.
        populateCategories();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid file format: JSON data must be an array of quotes.");
      }
    } catch (error) {
      alert("Error reading JSON file: " + error.message);
    }
  };
  fileReader.readAsText(file);
}

// -----------------------------
// Initialization
// -----------------------------

document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  populateCategories();

  // Set the filter dropdown to the last selected filter, if any.
  document.getElementById("categoryFilter").value = loadLastSelectedFilter();
  
  // Show a random quote using the current filter.
  showRandomQuote();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  createAddQuoteForm();

  // Export and Import event listeners (if using JSON functionality)
  document.getElementById("exportJson").addEventListener("click", exportToJsonFile);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);
});