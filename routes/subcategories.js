const router = require('express').Router();
const SubCategory = require('../models/SubCategory');
const auth = require('../middleware/auth');
const { memUpload, uploadToCloudinary } = require('../lib/cloudinary');

router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.categoryId) filter.category = req.query.categoryId;
    res.json(await SubCategory.find(filter).populate('category', 'name nameAr').sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    res.json(await SubCategory.find().populate('category', 'name nameAr').sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'subcategories');
    res.status(201).json(await SubCategory.create(data));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'subcategories');
    res.json(await SubCategory.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
