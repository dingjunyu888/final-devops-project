import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [username, setUsername] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [orderUser, setOrderUser] = useState('');
  const [orderProduct, setOrderProduct] = useState('');

  const fetchAll = async () => {
    const u = await axios.get('http://localhost:3001/users');
    const p = await axios.get('http://localhost:3002/products');
    const o = await axios.get('http://localhost:3003/orders');
    setUsers(u.data);
    setProducts(p.data);
    setOrders(o.data);
  };

  const addUser = async () => {
    if (!username) return;
    await axios.post('http://localhost:3001/users', { name: username });
    setUsername('');
    fetchAll();
  };

  const addProduct = async () => {
    if (!productName || !productPrice) return;
    await axios.post('http://localhost:3002/products', {
      name: productName,
      price: parseInt(productPrice)
    });
    setProductName('');
    setProductPrice('');
    fetchAll();
  };

  const placeOrder = async () => {
    if (!orderUser || !orderProduct) return;
    await axios.post('http://localhost:3003/orders', {
      userName: orderUser,
      productName: orderProduct
    });
    setOrderUser('');
    setOrderProduct('');
    fetchAll();
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Mini DevOps E-Commerce</h1>

      {/* Add User */}
      <div>
        <input
          placeholder="Enter username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <button onClick={addUser}>➕ Add User</button>
      </div>

      {/* Add Product */}
      <div>
        <input
          placeholder="Product name"
          value={productName}
          onChange={e => setProductName(e.target.value)}
        />
        <input
          placeholder="Product price"
          type="number"
          value={productPrice}
          onChange={e => setProductPrice(e.target.value)}
        />
        <button onClick={addProduct}>➕ Add Product</button>
      </div>

      {/* Place Order */}
      <div>
        <input
          placeholder="Username"
          value={orderUser}
          onChange={e => setOrderUser(e.target.value)}
        />
        <input
          placeholder="Product name"
          value={orderProduct}
          onChange={e => setOrderProduct(e.target.value)}
        />
        <button onClick={placeOrder}>🛒 Place Order</button>
      </div>

      <h2>Users</h2>
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>

      <h2>Products</h2>
      <ul>{products.map(p => <li key={p.id}>{p.name} - ${p.price}</li>)}</ul>

      <h2>Orders</h2>
      <ul>{orders.map(o => <li key={o.id}>{o.userName} ordered {o.productName}</li>)}</ul>
    </div>
  );
}

export default App;


