'user strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const moment = require('moment');

const userModel = new schema(
  {
    name: { trim: true, index: true, required: true, type: String },
    email: { type: String },
    photo_url: { type: String },
    type: { type: String, default: 'client' },
    cpf: { type: String },
    pushId: { type: String },
    phone: { type: String },
    password: { type: String },
    ativo: { type: Boolean, required: true, default: true },
    payDay: {
      type: Date,
      default: new Date(moment().add(7, 'days')._d.toISOString()),
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

userModel.pre('save', (next) => {
  const agora = new Date();
  const datav = new Date(moment().add(7, 'days')._d.toISOString());
  if (!this.createdAt) this.createdAt = agora;
  if (!this.payDay) this.payDay = datav;
  next();
});

module.exports = mongoose.model('User', userModel);
