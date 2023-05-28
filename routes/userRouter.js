const express = require('express');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../middlewares/authenticate');
const limiter = require('../middlewares/limiter');
const userRouter = express.Router();

userRouter.route('/register').post((req, res, next) => {
  User.register(
    new User({ email: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.name) user.name = req.body.name;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            var token = authenticate.getToken({ _id: user._id.valueOf() });
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              token: token,
              status: 'Registration Successful!',
            });
          });
        });
      }
    }
  );
});

userRouter
  .route('/login')
  .post(limiter, passport.authenticate('local'), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token: token,
      status: 'You are successfully logged in!',
    });
  });

userRouter
  .route('/')
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({}, { salt: 0, hash: 0 })
      .sort({ _id: -1 })
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

userRouter
  .route('/:userId')
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.findById(req.params.userId)
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.findById(req.params.userId)
      .then(
        (user) => {
          if (user != null) {
            if (req.body.username) {
              user.username = req.body.username;
            }
            if (req.body.admin) {
              user.admin = req.body.admin;
            }
            if (req.body.root) {
              user.root = req.body.root;
            }
            user
              .save()
              .then(
                (user) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(user);
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else {
            err = new Error('user ' + req.params.userId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifySuperAdmin,
    authenticate.verifyAdmin,
    (req, res, next) => {
      User.findByIdAndRemove(req.params.userId)
        .then(
          (resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ Message: 'user deleted successefully!' });
          },
          (err) => next(err)
        )
        .catch((err) => next(err));
    }
  );

userRouter.route('/admin/:userId').get(authenticate.verifyUser, (req, res) => {
  User.findById(req.params.userId, {
    name: 1,
    email: 1,
    isAdmin: 1,
    isSuperAdmin: 1,
  }).then((user) => {
    if (user && req.user.isAdmin) {
      return res.status(200).json({ user });
    }
    if (!user) {
      return res.status(404).json({ error: 'User non trouvé' });
    } else {
      return res
        .status(403)
        .json({ error: 'You are not authorized to perform this operation!' });
    }
  });
});

userRouter
  .route('/change-password')
  .post(authenticate.verifyUser, (req, res, next) => {
    User.findById(req.user._id).then(
      function (sanitizedUser) {
        if (sanitizedUser) {
          sanitizedUser.setPassword(req.body.newPassword, function () {
            sanitizedUser.save();
            res.status(200).json({ message: 'password reset successful' });
          });
        } else {
          res.status(500).json({ newPassword: 'This user does not exist' });
        }
      },
      function (err) {
        console.error(err);
      }
    );
  });

module.exports = userRouter;
