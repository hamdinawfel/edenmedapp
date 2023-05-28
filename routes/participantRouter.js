const express = require("express");
const mongoose = require("mongoose");
const Participant = require("../models/participant");
var authenticate = require("../middlewares/authenticate");
var checkClientIsParticipated = require("../middlewares/checkClientIsParticipated");
const sendConfirmationEmail = require("../middlewares/sendConfirmationEmail");
const participantRouter = express.Router();
var jwt = require('jsonwebtoken');


participantRouter
    .route('/')
    .post( checkClientIsParticipated, (req,res, next) => {
        const charactters = "0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN"
        let activationCode = ""
        for(let i=0;i<=50;i++){
            activationCode += charactters[Math.floor(Math.random() * charactters.length)]
        }


        const newParticipant = new Participant({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            organism: req.body.organism,
            eventId: req.body.eventId,
            eventTitle: req.body.eventTitle,
            eventDate: req.body.eventDate,
            activationCode,
        });
        const emailData = {
            email: req.body.email,
            eventTitle: req.body.eventTitle,
            eventImageUrl: req.body.eventImageUrl,
            activationCode,
        };

        newParticipant
            .save()
            .then(
                (participant) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(participant);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
        
        sendConfirmationEmail(emailData)
    })
    .get((req, res, next) => {
        Participant.find({})
            .then(
                (participants) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(participants);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

participantRouter
    .route('/:eventId')
    .get((req, res, next) => {
        const eventId = req.params.eventId;
        Participant.find({eventId:eventId, isActive: true})
            .then(
                (participants) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(participants);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

participantRouter
    .route('/participant/:id')
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Participant.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("participant deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })


participantRouter
    .route('/participant/confirmation/:activationCode')
    .put( (req, res, next) => {
        const updatedParticipant = {
            isActive: true,
        }
        Participant.findOneAndUpdate({activationCode:req.params.activationCode}, updatedParticipant, { new: true })
                    .then((participant) => {
                            if(!participant) {
                                res.json({message: "code do not exist!!!"})
                            }
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({message: "Participation is confirmed."});
                        },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
    })


module.exports = participantRouter