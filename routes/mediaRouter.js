const express = require("express");
const mongoose = require("mongoose");
const Media = require("../models/media");
var authenticate = require("../middlewares/authenticate");
const mediaRouter = express.Router();

mediaRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newMedia = new Media({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            videoUrl: req.body.videoUrl,
            description: req.body.description,
            date: req.body.date,
            language: req.body.language,
        })

        newMedia
            .save()
            .then(
                (media) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(media);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Media.find({}).sort({_id:-1})
            .then(
                (medias) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(medias);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

mediaRouter
    .route('/:language')
    .get((req, res, next) => {
        const language = req.params.language;
        Media.find({language:language}).sort({_id:-1})
            .then(
                (medias) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(medias);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

mediaRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Media.findById(id)
            .then(
                (media) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(media);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No faq with id: ${id}`);
        const updatedMedia = {
            _id: id,
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            videoUrl: req.body.videoUrl,
            description: req.body.description,
            date: req.body.date,
            language: req.body.language,
        }
        Media.findByIdAndUpdate(id, updatedMedia, { new: true })
            .then(
                (media) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(media);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Media.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("media deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = mediaRouter