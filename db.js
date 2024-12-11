const mysql = require('mysql2');
require('dotenv').config();

// Opretter forbindelse til MySQL-databasen
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Test af forbindelsen
connection.connect((err) => {
    if (err) {
        console.error('Fejl ved forbindelse til MySQL:', err.message);
    } else {
        console.log('Forbindelse til MySQL er oprettet!');
    }
});

module.exports = connection;