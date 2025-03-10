const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Thiết lập view engine
app.set('view engine', 'ejs');

// Routes
const routes = require('./routes/index'); // Require file routes
app.use('/', routes); // Sử dụng router

const helmet = require('helmet');
app.use(helmet());

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  res.render('products', { products, cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Khởi động server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});