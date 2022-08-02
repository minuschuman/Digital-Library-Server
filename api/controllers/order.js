const Order = require("../models/order");
const Book = require("../models/book");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.orders_pending = (req, res, next) => {
  Order.find({ status: "pending" })
    .select("book _id")
    .populate("book", "_id name")
    .populate("user", "_id name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            book: doc.book,
            user: doc.user,
            status: doc.status,
            request: {
              type: "GET",
              url: "/books/" + doc._id,
            },
          };
        }),
      };
      if (docs) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Data Not Found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("book _id")
    .populate("book", "_id name")
    .populate("user", "_id name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            book: doc.book,
            user: doc.user,
            status: doc.status,
            request: {
              type: "GET",
              url: "/books/" + doc._id,
            },
          };
        }),
      };
      if (docs) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Data Not Found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_add_new = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  const userId = decoded.userId;
  if (!req.body.bookId)
    return res.status(404).json({
      message: "bookId required",
    });
  Book.findById(req.body.bookId)
    .then((book) => {
      if (!book) {
        console.log(first);
        return res.status(404).json({
          message: "Book not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        book: req.body.bookId,
        user: userId,
      });
      return order
        .save()
        .then((result) => {
          if (!result) {
            return res.status(404).json({
              message: "Book not found",
            });
          }
          console.log(result);
          res.status(201).json({
            message: "Order stored",
            createdOrder: {
              _id: result._id,
              book: result.book,
              request: {
                type: "GET",
                url: "/orders/" + result._id,
              },
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_get_single = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate("book", "_id name")
    .populate("user", "_id name")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          order: doc,
          request: {
            type: "GET",
            url: "/orders",
          },
        });
      } else {
        res.status(404).json({
          message: "Entry not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_getAll_personWise = (req, res, next) => {
  const id = req.params.UserId;
  const rqStatus = req.params.status;
  Order.find({ user: id, status: rqStatus })
    .populate("book", "_id name bookFile")
    .populate("user", "_id name")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "Entry not found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.orders_remove = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.return_true = (req, res, next) => {
  res.status(200).json({
    message: "true",
  });
};
