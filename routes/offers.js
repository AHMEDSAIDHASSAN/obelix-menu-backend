const router = require('express').Router();
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');
const { memUpload, uploadToCloudinary } = require('../lib/cloudinary');

router.get('/', async (req, res) => {
  try {
    res.json(await Offer.find({ isActive: true }).sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    res.json(await Offer.find().sort('order'));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'offers');
    res.status(201).json(await Offer.create(data));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, memUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = await uploadToCloudinary(req.file.buffer, 'offers');
    res.json(await Offer.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
