const express = require('express');
var authenticate = require('../middlewares/authenticate');
const Image = require('../models/image');
const ImageRouter = express.Router();
const fs = require('fs');
var multer = require('../middlewares/multer');

ImageRouter
  .route('/')
  .post(authenticate.verifyUser, multer, (req, res, next) => {
    const newImage = new Image({
      imageUrl: `/uploads/${req.file.filename}`,
      title: req.body.title,
    });

    newImage
      .save()
      .then(
        (image) => {
          res.statusCode = 201;
          res.setHeader('Content-Type', 'text/plain');
          res.json(image);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .get((req, res, next) => {
    Image.find({}).sort({_id : -1})
      .then(
        (images) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/plain');
          res.json(images);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

ImageRouter
    .route('/:id')
    .delete(authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Image.findById(req.params.id)
        .then((image) => {
            const filename = image.imageUrl.split('/uploads/')[1];
            fs.unlink(`uploads/${filename}`, () => {
            Image.findByIdAndDelete(id)
                .then(
                () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.json('deleted!');
                },
                (err) => next(err)
                )
                .catch((err) => next(err));
            });
        })
        .catch((err) => res.status(400).json({ error: err }));
    });



module.exports = ImageRouter;
