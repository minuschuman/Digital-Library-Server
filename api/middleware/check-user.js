const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    const userId = decoded.userId;
    User.findById(userId)
      .exec()
      .then((detail) => {
        if (detail.role !== "admin") {
          if (!detail.is_paid) {
            return res.status(403).json({
              message: "Complete Payment",
            });
          }
          const date = new Date();
          if (!detail.next_payment_date) {
            return res.status(403).json({
              message: "check payment status",
            });
          }
          if (detail.next_payment_date <= date) {
            return res.status(403).json({
              message: "Renew Account",
            });
          }
        }
        next();
      });
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};
