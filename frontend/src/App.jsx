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

  const cardStyle = {
    backgroundColor: '#ffffff',
    color: '#2d3748',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputStyle = {
    margin: '8px 0',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '80%',
  };

  const buttonStyle = {
    marginTop: '8px',
    padding: '8px 12px',
    borderRadius: '4px',
    backgroundColor: '#5a67d8',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    width: '80%',
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f0f4f8',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: '1500px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0', color: '#2d3748' }}>📘 Tally Note Green</h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
            Track who spent what and how much — easily.
          </p>
        </div>

        {/* Grid layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, auto)',
          gap: '20px',
        }}>
          {/* Add Person */}
          <div style={cardStyle}>
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
          <div style={cardStyle}>
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
          <div style={cardStyle}>
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

          {/* People */}
          <div style={cardStyle}>
            <h3>👥 People</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {users.map(u => (
                <li key={u.id}>{u.name}</li>
              ))}
            </ul>
          </div>

          {/* Costs */}
          <div style={cardStyle}>
            <h3>💸 Costs</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {products.map(p => (
                <li key={p.id}>{p.name} — ${p.price}</li>
              ))}
            </ul>
          </div>

          {/* Transactions */}
          <div style={cardStyle}>
            <h3>📒 Transactions</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {orders.map(o => (
                <li key={o.id}>{o.username} spent on {o.productname}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;






