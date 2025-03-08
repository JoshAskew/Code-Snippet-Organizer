const express = require('express');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch'); // Importing node-fetch for use in Node.js
const app = express();
const PORT = 5001;
const DATA_FILE = './backend/data/snippets.json';

// Load environment variables (if you're using them for JDoodle credentials)
require('dotenv').config();

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

// Proxy route to forward the code execution request to JDoodle API
app.post('/api/v1/execute', async (req, res) => {
    const { language, code } = req.body;  // Get language and code from the request body

    const requestData = {
        clientId: process.env.JDoodle_CLIENT_ID,  // Get client ID from environment variables
        clientSecret: process.env.JDoodle_CLIENT_SECRET,  // Get client secret from environment variables
        script: code,
        language: language,
        stdin: "",
        versionIndex: "4",  // You can change this to the version index for your language
    };

    try {
        // Make the request to JDoodle API
        const response = await fetch('https://api.jdoodle.com/v1/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        // If JDoodle API returns an error, throw it
        if (!response.ok) {
            throw new Error(`JDoodle API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.json(data);  // Send the response from JDoodle API back to the frontend
    } catch (error) {
        console.error(error);  // Log the error
        res.status(500).json({ error: 'Failed to execute code' });  // Send an error response if anything goes wrong
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
