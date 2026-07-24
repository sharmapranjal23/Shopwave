const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
const PORT = 5001;
const JWT_SECRET = 'shopwave_secret_2024';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// DB Setup
const db = new Database(path.join(__dirname, 'shopwave.db'));
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    avatar TEXT DEFAULT '',
    google_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT '',
    image TEXT DEFAULT '',
    description TEXT DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT DEFAULT '',
    price REAL NOT NULL,
    original_price REAL DEFAULT 0,
    category_id TEXT,
    images TEXT DEFAULT '[]',
    stock INTEGER DEFAULT 100,
    rating REAL DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 0,
    tags TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    trending INTEGER DEFAULT 0,
    badge TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );
  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS wishlist (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, product_id)
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    address TEXT DEFAULT '',
    payment_method TEXT DEFAULT 'card',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS otps (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ── PRODUCT IMAGE MAP (Stable Unsplash photo IDs) ───────────────────────
const PRODUCT_IMAGES = {
    'probook-laptop-x1': ['1496181133206-80ce9b88a853', '1588702547919-df8e3e65ee76'],
    'quantumbuds-pro': ['1505751172876-fa1923c5c528', '1590658268037-d1246d4ce44a'],
    'ultrawatch-s5': ['1523275335684-37898b6baf30', '1434494878577-86c23bcb06b9'],
    '4k-gaming-monitor': ['1527443224154-c4a573d5f5ef', '1616763355548-1eda929a7814'],
    'designer-silk-kurta': ['1595777216528-3d24a07a6ba0', '1610030469983-98e550d6193c'],
    'leather-sneakers-air': ['1542291026-7eec264c27ff', '1608231387042-66d1773070a5'],
    'executive-laptop-bag': ['1548036328-c9fa89d128fa', '1553062407-98eeb64c6a62'],
    'nordic-wooden-desk': ['1524758631624-e2822132143c', '1518455027359-f3f8164ba6bd'],
    'smart-led-strip-5m': ['1558618666-fcd25c85cd64', '1601944179066-29786cb9d32a'],
    'pro-yoga-mat': ['1544367567-0f2fcb009e0b', '1575052814086-f385e2e2ad1b'],
    'hydro-smart-bottle': ['1602143407151-7111542de6e8', '1561421608-1ea53b4c8019'],
    'glow-serum-vitamin-c': ['1556228578-8c89e6adf883', '1571781926291-c21fc3d36aad'],
    'luxury-perfume-bloom': ['1541643600914-78b084683702', '1590736969596-b8a5a41d37e7'],
    'atomic-habits-book': ['1544947950-fa07a98d237f', '1512820790803-83ca734da794'],
    'deep-work-book': ['1507003211169-0a1dd7228f2d', '1481627834876-b7833e8f5570'],
};

const getImgUrl = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop&auto=format&q=80`;

// ── SEED DATA ──────────────────────────────────────────────────────────
const catCount = db.prepare('SELECT COUNT(*) as c FROM categories').get();
if (catCount.c === 0) {
    const cats = [
        { id: uuidv4(), name: 'Electronics', slug: 'electronics', icon: '💻', description: 'Gadgets & devices' },
        { id: uuidv4(), name: 'Fashion', slug: 'fashion', icon: '👗', description: 'Clothing & accessories' },
        { id: uuidv4(), name: 'Home & Living', slug: 'home-living', icon: '🏠', description: 'Furniture & decor' },
        { id: uuidv4(), name: 'Sports', slug: 'sports', icon: '⚽', description: 'Sports & fitness' },
        { id: uuidv4(), name: 'Beauty', slug: 'beauty', icon: '💄', description: 'Skincare & makeup' },
        { id: uuidv4(), name: 'Books', slug: 'books', icon: '📚', description: 'Books & stationery' },
    ];
    const insertCat = db.prepare('INSERT INTO categories (id, name, slug, icon, description) VALUES (?, ?, ?, ?, ?)');
    cats.forEach(c => insertCat.run(c.id, c.name, c.slug, c.icon, c.description));

    const insertProd = db.prepare(`INSERT INTO products (id, name, slug, description, price, original_price, category_id, images, stock, rating, reviews_count, tags, featured, trending, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const [elecCat, fashCat, homeCat, sportCat, beautyCat, bookCat] = cats.map(c => c.id);

    const products = [
        { name: 'ProBook Laptop X1', slug: 'probook-laptop-x1', desc: 'Ultra-thin 14" laptop with Intel Core i7, 16GB RAM, 512GB SSD. Perfect for professionals and creatives.', price: 89999, orig: 109999, cat: elecCat, rating: 4.8, reviews: 1240, featured: 1, trending: 1, badge: 'Best Seller', tags: '["laptop","pro"]' },
        { name: 'QuantumBuds Pro', slug: 'quantumbuds-pro', desc: 'True wireless earbuds with 40hr battery, active noise cancellation, and Hi-Fi audio quality.', price: 7499, orig: 12999, cat: elecCat, rating: 4.7, reviews: 890, featured: 1, trending: 0, badge: '42% OFF', tags: '["earbuds","wireless"]' },
        { name: 'UltraWatch S5', slug: 'ultrawatch-s5', desc: 'Smartwatch with AMOLED display, health monitoring, GPS, and 7-day battery life.', price: 24999, orig: 34999, cat: elecCat, rating: 4.6, reviews: 654, featured: 0, trending: 1, badge: 'New', tags: '["smartwatch","fitness"]' },
        { name: '4K Gaming Monitor', slug: '4k-gaming-monitor', desc: '27" 4K IPS monitor with 144Hz refresh rate, 1ms response time, HDR600 support.', price: 42999, orig: 55000, cat: elecCat, rating: 4.9, reviews: 320, featured: 1, trending: 0, badge: 'Top Rated', tags: '["monitor","gaming","4k"]' },
        { name: 'Designer Silk Kurta', slug: 'designer-silk-kurta', desc: 'Handcrafted silk kurta with intricate embroidery. Perfect for festive occasions.', price: 3499, orig: 5999, cat: fashCat, rating: 4.5, reviews: 456, featured: 0, trending: 1, badge: '', tags: '["kurta","ethnic","silk"]' },
        { name: 'Leather Sneakers Air', slug: 'leather-sneakers-air', desc: 'Premium leather sneakers with air cushion sole. Available in 10 colors.', price: 5999, orig: 8999, cat: fashCat, rating: 4.4, reviews: 789, featured: 1, trending: 1, badge: 'Trending', tags: '["shoes","sneakers"]' },
        { name: 'Executive Laptop Bag', slug: 'executive-laptop-bag', desc: 'Water-resistant 15.6" laptop bag with multiple compartments and USB charging port.', price: 2499, orig: 3999, cat: fashCat, rating: 4.6, reviews: 234, featured: 0, trending: 0, badge: '', tags: '["bag","laptop","office"]' },
        { name: 'Nordic Wooden Desk', slug: 'nordic-wooden-desk', desc: 'Minimalist oak wood desk with cable management, built-in drawers, 140x70cm.', price: 18999, orig: 26000, cat: homeCat, rating: 4.7, reviews: 167, featured: 1, trending: 0, badge: 'Sale', tags: '["desk","wood","furniture"]' },
        { name: 'Smart LED Strip 5m', slug: 'smart-led-strip-5m', desc: 'RGB LED strip with app control, music sync, and 16M colors. Works with Alexa & Google.', price: 1499, orig: 2499, cat: homeCat, rating: 4.3, reviews: 1100, featured: 0, trending: 1, badge: '', tags: '["led","smart","lighting"]' },
        { name: 'Pro Yoga Mat', slug: 'pro-yoga-mat', desc: 'Extra thick 6mm anti-slip yoga mat with alignment lines and carrying strap.', price: 1299, orig: 2000, cat: sportCat, rating: 4.5, reviews: 890, featured: 0, trending: 0, badge: '', tags: '["yoga","fitness","mat"]' },
        { name: 'Hydro Smart Bottle', slug: 'hydro-smart-bottle', desc: 'Temperature-retaining smart bottle with hydration reminders and LED display. 750ml.', price: 2199, orig: 3500, cat: sportCat, rating: 4.8, reviews: 445, featured: 1, trending: 1, badge: 'New', tags: '["bottle","hydration","smart"]' },
        { name: 'Glow Serum Vitamin C', slug: 'glow-serum-vitamin-c', desc: '20% Vitamin C serum with hyaluronic acid & niacinamide. Brightens and firms skin.', price: 899, orig: 1500, cat: beautyCat, rating: 4.6, reviews: 2100, featured: 1, trending: 1, badge: 'Best Seller', tags: '["serum","vitamin-c","skincare"]' },
        { name: 'Luxury Perfume Bloom', slug: 'luxury-perfume-bloom', desc: 'Oriental floral fragrance with notes of rose, jasmine, and sandalwood. 100ml EDP.', price: 4499, orig: 6000, cat: beautyCat, rating: 4.7, reviews: 345, featured: 0, trending: 0, badge: '', tags: '["perfume","fragrance","luxury"]' },
        { name: 'Atomic Habits', slug: 'atomic-habits-book', desc: 'The #1 New York Times bestseller on building good habits and breaking bad ones by James Clear.', price: 399, orig: 599, cat: bookCat, rating: 4.9, reviews: 5600, featured: 1, trending: 1, badge: 'Bestseller', tags: '["book","habits","self-help"]' },
        { name: 'Deep Work', slug: 'deep-work-book', desc: 'Cal Newport\'s guide to focused success in a distracted world. Essential reading.', price: 349, orig: 499, cat: bookCat, rating: 4.8, reviews: 3200, featured: 0, trending: 0, badge: '', tags: '["book","productivity","focus"]' },
    ];

    products.forEach(p => {
        const imgs = (PRODUCT_IMAGES[p.slug] || []).map(getImgUrl);
        insertProd.run(uuidv4(), p.name, p.slug, p.desc, p.price, p.orig, p.cat,
            JSON.stringify(imgs), 100, p.rating, p.reviews, p.tags || '[]', p.featured, p.trending || 0, p.badge || '');
    });

    // Admin user
    const hashed = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), 'Admin', 'admin@shopwave.com', hashed, 'admin');
    console.log('✅ Database seeded with', products.length, 'products and images!');
}

