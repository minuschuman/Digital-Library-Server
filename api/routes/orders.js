const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/check-user");

const OrdersConontroller = require("../controllers/order");

router.get("/pending", checkUser, OrdersConontroller.orders_pending);
router.get("/check", checkUser,OrdersConontroller.return_true);
router.get("/", checkUser, OrdersConontroller.orders_get_all);
router.post("/", checkUser, OrdersConontroller.orders_add_new);
router.get("/:orderId", checkUser, OrdersConontroller.orders_get_single);
router.get("/:status/:UserId", checkUser, OrdersConontroller.orders_getAll_personWise);
router.delete("/:orderId", checkUser, OrdersConontroller.orders_remove);

module.exports = router;
