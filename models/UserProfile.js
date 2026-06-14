const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  nativeLanguage: { type: String, default: 'pt' },
  learningLanguages: [{ type: String }],
  xp: { type: Number, default: 0 },
  messagesSent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
