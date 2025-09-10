// const express = require("express");
// const {
//   createOrder,
//   captureOrder,
//   getMyOrders,
//   downloadAlbum
// } = require("../controllers/order.controller");
// const userAuth = require("../middleware/userAuth"); // User auth

// const router = express.Router();

// // All routes require user authentication
// router.post("/create", userAuth, createOrder);        // POST /api/orders/create
// router.post("/capture", userAuth, captureOrder);      // POST /api/orders/capture
// router.get("/mine", userAuth, getMyOrders);           // GET /api/orders/mine

// module.exports = router;


//=================================================


// const express = require("express");
// const {
//   createOrder,
//   payuSuccess,
//   payuFailure,
//   getMyOrders,
//   getAllOrders,
//   downloadAlbum,
//   testPurchase
// } = require("../controllers/order.controller");
// const isAdmin = require("../middleware/auth");
// const userAuth = require("../middleware/userAuth");

// const router = express.Router();

// // PayU order
// router.post("/create", userAuth, createOrder);
// router.post("/test-purchase", userAuth, testPurchase);

// // PayU callbacks
// router.post("/payu/success", payuSuccess);
// router.post("/payu/failure", payuFailure);

// // User's orders
// router.get("/mine", userAuth, getMyOrders);
// router.get("/orders/all", isAdmin, getAllOrders);

// // Download album
// router.get("/download/:albumId", userAuth, downloadAlbum);

// module.exports = router;


//=================================================



const express = require("express");
const { createOrder, payuSuccess, payuFailure } = require("../controllers/order.controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/payu/success", payuSuccess);
router.post("/payu/failure", payuFailure);

module.exports = router;
