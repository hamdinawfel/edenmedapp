const express = require('express');
const bodyParser = require('body-parser');

const Blog = require('../models/blog');
const Participant = require('../models/participant');
const Event = require('../models/event');
const Message = require('../models/message');

var authenticate = require('../middlewares/authenticate');

const statisticsRoute = express.Router();

statisticsRoute.use(bodyParser.json());

statisticsRoute
  .route('/events')
  .get(authenticate.verifyUser, (req, res, next) => {
    Event.find({})
      .countDocuments()
      .then(
        (count) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(count);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

statisticsRoute
  .route('/participants')
  .get(authenticate.verifyUser, (req, res, next) => {
    Participant.find({})
      .countDocuments()
      .then(
        (count) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(count);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

statisticsRoute
  .route('/blogs')
  .get(authenticate.verifyUser, (req, res, next) => {
    Blog.find({})
      .countDocuments()
      .then(
        (count) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(count);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

statisticsRoute
  .route('/messages')
  .get(authenticate.verifyUser, (req, res, next) => {
    Message.find({})
      .countDocuments()
      .then(
        (count) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(count);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

statisticsRoute
  .route('/participants/events')
  .get(authenticate.verifyUser, (req, res, next) => {
    Participant.aggregate(
      [
        { $match: { isActive: true } },
        {
          $project: {
            _id: 0,
            participants: 1,
            eventDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$eventDate' },
            },
            eventId: 1,
          },
        },
        {
          $group: {
            _id: '$eventId',
            participants: { $sum: 1 },
            date: { $first: '$eventDate' },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ],
      function (err, result) {
        res.json(result);
      }
    ).allowDiskUse(true);
  });

statisticsRoute.route('/vues/blogs').get((req, res, next) => {
  const LIMIT_OF_POPULAR_BLOG = 5;
  Blog.aggregate(
    [
      {
        $project: {
          _id: 0,
          vues: 1,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
        },
      },
      {
        $sort: {
          vues: -1,
        },
      },
      {
        $limit: LIMIT_OF_POPULAR_BLOG,
      },
    ],
    function (err, result) {
      res.json(result);
    }
  ).allowDiskUse(true);
});

module.exports = statisticsRoute;
