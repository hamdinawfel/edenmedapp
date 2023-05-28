const express = require("express");
const mongoose = require("mongoose");
const Member = require("../models/member");
var authenticate = require("../middlewares/authenticate");
const MemberRouter = express.Router();

MemberRouter
    .route('/')
    .post(authenticate.verifyUser, (req,res, next) => {
        const NewMember = new Member({
            fullname: req.body.fullname,
            occupation: req.body.occupation,
            imageUrl: req.body.imageUrl,
        })

        NewMember
            .save()
            .then(
                (member) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(member);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Member.find({})
            .then(
                (members) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(members);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

MemberRouter
    .route('/:id')
    .get( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Member.findById(id)
            .then(
                (member) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(member);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No photo with id: ${id}`);
        const updatedMember = {
            _id: id,
            fullname: req.body.fullname,
            occupation: req.body.occupation,
            imageUrl: req.body.imageUrl,
        }
        Member.findByIdAndUpdate(id, updatedMember, { new: true })
            .then(
                (member) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(member);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Member.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("member deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = MemberRouter