const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your MockAPI endpoint
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

// Function to fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    const formattedQuotes = serverQuotes.map(q => ({
      text: q.title,
      category: "general"
    }));

    mergeQuotes(formattedQuotes);
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
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
setInterval(fetchQuotesFromServer, 30000);

// Initialize application
document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  fetchQuotesFromServer(); // Initial fetch
  populateCategories();
});