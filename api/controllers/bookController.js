const Book = require("../models/book");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const rimraf = require("rimraf");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.books_get_all = (req, res, next) => {
  Book.find()
    .select("name isbn author price bookFile _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        books: docs.map((doc) => {
          // console.log(doc)
          return {
            name: doc.name,
            isbn: doc.isbn,
            author: doc.author,
            price: doc.price,
            bookFile: "/" + doc.bookFile,
            category: doc.category,
            edition: doc.edition,
            publication: doc.publication,
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
};

exports.books_file_new = upload.single("bookFile");

exports.books_add_new = (req, res, next) => {
  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    category: req.body.category,
    isbn: req.body.isbn,
    author: req.body.author,
    price: req.body.price,
    edition: req.body.edition,
    publication: req.body.publication,
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
      if (err.name == "ValidationError") {
        console.error("Error Validating!", err.errors);
        res.status(422).json(err.errors);
      } else {
        res.status(500).json({
          error: err,
        });
      }
    });
};

exports.books_get_single = (req, res, next) => {
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
      // console.log("hehe"+err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.books_update = (req, res, next) => {
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
};

exports.books_remove = (req, res, next) => {
  const id = req.params.bookId;

  Book.findById(id)
    .exec()
    .then((doc) => {
      // console.log(doc);
      if (doc) {
        var uploadsDir = doc.bookFile;
        var upload = "/uploads/";
        fs.readdir(upload, function (err, files) {
          fs.stat(uploadsDir, function (err, stat) {
            var endTime, now;
            if (err) {
              return console.error(err);
            }
            now = new Date().getTime();
            endTime = new Date(stat.ctime).getTime() + 3600000;
            if (now > endTime) {
              return rimraf(uploadsDir, function (err) {
                if (err) {
                  return console.error(err);
                }
                console.log("successfully deleted");
              });
            }
          });
        });
      }
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
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
