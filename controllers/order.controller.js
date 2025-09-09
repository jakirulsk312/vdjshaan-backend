// const Order = require("../models/Order");
// const Album = require("../models/Album");
// const paypal = require("@paypal/checkout-server-sdk");

// // PayPal Environment
// function environment() {
//   const clientId = process.env.PAYPAL_CLIENT_ID;
//   const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

//   if (process.env.NODE_ENV === "production") {
//     return new paypal.core.LiveEnvironment(clientId, clientSecret);
//   } else {
//     return new paypal.core.SandboxEnvironment(clientId, clientSecret);
//   }
// }

// // PayPal Client
// function client() {
//   return new paypal.core.PayPalHttpClient(environment());
// }

// // Create PayPal Order
// const createOrder = async (req, res) => {
//   try {
//     const { albumId } = req.body;
//     const userId = req.user._id;

//     // Get album details
//     const album = await Album.findById(albumId);
//     if (!album) {
//       return res.status(404).json({
//         success: false,
//         message: "Album not found"
//       });
//     }

//     // Check if user already purchased this album
//     const existingOrder = await Order.findOne({
//       user: userId,
//       album: albumId,
//       paid: true
//     });

//     if (existingOrder) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already purchased this album"
//       });
//     }

//     // Create PayPal order
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [{
//         amount: {
//           currency_code: "USD",
//           value: album.price.toFixed(2)
//         },
//         description: `Album: ${album.title}`
//       }],
//       application_context: {
//         brand_name: "Music Store",
//         landing_page: "BILLING",
//         user_action: "PAY_NOW",
//         return_url: `${process.env.BASE_URL || "http://localhost:3000"}/purchases`,
//         cancel_url: `${process.env.BASE_URL || "http://localhost:3000"}/albums`
//       }
//     });

//     const paypalResponse = await client().execute(request);

//     // Save order to database
//     const order = await Order.create({
//       user: userId,
//       album: albumId,
//       paypalOrderId: paypalResponse.result.id,
//       amount: album.price,
//       paid: false
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       data: {
//         paypalOrderId: paypalResponse.result.id,
//         dbOrderId: order._id,
//         approvalUrl: paypalResponse.result.links.find(link => link.rel === "approve").href
//       }
//     });

//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error creating order",
//       error: error.message
//     });
//   }
// };

// // Capture PayPal Order
// const captureOrder = async (req, res) => {
//   try {
//     const { paypalOrderId } = req.body;
//     const userId = req.user._id;

//     // Find the order in database
//     const order = await Order.findOne({
//       paypalOrderId,
//       user: userId,
//       paid: false
//     });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found or already processed"
//       });
//     }

//     // Capture PayPal payment
//     const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
//     request.requestBody({});

//     const captureResponse = await client().execute(request);

//     if (captureResponse.result.status === "COMPLETED") {
//       // Update order as paid
//       order.paid = true;
//       await order.save();

//       return res.status(200).json({
//         success: true,
//         message: "Payment captured successfully",
//         data: {
//           orderId: order._id,
//           paypalOrderId: paypalOrderId,
//           status: "COMPLETED"
//         }
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Payment capture failed",
//         data: captureResponse.result
//       });
//     }

//   } catch (error) {
//     console.error("Error capturing order:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error capturing order",
//       error: error.message
//     });
//   }
// };

// // Get User's Orders
// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const orders = await Order.find({
//       user: userId,
//       paid: true
//     })
//     .populate("album", "title description duration price image")
//     .sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       message: "Orders fetched successfully",
//       count: orders.length,
//       data: orders
//     });

//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching orders",
//       error: error.message
//     });
//   }
// };

// // Download Album (TODO: Implement Google Drive integration)
// const downloadAlbum = async (req, res) => {
//   try {
//     const { albumId } = req.params;
//     const userId = req.user._id;

//     // Check if user purchased this album
//     const order = await Order.findOne({
//       user: userId,
//       album: albumId,
//       paid: true
//     }).populate("album");

//     if (!order) {
//       return res.status(403).json({
//         success: false,
//         message: "You have not purchased this album"
//       });
//     }

//     // TODO: Implement Google Drive download using driveFileId
//     // For now, return the drive file ID
//     return res.status(200).json({
//       success: true,
//       message: "Download authorized",
//       data: {
//         albumTitle: order.album.title,
//         driveFileId: order.album.driveFileId,
//         downloadUrl: `https://drive.google.com/file/d/${order.album.driveFileId}/view`
//       }
//     });

//   } catch (error) {
//     console.error("Error processing download:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Error processing download",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   captureOrder,
//   getMyOrders,
//   downloadAlbum
// };














const crypto = require("crypto");
const Order = require("../models/Order");
const Album = require("../models/Album");

// Generate hash for PayU
function generateHash({ key, txnid, amount, productinfo, firstname, email, salt }) {
  const string = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
  return crypto.createHash("sha512").update(string).digest("hex");
}

// Create PayU Order
const createOrder = async (req, res) => {
  try {
    const { albumId } = req.body;
    const userId = req.user._id;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Check if user already purchased
    const existingOrder = await Order.findOne({ user: userId, album: albumId, paid: true });
    if (existingOrder) {
      return res.status(400).json({ success: false, message: "Already purchased this album" });
    }

    // Generate txnid
    const txnid = "txn_" + Date.now();

    // Hash string for PayU
    const hash = generateHash({
      key: process.env.PAYU_KEY,
      txnid,
      amount: album.price.toFixed(2),
      productinfo: album.title,
      firstname: req.user.name || "User",
      email: req.user.email || "test@example.com",
      salt: process.env.PAYU_SALT
    });

    // Save order
    const order = await Order.create({
      user: userId,
      album: albumId,
      payuTxnId: txnid,
      amount: album.price,
      paid: false
    });

    const payuData = {
      key: process.env.PAYU_KEY,
      txnid,
      amount: album.price.toFixed(2),
      productinfo: album.title,
      firstname: req.user.name || "User",
      email: req.user.email || "test@example.com",
      phone: "9999999999",
      surl: `${process.env.BASE_URL}/api/orders/payu/success`,
      furl: `${process.env.BASE_URL}/api/orders/payu/failure`,
      hash
    };

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: payuData
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ success: false, message: "Error creating order", error: err.message });
  }
};

// PayU success callback
const payuSuccess = async (req, res) => {
  try {
    const { txnid, status } = req.body;

    const order = await Order.findOne({ payuTxnId: txnid });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (status === "success") {
      order.paid = true;
      await order.save();
      return res.json({ success: true, message: "Payment successful", data: order });
    } else {
      return res.json({ success: false, message: "Payment failed", data: order });
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
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.json({ success: false, message: "Payment failed", data: order });
  } catch (err) {
    console.error("PayU failure error:", err);
    res.status(500).json({ success: false, message: "Error handling PayU failure", error: err.message });
  }
};

// Get User Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, paid: true })
      .populate("album", "title description duration price image")
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: err.message });
  }
};

