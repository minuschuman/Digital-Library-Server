const express = require("express");
const router = express.Router();
const checkUser = require("../middleware/check-user");


const OrdersConontroller = require("../controllers/order");

router.get("/", checkUser, OrdersConontroller.orders_get_all);
router.post("/", checkUser, OrdersConontroller.orders_add_new);
router.get("/:orderId", checkUser, OrdersConontroller.orders_get_single);
router.delete("/:orderId", checkUser, OrdersConontroller.orders_remove);

module.exports = router;
