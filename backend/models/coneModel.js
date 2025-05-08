const mongoose = require('mongoose');

const coneSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  }
});

const Cone = mongoose.model('Cone', coneSchema);
module.exports = Cone;
