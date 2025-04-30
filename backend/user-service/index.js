const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to shared DB
const dbPath = process.env.DB_PATH || '/app/db/ecommerce.db';
const db = new Database(dbPath);

// Get all users
app.get('/users', (req, res) => {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
});

// Add a new user
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
        const result = stmt.run(name);
        res.status(201).json({ id: result.lastInsertRowid, name });
    } catch (e) {
        res.status(400).json({ error: 'User already exists or DB error' });
    }
});

app.get('/health', (req, res) => res.send('User Service OK'));

app.listen(3001, () => console.log('User service running on port 3001'));
