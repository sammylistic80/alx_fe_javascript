// An array to hold our quote objects
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "motivational" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "inspirational" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "motivational" },
    { text: "The journey of a thousand miles begins with one step.", category: "philosophical" }
  ];
  
  /**
   * Display a random quote from the quotes array in the quoteDisplay container.
   */
  function showRandomQuote() {
    if (quotes.length === 0) {
      document.getElementById('quoteDisplay').innerText = "No quotes available. Please add a new quote.";
      return;
    }
    
    // Get a random quote from the array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    // Display the quote text and category
    document.getElementById('quoteDisplay').innerHTML = `
      <p>"${quote.text}"</p>
      <small>Category: ${quote.category}</small>
    `;
  }
  
  /**
   * Dynamically creates and displays the form for adding a new quote.
   */
  function createAddQuoteForm() {
    // Get the container where the form will be placed
    const formContainer = document.getElementById('formContainer');
    
    // Clear any existing form content
    formContainer.innerHTML = '';
  
    // Create a form element (optional if you need form semantics)
    const form = document.createElement('form');
    form.id = 'addQuoteForm';
  
    // Create input for quote text
    const textInputDiv = document.createElement('div');
    textInputDiv.className = 'form-group';
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'newQuoteText';
    textInput.placeholder = 'Enter a new quote';
    textInput.required = true;
    textInputDiv.appendChild(textInput);
    
    // Create input for quote category
    const categoryInputDiv = document.createElement('div');
    categoryInputDiv.className = 'form-group';
    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.id = 'newQuoteCategory';
    categoryInput.placeholder = 'Enter quote category';
    categoryInput.required = true;
    categoryInputDiv.appendChild(categoryInput);
    
    // Create the Add Quote button
    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.innerText = 'Add Quote';
    
    // Append inputs and button to the form
    form.appendChild(textInputDiv);
    form.appendChild(categoryInputDiv);
    form.appendChild(addButton);
    
    // Append the form to the container
    formContainer.appendChild(form);
    
    // Add submit event listener to the form
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from reloading the page
      addQuote();
    });
  }
  
  /**
   * Adds a new quote to the quotes array and clears the form.
   */
  function addQuote() {
    // Get the input values
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
    
    if (newQuoteText === '' || newQuoteCategory === '') {
      alert('Please fill in both the quote and its category.');
      return;
    }
    
    // Create a new quote object
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };
    
    // Add the new quote to the quotes array
    quotes.push(newQuote);
    
    // Clear the form inputs for next use
    document.getElementById('addQuoteForm').reset();
    
    // Optionally, display the new quote immediately or refresh the display
    showRandomQuote();
  }
  
  // Setup event listeners once the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Display an initial random quote if available
    showRandomQuote();
    
    // Attach click event listener to the "Show New Quote" button
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    
    // Dynamically create the add quote form
    createAddQuoteForm();
  });  