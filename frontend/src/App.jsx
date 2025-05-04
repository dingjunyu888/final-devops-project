import { useState, useEffect } from 'react';
import axios from 'axios';

const USER_SERVICE_URL = import.meta.env.VITE_USER_SERVICE;
const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE;
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE;

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
    const [u, p, o] = await Promise.all([
      axios.get(USER_SERVICE_URL),
      axios.get(PRODUCT_SERVICE_URL),
      axios.get(ORDER_SERVICE_URL),
    ]);
    setUsers(u.data);
    setProducts(p.data);
    setOrders(o.data);
  };

  const addUser = async () => {
    if (!username.trim()) return;
    await axios.post(USER_SERVICE_URL, { name: username });
    setUsername('');
    fetchAll();
  };

  const addProduct = async () => {
    if (!productName.trim() || !productPrice.trim()) return;
    await axios.post(PRODUCT_SERVICE_URL, {
      name: productName,
      price: parseInt(productPrice)
    });
    setProductName('');
    setProductPrice('');
    fetchAll();
  };

  const placeOrder = async () => {
    if (!orderUser.trim() || !orderProduct.trim()) return;
    await axios.post(ORDER_SERVICE_URL, {
      userName: orderUser,
      productName: orderProduct
    });
    setOrderUser('');
    setOrderProduct('');
    fetchAll();
  };

  useEffect(() => { fetchAll(); }, []);

  const sectionStyle = {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  };

  const inputStyle = {
    marginRight: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    backgroundColor: '#5a67d8',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2d3748' }}>📘 Tally Note</h1>
      <p style={{ textAlign: 'center', color: '#4a5568' }}>
        Track who spent what and how much — easily.
      </p>

      {/* Add People */}
      <div style={sectionStyle}>
        <h2>Add a Person</h2>
        <input
          placeholder="Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addUser} style={buttonStyle}>Add Person</button>
      </div>

      {/* Add Cost */}
      <div style={sectionStyle}>
        <h2>Add a Cost</h2>
        <input
          placeholder="Item"
          value={productName}
          onChange={e => setProductName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Price"
          type="number"
          value={productPrice}
          onChange={e => setProductPrice(e.target.value)}
          style={inputStyle}
        />
        <button onClick={addProduct} style={buttonStyle}>Add Cost</button>
      </div>

      {/* Add Transaction */}
      <div style={sectionStyle}>
        <h2>Add a Transaction</h2>
        <input
          placeholder="Person"
          value={orderUser}
          onChange={e => setOrderUser(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Item"
          value={orderProduct}
          onChange={e => setOrderProduct(e.target.value)}
          style={inputStyle}
        />
        <button onClick={placeOrder} style={buttonStyle}>Record Spend</button>
      </div>

      {/* Lists */}
      <div style={sectionStyle}>
        <h3>👥 People</h3>
        <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
      </div>

      <div style={sectionStyle}>
        <h3>💸 Costs</h3>
        <ul>{products.map(p => <li key={p.id}>{p.name} — ${p.price}</li>)}</ul>
      </div>

      <div style={sectionStyle}>
        <h3>📒 Transactions</h3>
        <ul>{orders.map(o => <li key={o.id}>{o.username} spent on {o.productname}</li>)}</ul>
      </div>
    </div>
  );
}

export default App;




