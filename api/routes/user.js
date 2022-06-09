const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const UsersConontroller = require("../controllers/user");

router.post("/signup", UsersConontroller.user_singup);
router.post("/login", UsersConontroller.user_login);
router.delete("/:userId", UsersConontroller.user_delete);

router.get("/", checkAuth, UsersConontroller.users_get_all);
router.get("/:userId", checkAuth, UsersConontroller.user_get_single);
router.patch("/:userId", checkAuth, UsersConontroller.user_update);

module.exports = router;