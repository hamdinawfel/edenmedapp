const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/message");
var authenticate = require("../middlewares/authenticate");
const messageRouter = express.Router();

messageRouter
    .route('/')
    .post((req,res, next) => {
        const newMessage = new Message({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            message: req.body.message,
        })

        newMessage
            .save()
            .then(
                (message) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(message);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Message.find({})
            .then(
                (messages) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(messages);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

messageRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Message.findById(id)
            .then(
                (message) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(message);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Message.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("message deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = messageRouter