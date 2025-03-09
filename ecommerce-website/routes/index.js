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
  req.session.cart.push(product);
  res.redirect('/');
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

module.exports = router; // Quan trọng: Export router