app.use(cors());
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try { req.user = jwt.verify(token, JWT_SECRET); next(); }
    catch { res.status(401).json({ error: 'Invalid token' }); }
};

const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
        next();
    });
};

// ── AUTH: Standard ─────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const hashed = bcrypt.hashSync(password, 10);
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)').run(id, name, email, hashed);
    const token = jwt.sign({ id, email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email, role: 'user' } });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !user.password || !bcrypt.compareSync(password, user.password))
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', auth, (req, res) => {
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
});

// ── AUTH: Google OAuth ─────────────────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
    const { credential, demo } = req.body;

    // DEMO MODE: If no real Google Client ID is configured
    if (demo || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        const demoUser = {
            google_id: 'demo_google_123',
            name: 'Google User (Demo)',
            email: 'google.demo@gmail.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        };
        let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(demoUser.google_id, demoUser.email);
        if (!user) {
            const id = uuidv4();
            db.prepare('INSERT INTO users (id, name, email, google_id, avatar) VALUES (?, ?, ?, ?, ?)').run(id, demoUser.name, demoUser.email, demoUser.google_id, demoUser.avatar);
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    }

    // REAL Google verification
    try {
        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const { sub: google_id, name, email, picture: avatar } = payload;

        let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(google_id, email);
        if (!user) {
            const id = uuidv4();
            db.prepare('INSERT INTO users (id, name, email, google_id, avatar) VALUES (?, ?, ?, ?, ?)').run(id, name, email, google_id, avatar);
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        } else if (!user.google_id) {
            db.prepare('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?').run(google_id, avatar, user.id);
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
    } catch (err) {
        console.error('Google auth error:', err.message);
        res.status(401).json({ error: 'Google authentication failed' });
    }
});

// ── AUTH: Phone OTP ────────────────────────────────────────────────────
app.post('/api/auth/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) return res.status(400).json({ error: 'Valid phone number required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Invalidate old OTPs for this phone
    db.prepare('UPDATE otps SET used = 1 WHERE phone = ?').run(phone);
    // Store new OTP
    db.prepare('INSERT INTO otps (id, phone, otp, expires_at) VALUES (?, ?, ?, ?)').run(uuidv4(), phone, otp, expires_at);

    console.log(`📱 OTP for ${phone}: ${otp}`); // In real app, send SMS via Twilio/MSG91

    // In demo mode: return OTP in response so user can test
    res.json({
        success: true,
        message: `OTP sent to ${phone}`,
        demo_otp: otp, // Remove this in production!
    });
});

