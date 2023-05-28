const express = require("express");
const mongoose = require("mongoose");
const Document = require("../models/document");
var authenticate = require("../middlewares/authenticate");
const documentRouter = express.Router();

documentRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newDocument = new Document({
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            fileUrl: req.body.fileUrl,
            description: req.body.description,
            language: req.body.language,
        })

        newDocument
            .save()
            .then(
                (document) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(document);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Document.find({}).sort({_id:-1})
            .then(
                (documents) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(documents);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

documentRouter
    .route('/:language')
    .get((req, res, next) => {
        const language = req.params.language;
        Document.find({language:language}).sort({_id:-1})
            .then(
                (documents) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(documents);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

documentRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Document.findById(id)
            .then(
                (document) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(document);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No faq with id: ${id}`);
        const updatedDocument = {
            _id: id,
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            fileUrl: req.body.fileUrl,
            description: req.body.description,
            language: req.body.language,
        }
        Document.findByIdAndUpdate(id, updatedDocument, { new: true })
            .then(
                (document) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(document);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Document.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("document deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = documentRouter