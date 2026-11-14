const db = require('./db');

async function testDB() {
    try{
        const [rows] = await db.query('SELECT 1');
        console.log("MySQL connection successful");
        console.log(rows);
    } catch (error) {
        console.error('DB connection error:', error.message);
    } finally {
        await db.end();
    }
}

testDB();  