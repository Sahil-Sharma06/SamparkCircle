import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve a test HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-page.html'));
});

// Create the test HTML file
const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>API Test</title>
</head>
<body>
  <h1>API Connection Test</h1>
  <button id="testBtn">Test API</button>
  <div id="result"></div>

  <script>
    document.getElementById('testBtn').addEventListener('click', async () => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = 'Testing...';
      
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        
        resultDiv.innerHTML = \`
          <p style="color: green;">✅ Success!</p>
          <pre>\${JSON.stringify(data, null, 2)}</pre>
        \`;
      } catch (error) {
        resultDiv.innerHTML = \`
          <p style="color: red;">❌ Error: \${error.message}</p>
        \`;
      }
    });
  </script>
</body>
</html>
`;

// Write the test HTML file
import fs from 'fs';
fs.writeFileSync(path.join(__dirname, 'test-page.html'), testHtml);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}); 