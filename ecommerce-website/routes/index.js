const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Trang danh sách sản phẩm
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.render('products', { products, cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Trang chi tiết sản phẩm
router.get('/product/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render('productDetail', { product, cartCount: req.session.cart ? req.session.cart.length : 0 });
});

// Trang giỏ hàng
router.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('cart', { cart, cartCount: cart.length });
});

// Thêm vào giỏ hàng
router.post('/cart/add/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!req.session.cart) req.session.cart = [];
    const existingItem = req.session.cart.find(item => item._id == req.params.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      product.quantity = 1;
      req.session.cart.push(product);
    }
    res.redirect('/');
  });
  
  // Cập nhật giỏ hàng
  router.post('/cart/update', (req, res) => {
    const quantities = req.body.quantities;
    if (req.session.cart) {
      req.session.cart.forEach((item, index) => {
        item.quantity = parseInt(quantities[index]) || 1;
      });
    }
    res.redirect('/cart');
  });

// Xóa khỏi giỏ hàng
router.post('/cart/remove/:id', (req, res) => {
  const productId = req.params.id;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item._id != productId);
  }
  res.redirect('/cart');
});

// API: Lấy danh sách sản phẩm
router.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// API: Tạo sản phẩm
router.post('/api/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// API: Sửa sản phẩm
router.put('/api/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// API: Xóa sản phẩm
router.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

router.get('/search', async (req, res) => {
    const query = req.query.q;
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });
    res.render('products', { products, cartCount: req.session.cart ? req.session.cart.length : 0 });
  });


//Thanh toán
router.get('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    res.render('checkout', { total, cartCount: cart.length });
  });
  
  router.post('/checkout', (req, res) => {
    req.session.cart = []; // Xóa giỏ hàng sau khi thanh toán
    res.send('Thanh toán thành công! <a href="/">Quay lại trang chủ</a>');
  });
module.exports = router; // Quan trọng: Export router