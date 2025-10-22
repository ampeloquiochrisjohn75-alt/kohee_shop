const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});



const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

async function getDb() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'kohee_shop'
  });
  return conn;
}

// Auth: signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = await getDb();
    const [rows] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(400).json({ message: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name || null, email, hash]);
    const userId = result.insertId;
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth: login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = await getDb();
    const [rows] = await db.execute('SELECT id, password_hash FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware: auth
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Products: coffee and pastries
app.get('/api/products', async (req, res) => {
  // optional query ?type=coffee|pastry
  const type = req.query.type;
  try {
    const db = await getDb();
    let q = 'SELECT id, name, description, price, type, image FROM products';
    const params = [];
    if (type) { q += ' WHERE type = ?'; params.push(type); }
    const [rows] = await db.execute(q, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cart: store per-user cart in DB
app.get('/api/cart', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.execute(
      `SELECT c.id, p.id as productId, p.name, p.price, c.quantity, p.image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/cart', authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) return res.status(400).json({ message: 'Missing fields' });
  try {
    const db = await getDb();
    // upsert
    await db.execute(
      `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, productId, quantity]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cart/:productId', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    await db.execute('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Feedback
app.post('/api/feedback', authMiddleware, async (req, res) => {
  const { message, rating } = req.body;
  if (!message) return res.status(400).json({ message: 'Missing message' });
  try {
    const db = await getDb();
    await db.execute('INSERT INTO feedback (user_id, message, rating) VALUES (?, ?, ?)', [req.user.id, message, rating || null]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const db = await getDb();
    const [rows] = await db.execute('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// Serve React build and enable client-side routing (SPA)
const path = require('path');
const buildPath = path.join(__dirname, '..', 'frontend', 'build');

// Serve static files from the React app build
app.use(express.static(buildPath));

// For any non-API request, send back React's index.html so the client-side router can handle the route
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next(); // skip API routes
  res.sendFile(path.join(buildPath, 'index.html'));
});

