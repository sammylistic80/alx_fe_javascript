<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dynamic Quote Generator with Storage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 2rem;
    }
    #quoteDisplay {
      margin: 1rem 0;
      padding: 1rem;
      background-color: #f0f0f0;
      border-left: 5px solid #007acc;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    input[type="text"], input[type="file"] {
      padding: 0.5rem;
      margin-right: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
    }
    #controls {
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <h1>Dynamic Quote Generator</h1>
  
  <!-- Display Area for Quotes -->
  <div id="quoteDisplay">Click the button to display a quote.</div>
  <button id="newQuote">Show New Quote</button>

  <!-- Add Quote Form Container -->
  <div id="formContainer"></div>
  
  <!-- Controls for Import/Export -->
  <div id="controls">
    <!-- Ensure the button text is exactly "Export Quotes" -->
    <button id="exportJson">Export Quotes</button>
    <!-- File input for importing quotes -->
    <input type="file" id="importFile" accept=".json" />
  </div>
  
  <script src="script.js"></script>
</body>
</html>