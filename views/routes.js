const express = require("express");
const router = express.Router();
// const checkAuth = require("../middleware/check-auth");

// const OrdersConontroller = require("../controllers/order");

router.get("/", function (req, res) {
  res.render("index");
});

router.get("/dash", function (req, res) {
  res.render("dash");
});

module.exports = router;
