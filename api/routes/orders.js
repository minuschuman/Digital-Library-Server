const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");


const OrdersConontroller = require("../controllers/order");

router.get("/", checkAuth, OrdersConontroller.orders_get_all);
router.post("/", checkAuth, OrdersConontroller.orders_add_new);
router.get("/:orderId", checkAuth, OrdersConontroller.orders_get_single);
router.delete("/:orderId", checkAuth, OrdersConontroller.orders_remove);

module.exports = router;
