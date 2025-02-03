// Initialize quotes from localStorage if available, otherwise use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Philosophy" }
];

// Simulated API base URL for mock server interaction
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the mock server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.map(post => ({
            text: post.body,
            category: post.title
        }));
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}

// Function to sync local storage with server (with POST request)
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length === 0) {
        alert("No quotes found from server.");
        return;
    }

    // Conflict resolution: Server data takes precedence
    const updatedQuotes = [...serverQuotes, ...quotes.filter(localQuote => !serverQuotes.some(serverQuote => serverQuote.text === localQuote.text))];

    // Save the updated quotes to localStorage
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));

    // Update the local quotes array and refresh the displayed quotes
    quotes = updatedQuotes;
    populateCategories();
    alert('Quotes synced with server!');

    // Simulate sending the updated quotes to the server (POST request with necessary headers)
    try {
        const response = await fetch(apiUrl, {
            method: 'POST', // Define method as POST
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify(updatedQuotes) // Send the updated quotes as the request body
        });

        if (response.ok) {
            console.log('Quotes successfully synced to the server!');
        } else {
            console.error('Failed to sync quotes to the server.');
        }
    } catch (error) {
        console.error('Error syncing quotes with the server:', error);
    }
}


// Periodically check for new quotes from the server every 10 seconds
setInterval(syncWithServer, 10000);

// Function to display quotes based on selected filter
function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = '<p>No quotes found for this category.</p>';
    } else {
        filteredQuotes.forEach(quote => {
            quoteDisplay.innerHTML += `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
        });
    }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    displayQuotes(filteredQuotes);
}

// Function to populate the categories dropdown dynamically
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category from localStorage (if any)
    const savedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = savedCategory;
    filterQuotes(); // Apply the selected filter
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to localStorage
        populateCategories(); // Update categories dropdown
        alert('Quote added successfully!');
        
        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please provide both a quote and a category.');
    }
}

// Function to export quotes to a JSON file
function exportToJson() {
    const jsonBlob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to localStorage
        populateCategories(); // Update categories dropdown
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Call the function to populate the categories dropdown when the page loads
populateCategories();
