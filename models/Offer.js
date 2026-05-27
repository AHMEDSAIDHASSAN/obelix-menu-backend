const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    titleAr: { type: String, trim: true },
    description: { type: String },
    discountPercent: { type: Number, default: 0 },
    image: { type: String },
    bgColor: { type: String, default: '#F5C518' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
