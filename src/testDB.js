// Test database connection script
const db = require('./db');

// Function to test the database connection
async function testDB() {
    // Attempt to query the database to check the connection
    try{
        const [rows] = await db.query('SELECT 1');
        console.log("MySQL connection successful");
        console.log(rows);
    } catch (error) {
        // Log any errors that occur during the database query
        console.error('DB connection error:', error.message);
    } finally {
        // Close the database connection
        await db.end();
    }
}

// Call the testDB function to check the database connection
testDB();  