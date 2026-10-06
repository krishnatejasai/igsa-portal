const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  kind: { type: String, enum: ['roommate', 'travel'], required: true },
  name: String, title: String, details: String, email: String, phone: String,
  location: String, destination: String, startDate: String, endDate: String,
  stayType: String, budget: String, travelMode: String,
  gender: String, genderDescription: String, apartment: String,
  ownerSub: { type: String, select: false },
  retentionVersion: Number,
  expiresOn: { type: String, required: true },
  status: { type: String, enum: ['active', 'closed', 'hidden'], default: 'active' },
  manageTokenHash: { type: String, required: true, select: false },
  consentAt: { type: Date, required: true, select: false },
}, { timestamps: true });
schema.index({ status: 1, kind: 1, expiresOn: 1, createdAt: -1 });
schema.index({ ownerSub: 1, createdAt: -1 });
schema.index({ email: 1, createdAt: -1 });
schema.index({ phone: 1, createdAt: -1 });
module.exports = mongoose.model('CommunityPost', schema);
