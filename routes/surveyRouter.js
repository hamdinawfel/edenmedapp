const express = require('express');
var authenticate = require('../middlewares/authenticate');
const Survey = require('../models/survey');
const surveyRouter = express.Router();

surveyRouter
  .route('/')
  .post(authenticate.verifyUser, (req, res, next) => {
    const surveyGeneralInfo = new Survey({
      title: req.body.title,
      description: req.body.description,
      label: req.body.label,
      imageUrl: req.body.imageUrl,
      isVisible: req.body.isVisible,
      language: req.body.language,
    });

    surveyGeneralInfo
      .save()
      .then(
        (result) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get((req, res, next) => {
    Survey.find({})
      .then(
        (result) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

surveyRouter.route('/:language').get((req, res, next) => {
  const language = req.params.language;
  Survey.find({ language: language, isVisible: true })
    .then(
      (surveys) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(surveys);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});


surveyRouter
  .route('/survey/:id')
  .get( (req, res, next) => {
    const { id } = req.params;
    Survey.findById(id)
        .then(
            (survey) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(survey);
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
    })
  .put(authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
    const updatedSurvey = {
      title: req.body.title,
      description: req.body.description,
      label: req.body.label,
      imageUrl: req.body.imageUrl,
      language: req.body.language,
      userInformations: req.body.userInformations,
      questions: req.body.questions,
      isVisible: req.body.isVisible,
    };

    Survey.findByIdAndUpdate(id, updatedSurvey, { new: true })
      .then(
        (result) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
    Survey.findByIdAndDelete(id)
      .then(
        () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json('slide deleted');
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = surveyRouter;
