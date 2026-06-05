const router = require('express').Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Public: get visible reviews (optionally filter by product)
router.get('/', async (req, res) => {
  try {
    const filter = { isVisible: true };
    if (req.query.productId) filter.product = req.query.productId;
    else filter.product = null;
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Public: submit a review
router.post('/', async (req, res) => {
  try {
    const { name, phone, rating, comment, productId } = req.body;
    const review = await Review.create({
      name, phone, rating, comment,
      product: productId || null,
    });
    res.status(201).json(review);
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Admin: get all reviews
router.get('/admin', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.productId) filter.product = req.query.productId;
    const reviews = await Review.find(filter)
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: toggle visibility
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json(review);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: delete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
