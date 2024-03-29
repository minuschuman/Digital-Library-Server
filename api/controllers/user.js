const User = require("../models/user");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const session = require("express-session");
// const checkSession = require("../middleware/checkSession");

exports.user_singup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length > 0) {
        return res.status(422).json({
          message: "user already exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              address: req.body.address,
              contact: req.body.contact,
              role: req.body.role,
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((resust) => {
                res.status(201).json({
                  message: "User created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch();
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "12h",
            }
          );
          // req.session.user = user;
          // console.log(req.session.user);
          // user = result;
          // user.tokens = user.tokens.concat({token})
          // user.save();

          return res.status(200).json({
            message: "Auth sucess",
            token: token,
            userId: user[0]._id,
            role: user[0].role,
          });
        }
        return res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_delete = (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "Usser deleted" });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.users_get_all = (req, res, next) => {
  User.find()
    // .select("name isbn author price bookFile _id")
    // .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        books: docs.map((doc) => {
          // console.log(doc);
          return {
            _id: doc._id,
            name: doc.name,
            email: doc.email,
            role: doc.role,
            contact: doc.contact,
            address: doc.address,
            is_paid: doc.is_paid,
            next_payment_date: doc.next_payment_date,
            request: {
              type: "GET",
              url: "/user/" + doc._id,
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

exports.user_update = (req, res, next) => {
  // console.log(req.body);
  const id = req.params.userId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  User.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      // console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      // console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.user_get_single = (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((doc) => {
      // console.log(doc);
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

exports.user_password = (req, res, next) => {
  const id = req.params.userId;
  const newPass = req.body.newPass;
  const oldPass = req.body.oldPass;
  if (!oldPass) {
    return res.status(401).json({
      error: "Provide oldPass",
    });
  }

  if (!newPass) {
    return res.status(401).json({
      error: "Provide new password",
    });
  }

  if (oldPass == newPass) {
    return res.status(401).json({
      error: "old pass can't be new password",
    });
  }

  User.findById(id)
    .exec()
    .then((user) => {
      bcrypt.compare(oldPass, user.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Somting went wrong",
            err: err.message,
          });
        }
        if (!result) {
          return res.status(401).json({
            message: "Old password doesn't match",
          });
        }

        bcrypt.hash(newPass, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            User.findOneAndUpdate(
              { _id: id },
              { password: hash },
              (err, upResult) => {
                if (err) {
                  res.status(401).json({
                    message: "Somting went wrong",
                    err: err,
                  });
                }
                if (upResult) {
                  res.status(201).json({
                    message: "Password updated",
                  });
                }
              }
            );
          }
        });
      });

      // .save()
      // .then((resust) => {
      //   console.log(resust);
      //   res.status(201).json({
      //     message: "Password updated",
      //   });
      // })
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
