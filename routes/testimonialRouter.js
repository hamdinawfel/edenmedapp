const express = require("express");
const mongoose = require("mongoose");
const Testimonial = require("../models/testimonial");
var authenticate = require("../middlewares/authenticate");
const testimonialRouter = express.Router();

testimonialRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newTestimonial = new Testimonial({
            name: req.body.name,
            position: req.body.position,
            description: req.body.description,
            avatarUrl: req.body.avatarUrl,
            language: req.body.language
        })

        newTestimonial
            .save()
            .then(
                (testimonial) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(testimonial);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req,res, next) => {
        Testimonial.find({})
            .then(
                (testimonials) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(testimonials);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

testimonialRouter
    .route('/:language')
    .get((req,res, next) => {
        const language = req.params.language;
        Testimonial.find({language: language})
            .then(
                (testimonials) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(testimonials);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

testimonialRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Testimonial.findById(id)
            .then(
                (testimonial) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(testimonial);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req,res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No testimonial with id: ${id}`);
        const updatedTestimonial = {
            _id: id,
            name: req.body.name,
            position: req.body.position,
            description: req.body.description,
            avatarUrl: req.body.avatarUrl,
            language: req.body.language
        }
        Testimonial.findByIdAndUpdate(id, updatedTestimonial, { new: true })
            .then(
                (testimonial) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(testimonial);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Testimonial.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("testimonial deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = testimonialRouter