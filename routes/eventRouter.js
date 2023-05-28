const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/event");
var authenticate = require("../middlewares/authenticate");
const eventRouter = express.Router();

eventRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newEvent = new Event({
            title: req.body.title,
            date: req.body.date,
            time: req.body.time,
            addressGovernorate: req.body.addressGovernorate,
            address: req.body.address,
            addressImage: req.body.addressImage,
            description: req.body.description,
            invitation: req.body.invitation,
            duration: req.body.duration,
            session: req.body.session,
            speakers: req.body.speakers,
            schedule: req.body.schedule,
            sponsors: req.body.sponsors,
            imageUrl: req.body.imageUrl,
            isPublic: req.body.isPublic,
            language: req.body.language,
        })

        newEvent
            .save()
            .then(
                (event) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(event);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get(async (req, res, next) => {
        const total = await Event.countDocuments({})
        Event.find({})
            .then(
                (events) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({data: events, totalEvents: total});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

eventRouter
    .route('/:language')
    .get( async(req, res, next) => {
        const language = req.params.language;
        const {page} = req.query
        const LIMIT = 4
        const startIndex = (Number(page)-1)*LIMIT
        const total = await Event.countDocuments({language:language, isPublic:true})

        Event.find({language:language, isPublic:true}).sort({_id : -1}).limit(LIMIT).skip(startIndex)
            .then(
                (events) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({data : events, currentPage : Number(page), numberOfPages : Math.ceil(total/LIMIT)});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })


eventRouter
    .route('/lastevent/:language')
    .get( async(req, res, next) => {
        const language = req.params.language;
        const LIMIT = 3

        Event.find({language:language, isPublic:true}).sort({_id : -1}).limit(LIMIT)
            .then(
                (events) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({lastEvents : events});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

eventRouter
    .route('/event/:id')
    .get( (req, res, next) => {
        const { id } = req.params;
        Event.findById(id)
            .then(
                (event) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No event with id: ${id}`);
        const updatedEvent = {
            _id: id,
            title: req.body.title,
            date: req.body.date,
            time: req.body.time,
            addressGovernorate: req.body.addressGovernorate,
            address: req.body.address,
            addressImage: req.body.addressImage,
            description: req.body.description,
            invitation: req.body.invitation,
            duration: req.body.duration,
            session: req.body.session,
            speakers: req.body.speakers,
            schedule: req.body.schedule,
            sponsors: req.body.sponsors,
            imageUrl: req.body.imageUrl,
            isPublic: req.body.isPublic,
            language: req.body.language,
        }
        Event.findByIdAndUpdate(id, updatedEvent, { new: true })
            .then(
                (event) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Event.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("event deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

eventRouter
    .route('/event/attendance/:id')
    .put( (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);
        Event.updateOne({ "_id": id }, {$push: {"attendance": {"name":req.body.name, "phone":req.body.phone, "email":req.body.email}}} , { new: true })
            .then(
                (event) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(event);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = eventRouter