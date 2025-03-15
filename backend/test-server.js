import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint is working!',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/api/test`);
}); 