app.post('/api/auth/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });

    const record = db.prepare('SELECT * FROM otps WHERE phone = ? AND otp = ? AND used = 0 ORDER BY created_at DESC LIMIT 1').get(phone, otp);
    if (!record) return res.status(400).json({ error: 'Invalid OTP' });
    if (new Date(record.expires_at) < new Date()) return res.status(400).json({ error: 'OTP expired. Please resend.' });

    // Mark OTP as used
    db.prepare('UPDATE otps SET used = 1 WHERE id = ?').run(record.id);

    // Find or create user
    let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    if (!user) {
        const id = uuidv4();
        const name = `User ${phone.slice(-4)}`;
        db.prepare('INSERT INTO users (id, name, phone) VALUES (?, ?, ?)').run(id, name, phone);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    const token = jwt.sign({ id: user.id, email: user.email || '', role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
});

// ── CATEGORIES ────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
    res.json(db.prepare('SELECT * FROM categories').all());
});

// ── PRODUCTS ──────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
    const { category, search, sort, featured, trending, limit, page } = req.query;
    let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    if (category) { query += ' AND c.slug = ?'; params.push(category); }
    if (search) { query += ' AND (p.name LIKE ? OR p.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    if (featured === '1') query += ' AND p.featured = 1';
    if (trending === '1') query += ' AND p.trending = 1';
    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'rating') query += ' ORDER BY p.rating DESC';
    else if (sort === 'newest') query += ' ORDER BY p.created_at DESC';
    else query += ' ORDER BY p.featured DESC, p.rating DESC';

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;
    const countQuery = query.replace('SELECT p.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params);
    query += ` LIMIT ${limitNum} OFFSET ${offset}`;
    const products = db.prepare(query).all(...params).map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
    res.json({ products, total: total?.total || 0, page: pageNum, pages: Math.ceil((total?.total || 0) / limitNum) });
});

