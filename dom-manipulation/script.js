const STORAGE_KEY = "dynamicQuoteGenerator_quotes";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Replace with your MockAPI URL

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

// Fetch quotes from mock server
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

// Merge new server data with local storage
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

// Resolve conflicts where the server's data takes precedence
function resolveConflicts(serverQuotes) {
  loadQuotes();

  let updated = false;
  serverQuotes.forEach(serverQuote => {
    let localQuote = quotes.find(q => q.text === serverQuote.text);
    if (localQuote && localQuote.category !== serverQuote.category) {
      localQuote.category = serverQuote.category;
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    showNotification("Conflicts resolved: Server updates applied.");
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

// Periodic syncing
setInterval(fetchQuotesFromServer, 30000);

// Initialize application
document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  fetchQuotesFromServer(); // Initial fetch
  populateCategories();
});