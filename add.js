const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
    // Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'photo',
});

    try {
        // File path and name
        const filePath = path.resolve('C:\\Files\\anime\\photos\\i7.jpg');
        const name = '1';

        // Read the image file as binary
        const imageBuffer = fs.readFileSync(filePath);

        // Insert the image into the database
        const query = 'INSERT INTO profiles (name, photo) VALUES (?, ?)';
        const [result] = await db.query(query, [name, imageBuffer]);

        console.log(`Image inserted successfully with ID: ${result.insertId}`);
    } catch (error) {
        console.error('Error inserting image:', error.message);
    } finally {
        await db.end();
    }
})();
