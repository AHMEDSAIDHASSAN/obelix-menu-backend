const router = require('express').Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const { memUpload, uploadToCloudinary } = require('../lib/cloudinary');

router.get('/', async (req, res) => {
  try {
    res.json(await Category.find({ isActive: true }).sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    res.json(await Category.find().sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    res.json(cat);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'categories');
    res.status(201).json(await Category.create(data));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'categories');
    res.json(await Category.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
