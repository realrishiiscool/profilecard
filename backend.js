const multer = require('multer');
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();


// Database connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'photo',
});

app.get('/api/profiles', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, photo FROM profiles');
        const profiles = rows.map(profile => {
            // Convert binary photo to base64 string
            const base64Image = profile.photo.toString('base64');
            return { ...profile, photo: base64Image };
        });
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error.message);
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html');
});



const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image and store in database
app.post('/upload', upload.single('photo'), async (req, res) => {
    try {
        const { name } = req.body;
        const photo = req.file.buffer; // Get binary data from uploaded file

        // Save to database
        await db.query('INSERT INTO profiles (name, photo) VALUES (?, ?)', [name, photo]);
        //res.json({ message: 'Profile uploaded successfully!' });
        console.log('Registration successful!');
        res.redirect('/');
    } catch (error) {
        console.error('Error uploading profile:', error.message);
        res.status(500).json({ error: 'Failed to upload profile' });
    }
});

// Serve labour.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'labour.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
