const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = process.env.DB_PATH || '/app/db/ecommerce.db';
const db = new Database(dbPath);

app.get('/orders', (req, res) => {
    const stmt = db.prepare(`
    SELECT 
      orders.id,
      users.name as userName,
      products.name as productName
    FROM orders
    JOIN users ON orders.user_id = users.id
    JOIN products ON orders.product_id = products.id
  `);
    const orders = stmt.all();
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const { userName, productName } = req.body;
    if (!userName || !productName) {
        return res.status(400).json({ error: 'userName and productName are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE name = ?').get(userName);
    const product = db.prepare('SELECT * FROM products WHERE name = ?').get(productName);

    if (!user || !product) {
        return res.status(404).json({ error: 'User or product not found' });
    }

    const stmt = db.prepare('INSERT INTO orders (user_id, product_id) VALUES (?, ?)');
    const result = stmt.run(user.id, product.id);
    res.status(201).json({ id: result.lastInsertRowid, userName, productName });
});

app.get('/health', (req, res) => res.send('Order Service OK'));

app.listen(3003, () => console.log('Order service running on port 3003'));
