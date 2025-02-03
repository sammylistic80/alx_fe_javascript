const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Ensure correct API endpoint
const STORAGE_KEY = "dynamicQuoteGenerator_quotes";

let quotes = [];

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem(STORAGE_KEY);
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    // Fetch quotes from the server
    const response = await fetch(SERVER_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch quotes from the server");
    }
    
    const serverQuotes = await response.json();
    
    // Convert server quotes to match local format
    const formattedQuotes = serverQuotes.map(q => ({
      text: q.title, // Adjust property names based on API response
      category: "general" // Default category (adjust as needed)
    }));

    // Load local quotes
    loadQuotes();
    
    // Merge server quotes with local quotes
    mergeQuotes(formattedQuotes);
    
    showNotification("Quotes successfully synced!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

// Function to add new quote and sync to server
async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };

  // Save locally
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showNotification("New quote added!");

  // Send to server
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuote)
    });

    if (!response.ok) {
      throw new Error("Failed to sync with server");
    }

    showNotification("Quote synced with server!");
  } catch (error) {
    console.error("Error syncing quote:", error);
  }
}

// Function to merge server quotes with local storage
function mergeQuotes(serverQuotes) {
  loadQuotes();
  const localQuoteTexts = new Set(quotes.map(q => q.text));
  let newQuotes = serverQuotes.filter(q => !localQuoteTexts.has(q.text));

  if (newQuotes.length > 0) {
    quotes.push(...newQuotes);
    saveQuotes();
    showNotification(`${newQuotes.length} new quotes added from server.`);
    populateCategories();
  }
}

// Show notifications
function showNotification(message) {
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.className = "notification";
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Periodic syncing every 30 seconds
setInterval(syncQuotes, 30000);

// Initialize application
document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  syncQuotes(); // Initial sync on page load
  populateCategories();
});
