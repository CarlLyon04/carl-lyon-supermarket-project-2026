// Express server
const express = require('express');

// Path module for handling file and directory paths
const path = require('path');

// Database module for handling database connections and queries
const db = require('./db');

// Initialize Express application
const app = express();

// Set the port for the server to listen on
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle product submissions
app.post("/api/submissions", async (req, res) => {
    // Extract market_name from the request body
    const { market_name } = req.body;

    // Validate market_name
    if (typeof market_name !== "string" || !market_name.trim() || market_name.trim().length > 150) {
        return res.status(400).json({ error: 'A valid market_name is required' });
    }

    // Try catch block to handle database insertion and potential errors
    try {
        // Insert the market_name into the database
        const [result] = await db.execute(
            "INSERT INTO product_submissions (market_name) VALUES (?)",
            [market_name.trim()]
        );

        // Respond with success message and the ID of the newly created submission
        res.status(201).json({message: "Submission created successfully", submission_id: result.insertId});
    } catch (error) {
        // Log the error and respond with a failure message
        console.error(error);
        res.status(500).json({ error: 'Failed to save submission' });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});