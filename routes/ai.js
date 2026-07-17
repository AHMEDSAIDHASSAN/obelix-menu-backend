const router = require('express').Router();
const multer = require('multer');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const responseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      categoryName: { type: SchemaType.STRING },
      name: { type: SchemaType.STRING },
      nameAr: { type: SchemaType.STRING },
      price: { type: SchemaType.NUMBER },
      description: { type: SchemaType.STRING },
      sizes: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            nameAr: { type: SchemaType.STRING },
            price: { type: SchemaType.NUMBER },
          },
          required: ['name', 'price'],
        },
      },
    },
    required: ['categoryName', 'name', 'price'],
  },
};

const prompt = `You are a menu parser. Extract ALL menu items from this menu image.

This menu has one or more category sections. Each section has a large bold title (like MOJITO, SMOOTHIE, ICE TEA, MATCHA, COFFEE, FRAPPE, MILK SHAKE, HOT DRINK, DESSERT, CROISSANT, etc.) followed by product names and prices.

For each item return:
- "categoryName": the category section title this item belongs to (large heading above it, in English as written on the menu)
- "name": product name exactly as shown on the menu, in English/Latin script. Do not invent, translate, guess, or auto-correct — transcribe exactly what is printed, including spelling.
- "nameAr": Arabic name if visible on the menu, otherwise a reasonable Arabic translation
- "price": price as a number only (no currency symbol), e.g. 35
- "description": short description if visible, otherwise empty string
- "sizes": array of {name, nameAr, price} if multiple sizes/prices exist for one item, otherwise empty array

Read every section of the image carefully, top to bottom, left to right, including small or low-contrast text. Do not skip any item. If the page has multiple category sections or columns, assign each item to its correct category.`;

router.post('/scan-menu', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema,
        maxOutputTokens: 8192,
        temperature: 0,
      },
    });

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType: req.file.mimetype, data: req.file.buffer.toString('base64') } },
    ]);

    const text = result.response.text();
    let items;
    try {
      items = JSON.parse(text);
    } catch {
      return res.status(422).json({ message: 'Could not parse menu', raw: text });
    }

    res.json({ items });
  } catch (e) {
    const msg = e.message || 'AI scan failed';
    console.error('AI scan error:', msg);
    res.status(500).json({ message: msg });
  }
});

module.exports = router;
