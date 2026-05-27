const router = require('express').Router();
const SubSubCategory = require('../models/SubSubCategory');
const auth = require('../middleware/auth');

// Public: get by subCategoryId
router.get('/', async (req, res) => {
  try {
    const { subCategoryId } = req.query;
    const filter = { isActive: true };
    if (subCategoryId) filter.subCategory = subCategoryId;
    const items = await SubSubCategory.find(filter)
      .populate('subCategory', 'name nameAr')
      .sort('order');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const items = await SubSubCategory.find()
      .populate('subCategory', 'name nameAr')
      .sort('order');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const item = await SubSubCategory.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await SubSubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await SubSubCategory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
