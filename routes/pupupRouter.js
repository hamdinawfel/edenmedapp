const express = require('express');
var authenticate = require('../middlewares/authenticate');
const Pupup = require('../models/pupup');
const pupupRouter = express.Router();
const fs = require('fs');
var multer = require('../middlewares/multer');

pupupRouter
  .route('/')
  .post(authenticate.verifyUser, multer, (req, res, next) => {
    const newPup = new Pupup({
      imageUrl: `/uploads/${req.file.filename}`,
      label: req.body.label,
      language: req.body.language,
    });

    newPup
      .save()
      .then(
        (pupup) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(pupup);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get((req, res, next) => {
    Pupup.find({})
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

pupupRouter.route('/:language').get((req, res, next) => {
  const language = req.params.language;
  Pupup.findOne({ language: language, isVisible: true })
    .then(
      (pupup) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pupup);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
// Get Item to delete image from fs before update it
pupupRouter
  .route('/:id')
  .put(authenticate.verifyUser, multer, (req, res, next) => {
    Pupup.findById(req.params.id)
      .then((puppup) => {
        const filename = puppup.imageUrl.split('/uploads/')[1];
        const updatedPupup = {
          imageUrl: `/uploads/${req.file.filename}`,
          label: req.body.label,
          language: req.body.language,
        };
        fs.unlink(`uploads/${filename}`, () => {
          Pupup.updateOne(
            { _id: req.params.id },
            { ...updatedPupup, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: 'updated !' }))
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => res.status(400).json({ error: err }));
  })
  // Get Item to delete image from fs before delete it
  .delete(authenticate.verifyUser, (req, res, next) => {
    const { id } = req.params;
    Pupup.findById(req.params.id)
      .then((puppup) => {
        const filename = puppup.imageUrl.split('/uploads/')[1];
        fs.unlink(`uploads/${filename}`, () => {
          Pupup.findByIdAndDelete(id)
            .then(
              () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json('deleted!');
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        });
      })
      .catch((err) => res.status(400).json({ error: err }));
  });

pupupRouter
  .route('/visibility/:id')
  .put(authenticate.verifyUser, (req, res, next) => {
    console.log('visibility');
    const { id } = req.params;
    const updatedSlide = {
      isVisible: req.body.isVisible,
    };
    Pupup.findByIdAndUpdate(id, updatedSlide, { new: true })
      .then(
        (slide) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.json(slide);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
module.exports = pupupRouter;
