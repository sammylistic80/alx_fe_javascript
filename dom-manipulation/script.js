// Global array to hold quotes
let quotes = [];

// Local Storage Key
const STORAGE_KEY = "dynamicQuoteGenerator_quotes";

// -----------------------------
// Local Storage Functions
// -----------------------------

/**
 * Saves the quotes array to local storage.
 */
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

/**
 * Loads quotes from local storage.
 */
function loadQuotes() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If no stored quotes, initialize with default quotes
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "motivational" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "inspirational" },
      { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "motivational" },
      { text: "The journey of a thousand miles begins with one step.", category: "philosophical" }
    ];
    saveQuotes();
  }
}

// -----------------------------
// Session Storage Functions
// -----------------------------

/**
 * Saves the last displayed quote to session storage.
 */
function saveLastViewedQuote(quote) {
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

/**
 * Loads the last viewed quote from session storage (if any).
 */
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem("lastViewedQuote");
  return lastQuote ? JSON.parse(lastQuote) : null;
}

// -----------------------------
// Quote Display Functions
// -----------------------------

/**
 * Displays a random quote from the quotes array.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').innerText = "No quotes available. Please add a new quote.";
    return;
  }
  
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  // Update the display container with the quote details
  document.getElementById('quoteDisplay').innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
  
  // Save this quote as the last viewed quote in session storage
  saveLastViewedQuote(quote);
}

/**
 * Displays the last viewed quote if available.
 */
function displayLastViewedQuote() {
  const lastQuote = loadLastViewedQuote();
  if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>Category: ${lastQuote.category}</small>
    `;
  }
}

// -----------------------------
// Dynamic Form for Adding Quotes
// -----------------------------

/**
 * Creates and displays the form for adding a new quote.
 */
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');
  formContainer.innerHTML = ''; // Clear existing content

  const form = document.createElement('form');
  form.id = 'addQuoteForm';

  // Input for quote text
  const textDiv = document.createElement('div');
  textDiv.className = 'form-group';
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter a new quote';
  textInput.required = true;
  textDiv.appendChild(textInput);

  // Input for quote category
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'form-group';
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.required = true;
  categoryDiv.appendChild(categoryInput);

  // Submit button
  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.innerText = 'Add Quote';

  form.appendChild(textDiv);
  form.appendChild(categoryDiv);
  form.appendChild(addButton);
  formContainer.appendChild(form);

  // Event listener for form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    addQuote();
  });
}

/**
 * Adds a new quote to the quotes array and saves it.
 */
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (quoteText === '' || quoteCategory === '') {
    alert('Please fill in both the quote and its category.');
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes(); // Persist updated quotes array

  // Reset the form and show the new quote
  document.getElementById('addQuoteForm').reset();
  showRandomQuote();
}

// -----------------------------
// JSON Import and Export Functions
// -----------------------------

/**
 * Exports the quotes array as a JSON file.
 * (Renamed to exportToJsonFile to meet requirements.)
 */
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // Pretty print with indentation
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Release the blob URL
  URL.revokeObjectURL(url);
}

/**
 * Imports quotes from a JSON file.
 */
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
        alert('Quotes imported successfully!');
        // Optionally, display one of the imported quotes:
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
// Event Listeners and Initialization
// -----------------------------

document.addEventListener('DOMContentLoaded', function() {
  // Load quotes from local storage
  loadQuotes();

  // If a last viewed quote is stored, display it; otherwise, show a random quote
  if (loadLastViewedQuote()) {
    displayLastViewedQuote();
  } else {
    showRandomQuote();
  }

  // Event listener for "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Create the add quote form dynamically
  createAddQuoteForm();

  // Event listener for export button (using the updated function name)
  document.getElementById('exportJson').addEventListener('click', exportToJsonFile);

  // Event listener for import file input
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
});