const express = require("express");
const mongoose = require("mongoose");
const Visitor = require("../models/visitor");
var authenticate = require("../middlewares/authenticate");
const visitorRouter = express.Router();

visitorRouter
    .route('/')
    .post( (req,res, next) => {
        const newVisitor = new Visitor({
            visitor: 1,
        })

        newVisitor
            .save()
            .then(
                (visitor) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(visitor);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get((req, res, next) => {
        Visitor.find({})
            .then(
                (visitors) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(visitors);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })



module.exports = visitorRouter