const express = require("express");
const mongoose = require("mongoose");
const Faq = require("../models/faq");
var authenticate = require("../middlewares/authenticate");
const faqRouter = express.Router();

faqRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newFaq = new Faq({
            question: req.body.question,
            response: req.body.response,
            language: req.body.language
        })

        newFaq
            .save()
            .then(
                (faq) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(faq);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Faq.find({})
            .then(
                (faqs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(faqs);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

faqRouter
    .route('/:language')
    .get((req, res, next) => {
        const language = req.params.language;
        Faq.find({language: language})
            .then(
                (faqs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(faqs);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

faqRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Faq.findById(id)
            .then(
                (faq) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(faq);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No faq with id: ${id}`);
        const updatedFaq = {
            _id: id,
            question: req.body.question,
            response: req.body.response,
            language: req.body.language
        }
        Faq.findByIdAndUpdate(id, updatedFaq, { new: true })
            .then(
                (faq) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(faq);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Faq.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("faq deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = faqRouter