app.get('/api/products/:slug', (req, res) => {
    const product = db.prepare('SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?').get(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const reviews = db.prepare('SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC LIMIT 10').all(product.id);
    res.json({ ...product, images: JSON.parse(product.images || '[]'), reviews });
});

// ── CART ──────────────────────────────────────────────────────────────
app.get('/api/cart', auth, (req, res) => {
    const items = db.prepare(`SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.original_price, p.images, p.slug, p.stock FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?`).all(req.user.id);
    res.json(items.map(i => ({ ...i, images: JSON.parse(i.images || '[]') })));
});

app.post('/api/cart', auth, (req, res) => {
    const { product_id, quantity = 1 } = req.body;
    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
    if (existing) db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
    else db.prepare('INSERT INTO cart_items (id, user_id, product_id, quantity) VALUES (?, ?, ?, ?)').run(uuidv4(), req.user.id, product_id, quantity);
    res.json({ success: true });
});

app.put('/api/cart/:id', auth, (req, res) => {
    const { quantity } = req.body;
    if (quantity <= 0) db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    else db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, req.params.id, req.user.id);
    res.json({ success: true });
});

app.delete('/api/cart/:id', auth, (req, res) => {
    db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
});

app.delete('/api/cart', auth, (req, res) => {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true });
});