//get all orders

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")       // include user details
      .populate("album", "title price")     // include album details
      .sort({ createdAt: -1 });             // latest orders first

    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error: err.message
    });
  }
};



// ✅ Test Purchase (skip PayU)
const testPurchase = async (req, res) => {
  try {
    const { albumId } = req.body;
    const userId = req.user._id;

    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    // Check if already purchased
    const existingOrder = await Order.findOne({ user: userId, album: albumId, paid: true });
    if (existingOrder) {
      return res.status(400).json({ success: false, message: "Already purchased this album" });
    }

    // ✅ Directly mark as paid (skip PayU)
    const order = await Order.create({
      user: userId,
      album: albumId,
      payuTxnId: "test_" + Date.now(),
      amount: album.price,
      paid: true, // directly mark as paid
    });

    return res.json({
      success: true,
      message: "Test purchase successful",
      album: {
        _id: album._id,
        title: album.title,
        description: album.description,
        coverUrl: album.image,
        downloadUrl: `https://drive.google.com/uc?id=${album.driveFileId}&export=download`,
      },
    });
  } catch (err) {
    console.error("Test purchase error:", err);
    return res.status(500).json({ success: false, message: "Error in test purchase", error: err.message });
  }
};




// Download album
const downloadAlbum = async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.user._id, album: req.params.albumId, paid: true })
      .populate("album");

    if (!order) {
      return res.status(403).json({ success: false, message: "You have not purchased this album" });
    }

    return res.json({
      success: true,
      message: "Download authorized",
      data: {
        albumTitle: order.album.title,
        driveFileId: order.album.driveFileId,
        downloadUrl: `https://drive.google.com/file/d/${order.album.driveFileId}/view`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error processing download", error: err.message });
  }
};



module.exports = {
  createOrder,
  payuSuccess,
  payuFailure,
  getMyOrders,
  getAllOrders,
  downloadAlbum,
  testPurchase
};