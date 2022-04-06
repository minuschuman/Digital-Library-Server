const Order = require("../models/order");
const Book = require("../models/book");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("book _id")
    .populate("book", "_id name")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            book: doc.book,
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
  Book.findById(req.body.bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        book: req.body.bookId,
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