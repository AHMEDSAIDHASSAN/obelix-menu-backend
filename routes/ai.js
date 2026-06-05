const router = require('express').Router();
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/scan-menu', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const base64 = req.file.buffer.toString('base64');
    const mediaType = req.file.mimetype;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `You are a menu parser. Extract ALL menu items from this menu image.

Return ONLY a valid JSON array with no extra text, no markdown, no code blocks. Just the raw JSON array.

Each item must have:
- "name": product name in original language
- "nameAr": Arabic name if visible, otherwise translate to Arabic
- "price": base price as number (use 0 if only sizes exist)
- "description": short description if visible, otherwise empty string
- "sizes": array of size objects [{name, nameAr, price}] if the item has multiple sizes/options with different prices, otherwise empty array

Example output:
[{"name":"Margherita Pizza","nameAr":"بيتزا مارجريتا","price":25,"description":"Classic tomato and mozzarella","sizes":[]},{"name":"Grilled Chicken","nameAr":"دجاج مشوي","price":0,"description":"","sizes":[{"name":"Half","nameAr":"نصف","price":35},{"name":"Full","nameAr":"كامل","price":60}]}]

Extract every single item you can find. Be thorough.`,
          },
        ],
      }],
    });

    const text = response.content[0].text.trim();
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
    console.error('AI scan error:', e.message);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
