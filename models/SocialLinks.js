const mongoose = require('mongoose');

const socialLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  snapchat: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SocialLinks', socialLinksSchema);
