const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const SubCategory = require('../models/SubCategory');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `sub_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = { isActive: true };
    if (categoryId) filter.category = categoryId;
    const subs = await SubCategory.find(filter).populate('category', 'name nameAr').sort('order');
    res.json(subs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const subs = await SubCategory.find().populate('category', 'name nameAr').sort('order');
    res.json(subs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const sub = await SubCategory.create(data);
    res.status(201).json(sub);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const sub = await SubCategory.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(sub);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
