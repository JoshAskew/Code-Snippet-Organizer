const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5001;
const DATA_FILE = './backend/data/snippets.json';

app.use(cors());
app.use(express.json());

// Load snippets
app.get('/snippets', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) return res.status(500).json({ error: 'Error reading file' });
        res.json(JSON.parse(data));
    });
});

// Save snippet
app.post('/snippets', (req, res) => {
    const newSnippet = req.body;
    fs.readFile(DATA_FILE, (err, data) => {
        let snippets = err ? [] : JSON.parse(data);
        snippets.push(newSnippet);
        fs.writeFile(DATA_FILE, JSON.stringify(snippets, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Error saving snippet' });
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));