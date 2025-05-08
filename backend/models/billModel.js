const mongoose = require('mongoose');

// Thread Item Schema
const ThreadItemSchema = new mongoose.Schema({
  cone_colour: { type: String, required: true },
  cone_count: { type: Number, required: true, min: 1 },
  price_per_cone: { type: Number, required: true },
  total_price: {
    type: Number,
    default: function () {
      return this.cone_count * this.price_per_cone;
    },
  },
});

// Bill Schema
const BillSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // reference to User collection
    required: true,
  },
  date: { type: Date, default: Date.now },
  company_name: { type: String, required: true },
  phone_no: { type: Number, required: true },
  thread_items: [ThreadItemSchema],
  overall_total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
});

// Export
const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
