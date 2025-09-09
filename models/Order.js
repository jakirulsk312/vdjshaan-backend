// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: [true, "User is required"]
//   },
//   album: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Album",
//     required: [true, "Album is required"]
//   },
//   paypalOrderId: {
//     type: String,
//     required: [true, "PayPal Order ID is required"]
//   },
//   paid: {
//     type: Boolean,
//     default: false
//   },
//   amount: {
//     type: Number,
//     required: [true, "Order amount is required"]
//   }
// }, {
//   timestamps: true
// });

// // Index for better performance
// OrderSchema.index({ user: 1, paid: 1 });
// OrderSchema.index({ paypalOrderId: 1 });

// module.exports = mongoose.model("Order", OrderSchema);






const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"]
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: [true, "Album is required"]
  },
  payuTxnId: {
    type: String,
    required: [true, "PayU Transaction ID is required"]
  },
  paid: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    required: [true, "Order amount is required"]
  }
}, {
  timestamps: true
});

// Index for better performance
OrderSchema.index({ user: 1, paid: 1 });
OrderSchema.index({ payuTxnId: 1 });

module.exports = mongoose.model("Order", OrderSchema);
