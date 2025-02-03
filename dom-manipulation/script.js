const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for simulation
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quoteDisplay").innerText = quotes[randomIndex].text;
}

// Add new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;
    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        alert("Quote added successfully!");
    }
}

// Populate categories dynamically
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    document.getElementById("quoteDisplay").innerText = filteredQuotes.length ? filteredQuotes[0].text : "No quotes available.";
}

// Sync quotes with the server
async function syncQuotes() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) throw new Error("Failed to fetch quotes from server");
        
        const serverQuotes = await response.json();
        const formattedQuotes = serverQuotes.map(q => ({ text: q.title, category: "general" }));
        
        loadQuotes();
        mergeQuotes(formattedQuotes);
        saveQuotes();
        showNotification("Quotes successfully synced!");
    } catch (error) {
        console.error("Error syncing quotes:", error);
    }
}

// Merge server and local quotes
function mergeQuotes(serverQuotes) {
    const existingTexts = new Set(quotes.map(q => q.text));
    serverQuotes.forEach(quote => {
        if (!existingTexts.has(quote.text)) {
            quotes.push(quote);
        }
    });
}

// Show notification
function showNotification(message) {
    alert(message);
}

// Event Listeners
window.addEventListener("DOMContentLoaded", function() {
    loadQuotes();
    syncQuotes();
    populateCategories();
});

setInterval(syncQuotes, 30000);
