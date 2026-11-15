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
app.use(express.json({ limit: '10mb' }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint to handle product submissions
app.post("/api/submissions", async (req, res) => {
    // Extract market_name from the request body
    const { market_name, items, image, image_type } = req.body;

    // Validate market_name
    if (typeof market_name !== "string" || !market_name.trim() || market_name.trim().length > 150) {
        return res.status(400).json({ error: 'A valid market_name is required' });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
        return res.status(400).json({ error: 'A valid items array is required' });
    }

    // Validate each item in the items array
    for (const item of items) {
        if (!item || typeof item.product_name !== "string" || !item.product_name.trim() || item.product_name.length > 200 || item.price == null || String(item.price).trim() === "" || !Number.isFinite(Number(item.price)) || Number(item.price) < 0 || Number(item.price) > 9999 || Number(Number(item.price).toFixed(2)) !== Number(item.price)) {
            return res.status(400).json({ error: 'Each item must have a valid product_name and price' });
        }
    }

    // Initialize image buffer and MIME type
    let imageBuffer = null
    let dataType = null

    // If an image is provided, validate and process it
    if (image != null) {
        // Validate that image_type is provided and is one of the allowed types
        if (typeof image !== "string" || !["shelf", "product", "receipt"].includes(image_type)) {
            return res.status(400).json({ error: "Invalid image type" });
        }

        // Split the image string into the header and the base64 data
        const imageParts = image.split(',');
    
        // Validate that the image has a proper header and base64 data
        if (imageParts.length !== 2 || !["data:image/png;base64", "data:image/jpeg;base64"].includes(imageParts[0])) {
            return res.status(400).json({ error: "Invalid image format" });
        }

        // Extract the MIME type from the header
        dataType = imageParts[0].split(":")[1].split(";")[0];

        // Convert the base64 image data to a buffer
        imageBuffer = Buffer.from(imageParts[1], 'base64');

        // Validate the image buffer and its size, and ensure it matches the original base64 data
        if (!imageBuffer || imageBuffer.length > 5 * 1024 * 1024 || imageBuffer.toString("base64") !== imageParts[1]) {
            return res.status(400).json({ error: 'Invalid image data' });
        }
    }

    // create a database connection and start a transaction
    let conn;

    try {
        // get a connection from the database pool
        conn = await db.getConnection();

        // start a transaction
        await conn.beginTransaction();

        // insert the market_name into the product_submissions table
        const [result] = await conn.execute(
            "INSERT INTO product_submissions (market_name) VALUES (?)",
            [market_name.trim()]
        );

        // get the ID of the newly inserted submission
        const submission_id = result.insertId;

        // Initialize image_id to null, will be set if an image is inserted into the database
        let image_id = null;

        // Insert the image into the product_images table if it exists
        if (imageBuffer) {
            const [imageResult] = await conn.execute(
                "INSERT INTO product_images (submission_id, image_data, data_type, image_classification) VALUES (?, ?, ?, ?)",
                [submission_id, imageBuffer, dataType, image_type]
            );

            image_id = imageResult.insertId;
        }

        // insert each item into the product_entries table
        for (const item of items) {
            await conn.execute(
                "INSERT INTO product_entries (submission_id, product_name, price, image_id) VALUES (?, ?, ?, ?)",
                [submission_id, item.product_name.trim(), String(item.price), image_id]
            );
        }

        // commit the transaction
        await conn.commit();

        // respond with success message and submission ID
        res.status(201).json({
            message: "Submission created successfully", submission_id: submission_id
        });


    } catch (error) {
        // rollback the transaction if an error occurred
        if (conn) {
            await conn.rollback();
        }

        // log the error and respond with a 500 status code
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the submission' });
    } finally {
        // release the db connection
        if (conn) {
            await conn.release();
        }
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});