const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/feedback");
var authenticate = require("../middlewares/authenticate");
const feedbackRouter = express.Router();

feedbackRouter
    .route('/')
    .post((req,res, next) => {
        const newFeedback = new Feedback({
            userInformations: req.body.userInformations,
            answers: req.body.answers,
            title: req.body.title,
        })

        newFeedback
            .save()
            .then(
                (feedback) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(feedback);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        const { searchQuery } = req.query;
        const search = new RegExp (searchQuery, 'i');
        const filterConditions = searchQuery.length>0 ? {title :{$regex: search}} : {}

        Feedback.find(filterConditions)
            .then(
                (feedbacks) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feedbacks);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

feedbackRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Feedback.findById(id)
            .then(
                (feedback) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feedback);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Feedback.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("Feedback deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = feedbackRouter