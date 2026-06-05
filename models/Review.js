const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  favoriteDate: { type: String, default: '' },
  dateOfVisit: { type: String, default: '' },
  tableNumber: { type: String, default: '' },
  ratings: {
    foodVariety:      { type: Number, min: 1, max: 5, default: null },
    foodQuality:      { type: Number, min: 1, max: 5, default: null },
    drinksVariety:    { type: Number, min: 1, max: 5, default: null },
    drinksQuality:    { type: Number, min: 1, max: 5, default: null },
    welcomeService:   { type: Number, min: 1, max: 5, default: null },
    employeeBehavior: { type: Number, min: 1, max: 5, default: null },
    cleanliness:      { type: Number, min: 1, max: 5, default: null },
    serviceSpeed:     { type: Number, min: 1, max: 5, default: null },
    music:            { type: Number, min: 1, max: 5, default: null },
  },
  comments: { type: String, trim: true, default: '' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
