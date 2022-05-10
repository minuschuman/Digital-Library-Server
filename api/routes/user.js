const express = require("express");
const router = express.Router();
const User = require("../models/user");

const UsersConontroller = require("../controllers/user");

router.post("/signup", UsersConontroller.user_singup);
router.post("/login", UsersConontroller.user_login);
router.delete("/:userId", UsersConontroller.user_delete);

module.exports = router;
