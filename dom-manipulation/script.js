// Initialize quotes from localStorage if available, otherwise use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Philosophy" }
];

// Get the category filter dropdown element
const categoryFilter = document.getElementById('categoryFilter');

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
    const selectedCategory = categoryFilter.value;
    // Store the selected category in localStorage
    localStorage.setItem('selectedCategory', selectedCategory);

    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    displayQuotes(filteredQuotes);
}

// Function to populate the categories dropdown dynamically
function populateCategories() {
    // Get all unique categories from the quotes array
    const categories = [...new Set(quotes.map(quote => quote.category))];

    // Clear existing options in the dropdown and add the "All Categories" option
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add options for each category
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
        saveQuotes(); // Save the new quotes array to localStorage
        populateCategories(); // Update the categories dropdown
        alert('Quote added successfully!');
        
        // Clear the input fields after adding the quote
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    } else {
        alert('Please provide both a quote and a category.');
    }
}

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
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
        saveQuotes(); // Save the new quotes to localStorage
        populateCategories(); // Update the categories dropdown
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Call the function to populate the categories dropdown when the page loads
populateCategories();
