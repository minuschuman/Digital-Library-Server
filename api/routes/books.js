const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const BookController = require("../controllers/bookController");

router.get("/", BookController.books_get_all);
router.post(
  "/",
  checkAuth,
  BookController.books_file_new,
  BookController.books_add_new
);
router.get("/:bookId", BookController.books_get_single);
router.patch("/:bookId", checkAuth, BookController.books_update);
router.delete("/:bookId", checkAuth, BookController.books_remove);

module.exports = router;
