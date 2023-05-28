var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

require('dotenv').config();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function (user) {
  return jwt.sign(user, 'dkkd52xhzuq§KDKJ36SJDHG5DJD29DDHY', {
    expiresIn: 3600 * 24 * 7,
  });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'dkkd52xhzuq§KDKJ36SJDHG5DJD29DDHY';

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  } else {
    err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  }
};

exports.verifySuperAdmin = (req, res, next) => {
  if (req.user.isSuperAdmin) {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: 'You are not authorized to perform this operation!' });
  }
};
