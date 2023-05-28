const express = require('express');
var authenticate = require('../middlewares/authenticate');
const Slider = require('../models/slider');
const sliderRouter = express.Router();

sliderRouter
  .route('/')
  .post(authenticate.verifyUser, (req, res, next) => {
    const newSlide = new Slider({
      imageUrl: req.body.imageUrl,
      backgroundColor: req.body.backgroundColor,
      title: req.body.title,
      titleColor: req.body.titleColor,
      titleSize: req.body.titleSize,
      subTitle: req.body.subTitle,
      subTitleColor: req.body.subTitleColor,
      subTitleSize: req.body.subTitleSize,
      slideAutoplayDelay: req.body.slideAutoplayDelay,
      language: req.body.language,
    });

    newSlide
      .save()
      .then(
        (hero) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(hero);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get((req, res, next) => {
    Slider.find({})
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

sliderRouter.route('/:language').get((req, res, next) => {
  const language = req.params.language;
  Slider.find({ language: language })
    .then(
      (slides) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(slides);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

sliderRouter
  .route('/:id')
  .put(authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
    const updatedSlide = {
      imageUrl: req.body.imageUrl,
      backgroundColor: req.body.backgroundColor,
      title: req.body.title,
      titleColor: req.body.titleColor,
      titleSize: req.body.titleSize,
      subTitle: req.body.subTitle,
      subTitleColor: req.body.subTitleColor,
      subTitleSize: req.body.subTitleSize,
      slideAutoplayDelay: req.body.slideAutoplayDelay,
      language: req.body.language,
    };

    Slider.findByIdAndUpdate(id, updatedSlide, { new: true })
      .then(
        (slide) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(slide);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
    Slider.findByIdAndDelete(id)
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

module.exports = sliderRouter;
