const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../models/photo");
var authenticate = require("../middlewares/authenticate");
const photoRouter = express.Router();

photoRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newPhoto = new Photo({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            date: req.body.date,
            language: req.body.language,
        })

        newPhoto
            .save()
            .then(
                (photo) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(photo);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Photo.find({}).sort({_id:-1})
            .then(
                (photos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photos);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

photoRouter
    .route('/:language')
    .get((req, res, next) => {
        const language = req.params.language;
        Photo.find({language:language}).sort({_id:-1})
            .then(
                (photos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photos);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

photoRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Photo.findById(id)
            .then(
                (photo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No photo with id: ${id}`);
        const updatedPhoto = {
            _id: id,
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            date: req.body.date,
            language: req.body.language,
        }
        Photo.findByIdAndUpdate(id, updatedPhoto, { new: true })
            .then(
                (photo) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(photo);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Photo.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("photo deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = photoRouter