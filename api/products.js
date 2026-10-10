// api/products.js
const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

router.get('/', (req, res) => {
  res.json(products);
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if(!product) return res.status(404).json({error: 'Not found'});
  res.json(product);
});

module.exports = router;
