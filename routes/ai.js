const router = require('express').Router();
const multer = require('multer');
const axios = require('axios');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/scan-menu', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const base64 = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;

    const prompt = `You are a menu parser. Extract ALL menu items from this menu image.

This menu has one or more category sections. Each section has a large bold title (like MOJITO, SMOOTHIE, ICE TEA, MATCHA, COFFEE, FRAPPE, MILK SHAKE, HOT DRINK, DESSERT, CROISSANT, etc.) followed by product names and prices.

Return ONLY a valid JSON array with no extra text, no markdown, no code blocks. Just the raw JSON array.

Each item must have:
- "categoryName": the category section title this item belongs to (large heading above it, in English as written on the menu)
- "name": product name as shown on the menu
- "nameAr": Arabic name if visible, otherwise translate to Arabic
- "price": price as a number (e.g. 35)
- "description": short description if visible, otherwise empty string
- "sizes": array [{name, nameAr, price}] if multiple sizes exist, otherwise empty array

If the page has multiple category sections, assign each item to its correct category.

Example:
[{"categoryName":"MOJITO","name":"Classic Mojito","nameAr":"موهيتو كلاسيك","price":35,"description":"","sizes":[]},{"categoryName":"SMOOTHIE","name":"Mango Smoothie","nameAr":"سموذي مانجو","price":45,"description":"","sizes":[]}]

Extract every single item. Be thorough.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } },
          ],
        }],
        max_tokens: 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const text = response.data.choices[0].message.content.trim();
    let items;
    try {
      items = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) items = JSON.parse(match[0]);
      else return res.status(422).json({ message: 'Could not parse menu', raw: text });
    }

    res.json({ items });
  } catch (e) {
    const msg = e.response?.data?.error?.message || e.message;
    console.error('AI scan error:', msg);
    res.status(500).json({ message: msg });
  }
});

module.exports = router;
