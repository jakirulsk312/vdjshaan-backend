
const crypto = require("crypto");
const Order = require("../models/Order");
const Album = require("../models/Album");

// Generate PayU hash
function generateHash({ key, txnid, amount, productinfo, firstname, email, salt }) {
  const str = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash("sha512").update(str).digest("hex");
}

// Create PayU Order
const createOrder = async (req, res) => {
  try {
    const { albumId, email } = req.body;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Generate txnid
    const txnid = "txn_" + Date.now();

    // Hash string for PayU
    const hash = generateHash({
      key: process.env.PAYU_KEY,
      txnid,
      amount: album.price.toFixed(2),
      productinfo: album.title,
      firstname: email.split("@")[0], // take first part of email
      email,
      salt: process.env.PAYU_SALT,
    });

    // Save order (email-based, no userAuth)
    const order = await Order.create({
      email,
      album: albumId,
      payuTxnId: txnid,
      amount: album.price,
      paid: false,
    });

    const payuData = {
      key: process.env.PAYU_KEY,
      txnid,
      amount: album.price.toFixed(2),
      productinfo: album.title,
      firstname: email.split("@")[0],
      email,
      phone: "9999999999",
      surl: `${process.env.FRONTEND_URL}/api/orders/payu/success`,
      furl: `${process.env.FRONTEND_URL}/api/orders/payu/failure`,
      hash,
    };

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: payuData,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error creating order", error: err.message });
  }
};


// PayU success callback
const payuSuccess = async (req, res) => {
  try {
    const { txnid, status } = req.body;

    const order = await Order.findOne({ payuTxnId: txnid }).populate("album");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status === "success") {
      order.paid = true;
      await order.save();

      return res.json({
        success: true,
        message: "Payment successful",
        downloadUrl: `https://drive.google.com/uc?id=${order.album.driveFileId}&export=download`,
      });
    } else {
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    console.error("PayU success error:", err);
    res.status(500).json({ success: false, message: "Error handling PayU callback", error: err.message });
  }
};

// PayU failure callback
const payuFailure = async (req, res) => {
  try {
    const { txnid } = req.body;
    const order = await Order.findOne({ payuTxnId: txnid });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    return res.json({ success: false, message: "Payment failed" });
  } catch (err) {
    console.error("PayU failure error:", err);
    res.status(500).json({ success: false, message: "Error handling PayU failure", error: err.message });
  }
};
const downloadAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const order = await Order.findOne({ album: albumId, email, paid: true }).populate("album");

    if (!order) {
      return res.status(403).json({ success: false, message: "No paid order found for this album with this email" });
    }

    return res.json({
      success: true,
      downloadUrl: `https://drive.google.com/uc?id=${order.album.driveFileId}&export=download`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error processing download", error: err.message });
  }
};

module.exports = { createOrder, payuSuccess, payuFailure, downloadAlbum };
