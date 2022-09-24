const Rating = require("../models/rating");
const Book = require("../models/book");
const mongoose = require("mongoose");
const { response } = require("express");

exports.rate_add_new = (req, res, next) => {
  const rating = new Rating({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    isbn: req.body.isbn,
    bookRating: req.body.bookRating,
  });
  rating
    .save()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Book not found",
        });
      }
      res.status(201).json({
        message: "Rate stored",
        createdRateId: {
          _id: result._id,
        },
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.rating = (req, res, next) => {
  const bookId = req.params.bookId;
  // console.log(typeof bookId);
  // let o_id = new mongoose.Types.ObjectId(bookId);
  Rating.find({ bookId: bookId })
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
      res.status(500).json({
        error: err,
      });
    });
};

exports.rate_average = async (req, res, next) => {
  const bookId = req.params.bookId;

  // Rating.aggregate([
  //   {
  //     $match: {
  //       bookId: bookId,
  //       bookRating: {
  //         $exists: 1,
  //         $ne: 0,
  //       },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: "$bookId",
  //       // avgRating: {
  //       //   $avg: "$bookRating",
  //       // },
  //     },
  //   },
  // ])
  //   .exec()
  //   .then((doc) => console.log(doc));
  /*(
      // .then((doc) => {
      //   if (doc) {
      //     res.status(200).json(doc);
      //   } else {
      //     res.status(404).json({
      //       message: "Entry not found",
      //     });
      //   }
      // })
      // .catch((err) => {
      //   res.status(500).json({
      //     error: err,
      //   });
      // });
      await average
    )
    .forEach((listing) => {
      console.log(`${listing._id}: ${listing.avgRating}`);
    });
  // console.log(bookId);
  // console.log(average);
  await res.json(average);*/

  Rating.aggregate([
    {
      $match: {
        bookRating: {
          $exists: 1,
          $ne: 0,
        },
      },
    },
    {
      $group: {
        _id: "$bookId",
        averageVote: {
          $avg: "$bookRating",
        },
        voteCount: {
          $count: {},
        },
      },
    },
    {
      $sort: {
        averageVote: -1,
      },
    },
    {
      $limit: 10,
    },
  ]).then((docs) => {
    console.log(docs);
    res.json({ docs });
  });
};

exports.rate_bayesian_average = async (req, res, next) => {
  const limit = 25;
  let pageNo = req.params.pageNo;
  let page = isNaN(pageNo) ? 0 : pageNo;
  let skip = limit * page;
  // console.log(skip);
  /*
  const bookId = req.query.bookId;
  const pipeline0 = [
    {
      $match: {
        bookId: bookId,
        // bookRating: {
        //   $exists: 1,
        //   $ne: 0,
        // },
      },
    },
    // {
    //   $project: {
    //     bookId: 1,
    //   },
    // },
    {
      $match: {
        bookId: { $ne: null },
      },
    },
  ];
*/
  const pipeline = [
    {
      $match: {
        _id: {
          $exists: 1,
        },
        bookRating: {
          $ne: 0,
        },
      },
    },
    {
      $group: {
        _id: "$bookId",
        voteCount: {
          $count: {},
        },
        avgRating: {
          $avg: "$bookRating",
        },
      },
    },
    {
      $set: {
        bayseianRating: {
          $divide: [
            {
              $sum: [
                {
                  $multiply: [25 , 5],
                },
                {
                  $multiply: ["$voteCount", "$avgRating"],
                },
              ],
            },
            {
              $sum: ["$voteCount", 25],
            },
          ],
        },
      },
    },
    {
      $sort: {
        bayseianRating: -1,
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "books",
        pipeline: [
          {
            $project: {
              _id: 0,
              name: 1,
              publication: 1,
              isbn:1
            },
          },
        ],
      },
    },
    {
      $set: {
        name: { $first: "$books.name" },
        publication: { $first: "$books.publication" },
        isbn: { $first: "$books.isbn" },
      },
    },
    {
      $unset: "books",
    },
    // {
    //   $count: "voteCount",
    // },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  // const averageRate = await
  Rating.aggregate(pipeline)
    .then((docs) => {
      res.json(docs);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // console.log(averageRate);
  // res.json(averageRate);
};
