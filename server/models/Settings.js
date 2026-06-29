const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    organizationName: { type: String, required: true, default: 'VendorPro Ltd' },
    contactEmail: { type: String, required: true, default: 'procurement@vendorpro.com' },
    contactNumber: { type: String, default: '+1 (555) 019-2834' },
    address: { type: String, default: '100 Procurement Blvd, Suite 400' },
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 5 }, // percentage
    enableEmailNotifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
