const express = require("express");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
var authenticate = require("../middlewares/authenticate");
const blogRouter = express.Router();

blogRouter
    .route('/')
    .post( authenticate.verifyUser, (req,res, next) => {
        const newBlog = new Blog({
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            date: req.body.date,
            isPublic: req.body.isPublic,
            vues: req.body.vues,
            language: req.body.language,
            content: req.body.content,
        })

        newBlog
            .save()
            .then(
                (blog) => {
                  res.statusCode = 201;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(blog);
                },
                (err) => next(err)
              )
            .catch((err) => next(err));
    })
    .get(async(req, res, next) => {
        const total = await Blog.countDocuments({})

        Blog.find({})
            .then(
                (blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({data:blogs, totalBlogs: total});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

blogRouter
    .route('/:language')
    .get(async (req, res, next) => {
        const language = req.params.language;
        const {page, sort, searchQuery} = req.query
        const search = new RegExp (searchQuery, 'i')
        const LIMIT = searchQuery.length>0 ? 1000 : 4;
        const startIndex = searchQuery.length>0 ? 0 : (Number(page)-1)*LIMIT ;
        const filterConditions = searchQuery.length>0 ? { language:language,isPublic:true, $or: [{title :{$regex: search}}, {description :{$regex: search}}]} : { language:language,isPublic:true}
        const total = await Blog.countDocuments(filterConditions)

        Blog.find(filterConditions).sort({_id : Number(sort)}).limit(LIMIT).skip(startIndex)
            .then(
                (blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({data : blogs, currentPage : Number(page), numberOfPages : Math.ceil(total/LIMIT)});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })


blogRouter
    .route('/mostseen/:language')
    .get( (req, res, next) => {
        const language = req.params.language;
        const LIMIT = 10

        Blog.find({language:language, isPublic:true}).sort({vues : -1}).limit(LIMIT)
            .then(
                (blogs) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({mostSeenBlogs : blogs});
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

blogRouter
    .route('/blog/:id')
    .get( (req, res, next) => {
        const { id } = req.params;
        Blog.findById(id)
            .then(
                (blog) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);
        const updatedBlog = {
            _id: id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            date: req.body.date,
            isPublic: req.body.isPublic,
            vues: req.body.vues,
            language: req.body.language,
            content: req.body.content,
        }
        Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
            .then(
                (blog) => {
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(blog);
                    },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .delete( authenticate.verifyUser, (req, res, next) => {
        const { id } = req.params;
        Blog.findByIdAndDelete(id)
            .then(
                () => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json("blog deleted");
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
blogRouter
    .route('/blog/count/:id')
    .put( (req, res, next) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);
        const updatedBlog = {
            _id: id,
            vues: req.body.vues,
        }
        Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
            .then(
                (blog) => {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.json(blog);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })

module.exports = blogRouter