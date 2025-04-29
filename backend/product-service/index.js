const express = require('express');
const app = express();
app.use(express.json());

let products = [
    { id: 1, name: "Laptop", price: 1000 }
];

app.get('/health', (req, res) => res.send('Product Service OK'));
app.get('/products', (req, res) => res.json(products));
app.post('/products', (req, res) => {
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));