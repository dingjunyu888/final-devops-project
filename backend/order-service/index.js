const express = require('express');
const app = express();
app.use(express.json());

let orders = [];

app.get('/health', (req, res) => res.send('Order Service OK'));
app.get('/orders', (req, res) => res.json(orders));
app.post('/orders', (req, res) => {
    const { userId, productId } = req.body;
    const newOrder = { id: orders.length + 1, userId, productId };
    orders.push(newOrder);
    res.status(201).json(newOrder);
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
