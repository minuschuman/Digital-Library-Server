const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

const Book = require("../models/book");

router.get("/", (req, res, next) => {
  Book.find()
    .select("name isbn author price bookFile _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        books: docs.map((doc) => {
          return {
            name: doc.name,
            isbn: doc.isbn,
            author: doc.author,
            price: doc.price,
            bookFile: "/" + doc.bookFile,
            _id: doc._id,
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
});

router.post("/", checkAuth, upload.single("bookFile"), (req, res, next) => {
  console.log(req.file);
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    isbn: req.body.isbn,
    author: req.body.author,
    price: req.body.price,
    bookFile: req.file.path,
  });
  book
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Created successfully",
        createdBook: {
          name: result.name,
          isbn: result.isbn,
          author: result.author,
          price: result.price,
          _id: result._id,
          request: {
            type: "GET",
            url: "/books/" + result._id,
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
});

router.get("/:bookId", (req, res, next) => {
  const id = req.params.bookId;
  Book.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc);
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
});

router.patch("/:bookId", checkAuth, (req, res, next) => {
  const id = req.params.bookId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Book.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:bookId", checkAuth, (req, res, next) => {
  const id = req.params.bookId;
  Book.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
