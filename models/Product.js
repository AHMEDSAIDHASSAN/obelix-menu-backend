const mongoose = require('mongoose');

const sizeOptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, trim: true },
    description: { type: String },
    descriptionAr: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    subSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubSubCategory' },
    image: { type: String },
    basePrice: { type: Number, required: true },
    sizes: [sizeOptionSchema],
    discount: { type: Number, default: 0, min: 0, max: 100 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.virtual('finalPrice').get(function () {
  return this.basePrice - (this.basePrice * this.discount) / 100;
});

module.exports = mongoose.model('Product', productSchema);
