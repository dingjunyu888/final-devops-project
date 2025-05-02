const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: 5432,
    user: 'junyu',
    password: process.env.DB_PASSWORD,
    database: 'ecommerce',
    ssl: { rejectUnauthorized: false },
});

app.get('/orders', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT orders.id, users.name AS userName, products.name AS productName
      FROM orders
      JOIN users ON orders.user_id = users.id
      JOIN products ON orders.product_id = products.id
    `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error querying orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/orders', async (req, res) => {
    const { userName, productName } = req.body;
    if (!userName || !productName) {
        return res.status(400).json({ error: 'Username and product name are required' });
    }

    try {
        const userRes = await pool.query('SELECT id FROM users WHERE name = $1', [userName]);
        const productRes = await pool.query('SELECT id FROM products WHERE name = $1', [productName]);

        if (userRes.rowCount === 0 || productRes.rowCount === 0) {
            return res.status(404).json({ error: 'User or product not found' });
        }

        const insertRes = await pool.query(
            'INSERT INTO orders (user_id, product_id) VALUES ($1, $2) RETURNING *',
            [userRes.rows[0].id, productRes.rows[0].id]
        );

        res.status(201).json(insertRes.rows[0]);
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => res.send('Order Service OK'));

app.listen(3003, () => console.log('Order service running on port 3003'));
