import express from 'express';
import cors from 'cors';
import planHandler from '../api/plan';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Convert our handler to work with Express
app.post('/api/plan', async (req, res) => {
  try {
    const request = new Request('http://localhost/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const response = await planHandler(request);
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Stream the response
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    }
    
    res.end();
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

export default app;