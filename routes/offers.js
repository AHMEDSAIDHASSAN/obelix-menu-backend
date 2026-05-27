const router = require('express').Router();
const Offer = require('../models/Offer');
const auth = require('../middleware/auth');
const { makeUpload } = require('../lib/cloudinary');

const upload = makeUpload('offers');

router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort('order');
    res.json(offers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const offers = await Offer.find().sort('order');
    res.json(offers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const offer = await Offer.create(data);
    res.status(201).json(offer);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.path;
    const offer = await Offer.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(offer);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
