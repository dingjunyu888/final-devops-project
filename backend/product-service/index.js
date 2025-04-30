const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = process.env.DB_PATH || '/app/db/ecommerce.db';
const db = new Database(dbPath);

app.get('/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
    const result = stmt.run(name, price);
    res.status(201).json({ id: result.lastInsertRowid, name, price });
});

app.get('/health', (req, res) => res.send('Product Service OK'));

app.listen(3002, () => console.log('Product service running on port 3002'));
