const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { makeUpload } = require('../lib/cloudinary');

const upload = makeUpload('products');

// Public
router.get('/', async (req, res) => {
  try {
    const { categoryId, subCategoryId, featured, search } = req.query;
    const filter = { isAvailable: true };
    if (categoryId) filter.category = categoryId;
    if (subCategoryId) filter.subCategory = subCategoryId;
    if (featured === 'true') filter.isFeatured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .populate('category', 'name nameAr')
      .populate('subCategory', 'name nameAr')
      .populate('subSubCategory', 'name nameAr')
      .sort('order');
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name nameAr')
      .populate('subCategory', 'name nameAr')
      .populate('subSubCategory', 'name nameAr')
      .sort('order');
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name nameAr')
      .populate('subCategory', 'name nameAr');
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    if (data.sizes && typeof data.sizes === 'string') data.sizes = JSON.parse(data.sizes);
    if (data.tags && typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    if (data.sizes && typeof data.sizes === 'string') data.sizes = JSON.parse(data.sizes);
    if (data.tags && typeof data.tags === 'string') data.tags = JSON.parse(data.tags);
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
