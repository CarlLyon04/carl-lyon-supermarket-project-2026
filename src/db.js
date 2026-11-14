// require and configure environment variables from .env file
require('dotenv').config();

// MySQL database connection using mysql2/promise
const mysql = require("mysql2/promise");

// Create a connection pool to the MySQL database using environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export the database connection pool for use in other modules
module.exports = db;