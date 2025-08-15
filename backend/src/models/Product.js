const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: { type: Number, require: true },
    images: [{ type: String }],
    ratings: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String },
        rating: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

// Add indexes for better performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ ratings: -1 });

// Add compound indexes for common query patterns
productSchema.index({ category: 1, price: 1, stock: 1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1, stock: 1 });
productSchema.index({ ratings: -1, createdAt: -1 });

// Add sparse index for optional fields
productSchema.index({ images: 1 }, { sparse: true });

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  if (this.stock <= 15) return 'limited_stock';
  return 'in_stock';
});

// Ensure virtuals are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
