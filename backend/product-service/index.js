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

//just for test
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error('Error querying products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/products', async (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
            [name, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error inserting product:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/health', (req, res) => res.send('Product Service OK'));

app.listen(3002, () => console.log('Product service running on port 3002'));
