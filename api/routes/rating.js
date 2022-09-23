const express = require("express");
const router = express.Router();

const RatingController = require("../controllers/ratingController");

const Rating = require("../models/rating");
const Book = require("../models/book");

router.get("/bookid/:bookId", RatingController.rating);
router.post("/", RatingController.rate_add_new);
router.get("/average/bookid/:bookId", RatingController.rate_average);

router.get("/bayesianRate/:pageNo", RatingController.rate_bayesian_average);

module.exports = router;