// ── WISHLIST ──────────────────────────────────────────────────────────
app.get('/api/wishlist', auth, (req, res) => {
    const items = db.prepare(`SELECT w.id, p.id as product_id, p.name, p.price, p.original_price, p.images, p.slug, p.rating, p.badge FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?`).all(req.user.id);
    res.json(items.map(i => ({ ...i, images: JSON.parse(i.images || '[]') })));
});

app.post('/api/wishlist', auth, (req, res) => {
    const { product_id } = req.body;
    const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
    if (existing) { db.prepare('DELETE FROM wishlist WHERE id = ?').run(existing.id); res.json({ added: false }); }
    else { db.prepare('INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)').run(uuidv4(), req.user.id, product_id); res.json({ added: true }); }
});

// ── ORDERS ────────────────────────────────────────────────────────────
app.get('/api/orders', auth, (req, res) => {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

app.post('/api/orders', auth, (req, res) => {
    const { items, total, address, payment_method } = req.body;
    const id = uuidv4();
    db.prepare('INSERT INTO orders (id, user_id, items, total, address, payment_method) VALUES (?, ?, ?, ?, ?, ?)').run(id, req.user.id, JSON.stringify(items), total, address, payment_method || 'card');
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true, order_id: id });
});

// ── REVIEWS ───────────────────────────────────────────────────────────
app.post('/api/reviews', auth, (req, res) => {
    const { product_id, rating, comment } = req.body;
    db.prepare('INSERT INTO reviews (id, product_id, user_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), product_id, req.user.id, rating, comment);
    const avg = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE product_id = ?').get(product_id);
    db.prepare('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?').run(parseFloat(avg.avg.toFixed(1)), avg.cnt, product_id);
    res.json({ success: true });
});

// ── SEARCH ────────────────────────────────────────────────────────────
app.get('/api/search/suggestions', (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const results = db.prepare('SELECT name, slug, images FROM products WHERE name LIKE ? LIMIT 6').all(`%${q}%`);
    res.json(results.map(r => ({ ...r, images: JSON.parse(r.images || '[]') })));
});

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────
app.get('/api/admin/stats', adminAuth, (req, res) => {
    const revenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders').get().total;
    const orders = db.prepare('SELECT COUNT(*) as total FROM orders').get().total;
    const users = db.prepare('SELECT COUNT(*) as total FROM users WHERE role <> ?').get('admin').total;
    const products = db.prepare('SELECT COUNT(*) as total FROM products').get().total;
    const pendingOrders = db.prepare("SELECT COUNT(*) as total FROM orders WHERE status = 'pending'").get().total;
    const deliveredOrders = db.prepare("SELECT COUNT(*) as total FROM orders WHERE status = 'delivered'").get().total;
    const averageOrderValue = orders > 0 ? revenue / orders : 0;
    const growthPercent = 18;
    const conversionRate = 4.9;

    res.json({
        revenue,
        orders,
        users,
        products,
        pendingOrders,
        deliveredOrders,
        averageOrderValue,
        growthPercent,
        conversionRate,
    });
});

app.get('/api/admin/orders', adminAuth, (req, res) => {
    const rows = db.prepare(`
        SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 10
    `).all();
    res.json(rows);
});

app.get('/api/admin/users', adminAuth, (req, res) => {
    const rows = db.prepare(`
        SELECT id, name, email, role, created_at
        FROM users
        WHERE role <> 'admin'
        ORDER BY created_at DESC
        LIMIT 10
    `).all();
    res.json(rows);
});

app.listen(PORT, () => console.log(`🚀 ShopWave API running on http://localhost:${PORT}`));
