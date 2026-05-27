const router = require('express').Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { makeUpload } = require('../lib/cloudinary');

const upload = makeUpload('categories');

// Public
router.get('/', async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort('order');
    res.json(cats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const cats = await Category.find().sort('order');
    res.json(cats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Admin
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const cat = await Category.create(data);
    res.status(201).json(cat);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const cat = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(cat);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
