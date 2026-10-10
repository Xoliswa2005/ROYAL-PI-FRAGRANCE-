const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use('/api/products', require('./api/products'));
app.use('/api/orders', require('./api/orders'));

app.get('/', (req,res) => res.sendFile(path.join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Royal Pi Fragrance running on http://localhost:${PORT}`));
