const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. 'VENDOR_CREATED', 'QUOTATION_APPROVED'
    entityType: { type: String, enum: ['vendor', 'quotation', 'user', 'system'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    entityName: { type: String },
    description: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    icon: { type: String, default: 'info' },
    iconBg: { type: String, default: 'bg-secondary-fixed' },
    iconColor: { type: String, default: 'text-secondary' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
