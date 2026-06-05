const router = require('express').Router();
const SocialLinks = require('../models/SocialLinks');
const auth = require('../middleware/auth');

const getOrCreate = async () => {
  let doc = await SocialLinks.findOne();
  if (!doc) doc = await SocialLinks.create({});
  return doc;
};

// Public: get links
router.get('/', async (req, res) => {
  try { res.json(await getOrCreate()); }
  catch (e) { res.status(500).json({ message: e.message }); }
});

// Admin: update links
router.put('/', auth, async (req, res) => {
  try {
    const doc = await getOrCreate();
    const { facebook, instagram, tiktok, whatsapp, snapchat } = req.body;
    if (facebook !== undefined) doc.facebook = facebook;
    if (instagram !== undefined) doc.instagram = instagram;
    if (tiktok !== undefined) doc.tiktok = tiktok;
    if (whatsapp !== undefined) doc.whatsapp = whatsapp;
    if (snapchat !== undefined) doc.snapchat = snapchat;
    await doc.save();
    res.json(doc);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
