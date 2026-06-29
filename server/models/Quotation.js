const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    rfqId: { type: String, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    amount: { type: Number, required: true, min: 0 },
    submissionDate: { type: Date, required: true },
    expirationDate: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'in_review', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-generate RFQ ID before saving
quotationSchema.pre('save', async function (next) {
  if (!this.rfqId) {
    const count = await mongoose.model('Quotation').countDocuments();
    const year = new Date().getFullYear();
    this.rfqId = `RFQ-${year}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

quotationSchema.index({ title: 'text', description: 'text', rfqId: 'text' });

module.exports = mongoose.model('Quotation', quotationSchema);
