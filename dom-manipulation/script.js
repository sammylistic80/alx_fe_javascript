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
    