
const express = require("express");
const router = express.Router();
// const checkAuth = require("../middleware/check-auth");

// const OrdersConontroller = require("../controllers/order");

router.get("/", function (req, res) {
  res.render("index");
});

// router.get("/dash", function (req, res) {
//   res.render("dash");
// });

// router.get("/dashboard", function (req, res) {
//   res.render("dashboard");
// });

// //route for book
// router.get("/book", function (req, res) {
//   res.render("book/index");
// });

// router.get("/book/add", function (req, res) {
//   res.render("book/add");
// });

// router.get("/book/edit", function (req, res) {
//   res.render("/book/edit");
// });

// router.get("/book/category", function (req, res) {
//   res.render("/book/category");
// });

// router.get("/user", function (req, res) {
//   res.render("user/index");
// });
// router.get("/user/edit", function (req, res) {
//   res.render("user/edit");
// });
// router.get("/user/book", function (req, res) {
//   res.render("user/book");
// });
module.exports = router;
