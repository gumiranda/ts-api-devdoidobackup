const mongoose = require('mongoose');

const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const notificationModel = new schema(
  {
    content: { type: String, required: true },
    type: { type: String, default: 'message' },
    userFor: {
      type: ObjectId,
      index: true,
      ref: 'User',
    },
    userBy: {
      type: ObjectId,
      ref: 'User',
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

notificationModel.pre('save', (next) => {
  const now = new Date();
  if (!this.createdAt) this.createdAt = now;
  next();
});

module.exports = mongoose.model('Notification', notificationModel);
