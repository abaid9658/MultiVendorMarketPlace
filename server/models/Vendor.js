const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    businessAddress: { type: String, required: true, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

vendorSchema.index({ vendorName: 'text', companyName: 'text', email: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);
