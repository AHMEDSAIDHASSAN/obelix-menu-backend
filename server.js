const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'MISSING',
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY ? 'set' : 'MISSING',
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'MISSING',
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/seed', require('./routes/seed'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/subcategories', require('./routes/subcategories'));
app.use('/api/subsubcategories', require('./routes/subsubcategories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/social', require('./routes/social'));

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/obelix-menu';
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Obelix Menu API running on port ${PORT}`));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
